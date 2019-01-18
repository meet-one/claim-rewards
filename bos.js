var Eos = require('eosjs');
var request = require('request');

module.exports = {
  producerName: 'bosiomeetone',
  permission: 'claimer',
  dingding: 'https://oapi.dingtalk.com/robot/send?access_token=', // dingding notification API
  eosConfig: {
    chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86', // 32 byte (64 char) hex string
    httpEndpoint: 'https://bos-api.meet.one',
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
      var last_claim_time = new Date(result.rows[0].last_claim_time).getTime();
      if (Date.now() - last_claim_time >= 24 * 60 * 60 * 1000) {
        console.log('claim reward on BOS:', new Date());
        self.claimReward();
      } else {
        console.log('can not claim reward on BOS right now.');
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
        'account': self.producerName
      }).then(function (res) {
        self.sendMessage(dateToString, res[0]);
      });
    }, function (err) {
      console.log('claim reward failed on BOS.');
      console.log(err);
    });
  },
  // send message to dingding group
  sendMessage: function (date, balance) {
    var params = {
      "msgtype": "text",
      "text": {
        "content": date + ",claimed reward on BOS, " + this.producerName + " : " + balance
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
