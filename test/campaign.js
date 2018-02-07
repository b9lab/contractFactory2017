var Campaign = artifacts.require("./Campaign.sol");

contract('Campaign', function(accounts) {

  var contract;
  var goal = 1000;
  var duration = 10;
  var expectedDeadline;

  var owner = accounts[0];
  var funder1 = accounts[1];  var contribution1 = 1;
  var funder2 = accounts[2];  var contribution2 = 10;

  beforeEach(function() {
    return Campaign.new(owner, duration, goal, {from: owner})
    .then(function(instance) {
      contract = instance;
      web3.eth.getBlockNumber(function(error, bn) {
        expectedDeadline = bn + duration;
      });
    });
  });

  it("should just say hello", function() {
    assert.strictEqual(true,true,"Something is wrong.");
  });

  it("should be owned by owner", function() {
    return contract.owner({from: owner})
    .then(function(_owner) {
      assert.strictEqual(_owner, owner, "Contract is not owned by owner");
    });
  });

  it("should have a deadline", function() {
    return contract.deadline({from: owner, gas:4000000})
    .then(function(_deadline) {
      assert.equal(_deadline.toString(10), expectedDeadline, "Deadline is incorrect");
    });
  });

  it("it should process contributions", function() {
    var fundsRaised;
    var funder1Contribution;
    var funder2Contribution;
    return contract.contribute({from: funder1, value: contribution1})
    .then(function(txn) {
      return web3.eth.getTransactionReceiptMined(txn)
      .then(function(txn) {
        return contract.contribute({from: funder2, value: contribution2})
        .then(function(txn) {
          return web3.eth.getTransactionReceiptMined(txn)
          .then(function(txn) {
          return contract.fundsRaised({from: owner});
          })
          .then(function(_raised) {
            fundsRaised = _raised;
            return contract.funderStructs(0,{from: owner});
          })
          .then(function(_funder1) {
            funder1Contribution = _funder1[0].toString(10);
            console.log("funder1", _funder1);
            return contract.funderStructs(1, {from: owner});
          })
          .then(function(_funder2) {
            funder2Contribution = _funder2[0].toString(10);
            console.log("funder 2", _funder2);
            assert.equal(fundsRaised.toString(10), contribution1 + contribution2, "Funds raised is incorrect.");
            assert.equal(funder1Contribution, contribution1, "Funder 1's contribution was not tracked.");
            assert.equal(funder2Contribution, contribution2, "Funder 2's contribution was not tracked.");
            return contract.isSuccess({from: owner});
          })
          .then(function(_isSuccess) {
            assert.strictEqual(_isSuccess, false, "Project was declared success early.");
            return contract.hasFailed({from: owner});
          })
          .then(function(_hasFailed) {
            assert.strictEqual(_hasFailed, false, "Project was declared failed early.");
          });
        });
      });
    });
  });

});

/*
// https://gist.github.com/xavierlepretre/88682e871f4ad07be4534ae560692ee6

web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        web3.eth.getTransactionReceipt(txnHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else {
                if (receipt == null) {
                    setTimeout(function () {
                        transactionReceiptAsync(txnHash, resolve, reject);
                    }, interval);
                } else {
                    resolve(receipt);
                }
            }
        });
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};
*/
