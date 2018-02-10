## Contract Factory - April 2017

This is the finished app that goes with the video series. 

### Works with

- ubuntu 16.04
- angular v1.5.6
- nodejs v6.10.0
- truffle v3.1.9
- solc 0.4.6
- testrpc v3.0.3
- truffle-default-builder 2.0.0

### To get it working

This repo is not compatible with truffle 4.x or ganache-cli. 
To get it working, install older versions of both as follows:

Start with Ubuntu 16.04

You need node & npm. 

```
$ npm --version
$ nvm --version
```

If it's not there, install the Node Version Manager

```
$ sudo apt-get update
$ sudo apt-get install build-essential libssl-dev
$ curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash
```
You have to close your terminal and start a new one. 

Install node v6, npm and git
```
$ nvm install 6
$ node --version
$ sudo apt-get install npm git
```

Install truffle and testrpc

```
$ npm install -g truffle@3.1.9
$ npm install -g ethereumjs-testrpc
```

Clone the reop
```
$ git clone https://github.com/rob-Hitchens/contractFactory2017.git
```

Move to the project folder
```
cd contractFactory2017
```

```
$ npm install
```

NOTE: Some students have reported strange errors when the windows are open randomly instead of as described here. 

Open a new window and run a blockchain on port 8545

```
$ nvm use 6
$ testrpc
```

Back to the first window. Run

```
$ truffle compile --all
$ truffle migrate --reset
```

Build the UI app from sources

```
$ truffle build
```

Serve the UI app

```
$ cd build
$ truffle serve
```

Open a web browser to http://localhost:8080
