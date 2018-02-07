var app = angular.module('campaignApp', []);

// Configure preferences for the Angular App

app.config(function( $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

// Define an App Controller with some Angular features

app.controller("campaignController", 
  [ '$scope', '$location', '$http', '$q', '$window', '$timeout', 
  function($scope, $location, $http, $q, $window, $timeout) {


  // We need an array for the UI

  $scope.contributionLog=[];

  // Instantiate the contract and check the status

  Campaign.deployed().then(function(_instance) {
    $scope.contract = _instance;
    console.log("The contract:", $scope.contract);

    // don't want this to happen before the contract is known

    $scope.contributionWatcher = $scope.contract.LogContribution( {}, {fromBlock: 0})
    .watch(function(err, newContribution) {
      if(err) {
        console.log("Error watching contribution events", err);
      } else {
        console.log("Contribution", newContribution);
        newContribution.args.amount = newContribution.args.amount.toString(10);
        $scope.contributionLog.push(newContribution);
        return $scope.getCampaignStatus();
      }
    });

    return $scope.getCampaignStatus();
  });

  $scope.contribute = function() {
    if(parseInt($scope.newContribution)<=0) return;
    console.log("contribution", $scope.newContribution);
    var newContribution = $scope.newContribution;
    $scope.newContribution = "";
    $scope.contract.contribute({from: $scope.account, value: parseInt(newContribution), gas: 900000})
    .then(function(txn) {
      console.log("Transaction Receipt:", txn);
      return $scope.getCampaignStatus();
    })
    .catch(function(error) {
      console.log("Error processing contribution", error);
    })
  }

  // Get the Campaign Status

  $scope.getCampaignStatus = function() {
    return $scope.contract.fundsRaised({from: $scope.account})
    .then(function(_fundsRaised) {
      console.log("fundsRaised", _fundsRaised.toString(10));
      $scope.campaignFundsRaised = _fundsRaised.toString(10);
      return $scope.contract.goal({from: $scope.account});
    })
    .then(function(_goal) {
      $scope.campaignGoal = _goal.toString(10);
      return $scope.contract.deadline({from: $scope.account});
    })
    .then(function(_deadline) {
      $scope.campaignDeadline = _deadline.toString(10);
      $scope.$apply();
      return $scope.contract.owner({from: $scope.account});
    })
    .then(function(_owner) {
      $scope.campaignOwner = _owner;
      return $scope.contract.isSuccess({from: $scope.account});
    })
    .then(function(_isSuccess) {
      $scope.campaignIsSuccess = _isSuccess;
      return $scope.contract.hasFailed({from: $scope.account});
    })
    .then(function(_hasFailed) {
      $scope.campaignHasFailed = _hasFailed;
      return $scope.getCurrentBlockNumber();
    })
  }

  // Get the block number

  $scope.getCurrentBlockNumber = function() {
    web3.eth.getBlockNumber(function(err, bn) {
      if(err) {
        console.log("error getting block number", err);
      } else {
        console.log("Current Block Number", bn);
        $scope.blockNumber = bn;
        $scope.$apply();
      }
    });
  }

  // work with the first account

  web3.eth.getAccounts(function(err, accs) {
    if(err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }
    if(accs.length ==0) {
      alert("Couldn't get any accounts. Make sure your Ethereum client is configured correctly.");
      return;
    }
    $scope.accounts = accs;
    $scope.account  = $scope.accounts[0];
    console.log("using account", $scope.account);

    web3.eth.getBalance($scope.account, function(err,_balance) {
      $scope.balance = _balance.toString(10);
      console.log("balance", $scope.balance);
      $scope.balanceInEth = web3.fromWei($scope.balance, "ether");
      $scope.$apply();
    })

  });

}]);