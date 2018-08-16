var Eos = require('eosjs');
var request = require('request');

var ClaimRewards = {
  producerName: 'eosiomeetone',
  permission: 'claimer',
  dingding: 'https://oapi.dingtalk.com/robot/send?access_token=', // dingding notification API
  eosConfig: {
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
    httpEndpoint: 'https://mainnet.meet.one',
    expireInSeconds: 60,
    broadcast: true,
    debug: false, // API and transactions
    sign: true,
    keyProvider: ''
  },
  eos: {},
  init: function () {
    this.eos = Eos(this.eosConfig);
    this.detectLastClaimTime();
  },
  // detect last claim time
  detectLastClaimTime: function () {
    var self = this;
    this.eos.getTableRows({
      'json': true,
      'code': 'eosio',
      'scope': 'eosio',
      'table': 'producers',
      'lower_bound': this.producerName,
      'limit': '1'
    }).then(function (result) {
      var last_claim_time = result.rows[0].last_claim_time / 1000;
      if (Date.now() - last_claim_time >= 24 * 60 * 60 * 1000) {
        console.log('claim reward:', new Date());
        self.claimReward();
      } else {
        console.log('can not claim reward right now.');
      }
    });

    setTimeout(function () {
      self.detectLastClaimTime();
    }, 1000 * 10);
  },
  claimReward: function () {
    var self = this;
    this.eos.transaction({
      actions: [
        {
          account: 'eosio',
          name: 'claimrewards',
          authorization: [{
            actor: this.producerName,
            permission: this.permission
          }],
          data: {
            owner: this.producerName
          }
        }
      ]
    }).then(function () {
      // get account balance after claim reward.
      var date = new Date();
      var dateToString = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
      self.eos.getCurrencyBalance({
        'code': 'eosio.token',
        'account': self.producerName,
      }).then(function (res) {
        self.sendMessage(dateToString, res[0]);
      });
    }, function (err) {
      console.log('claim reward fail.');
      console.log(err);
    });
  },
  // send message to dingding group
  sendMessage: function (date, balance) {
    var params = {
      "msgtype": "text",
      "text": {
        "content": date + ", EOS.IO BP " + this.producerName + " claim reward, the balance of account " + this.producerName + " is " + balance
      }
    };
    var options = {
      method: 'POST',
      url: this.dingding,
      headers: {
        'Content-Type': 'application/json'
      },
      json: params
    };
    request(options);
  }
};

ClaimRewards.init();