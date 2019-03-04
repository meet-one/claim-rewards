let eosutils = require('./eos-utils.js')
{
    let eosClaimer = new eosutils.Claimer(
      'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      , 'https://mainnet.meet.one', 'EOS mainnet', 'eosiomeetone', 'claimer'
      , '*'
      , '*')
    eosClaimer.detectLastClaimTime()
}
{
    let bosClaimer = new eosutils.Claimer(
      'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86'
      , 'https://bos-api.meet.one', 'BOS', 'bosiomeetone', 'claimer'
      , '*'
      , '*')
    bosClaimer.detectLastClaimTime()
}
{
    let meetoneClaimer = new eosutils.Claimer(
      'cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422'
      , 'https://fullnode.meet.one', 'MEETONE', 'meetone.m', 'claimer'
      , '*'
      , '*')
    meetoneClaimer.detectLastClaimTime()
}
