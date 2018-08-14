# claim-rewards

claim rewards automatically, based on eosjs.

## Setup Permission

```
cleos set account permission producer_name claimer '{"threshold":1,"keys":[{"key":"public_key","weight":1}]}' "active" -p producer_name@active
cleos set action permission producer_name eosio claimrewards claimer
```

## Install

```
npm i -d
```


## Start

```
node index.js
```

## Start with PM2

```
npm prune --D && npm install --D; NODE_ENV=production PORT=5555 pm2 reload process.json --only node-claimrewards-production
```