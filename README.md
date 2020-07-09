This project is intended to provide an easy and efficient way to exchange tokens,
Tez to tokens and vice versa. Using smart contracts users can add own tokens
to exchange, invest liquidity and make profit in fully decentralized way.

Current implementation supports FA1.2 tokens.

# Architecture

The solution consist of 3 type of contracts:

1. Factory : singleton used to deploy new exchange pair and route Tez during token to token exchanges;
2. Dex : contract for TokenX-XTZ pair exchanges;
3. Token : FA1.2 token standart.

# Prerequirements

- installled Ligo:

```
curl https://gitlab.com/ligolang/ligo/raw/dev/scripts/installer.sh | bash -s "next"
```

- node packages:

```
npm i
```

# Usage

Contracts are processed the following stages:

1. Compilation
2. Deployment
3. Configuration
4. Interactions on-chain

## Compilation

To compile the contracts and generate Michelson:

```
npm run build
```

Here we compile `Dex.ligo` to raw Michelson. This code will be deployed during Factories `LaunchExchange` call to add new exchange-pair. And then compile other contracts and store them in json format to deploy with [taquito](https://tezostaquito.io/).

Сompiled Factory and Token are stored in `build/`.

## Factory & Token Deployment

Run:

```
npm run deploy
```

First we prepare storage for Factory contract and then contracts are deployed to the network.

Addresses of deployed contacts sre displayed and stored to `deploy` folder in JSON format.

## Factory Configuration

Because of **_gas limit issue_** it is impossible to put all the functions to the code sections of the contract(and execute it). Instead they are stored in as lambdas in `big_map`. Their code cannot be placed to the storage due to **_operation size limits issue_**. So each Dex function is added to Factory by separate transaction. Run:

```
npm run set-functions
```

After this step new token pairs can be deployed.

## Exchange Pair Deployment

Each token can have no more the one Exchange Pair contract(aka. `Dex`). To add new token `LaunchExchange` of Factory contract is called and new empty `Dex` instance is deployed.
Run:

```
npm run add-tokens
```

Now exchnage can be used.

# Entrypoints

## Factory

- launchExchange(token: address): deploys new empty `Dex` for `token` and store the address of new contract;
- tokenToExchangeLookup(token: address, receiver: address, minTokenOut: nat) : look for `Dex` address for `token` and call `use(1n,TezToTokenPayment(minTokenOut, receiver))` resending received TRX to exchange.
- configDex(token: address): set lambdas to deployed `Dex` contract.
- setFunction(funcIndex: nat, func : (dexAction, dex_storage, address) -> (list(operation), dex_storage)):

## Dex

- setSettings(funcs: big_map(nat, (dexAction, dex_storage, address) -> (list(operation), dex_storage))) : set `funcs` that are sent from Factory to `lambdas`; these functions can be executed with `use` entrypoint.
- default() : default entrypoint to receive payments; received XTZ are destributed between liquidity providers in the end of the delegation circle.
- use(funcIndex: nat, action: dexAction) : executes the function with index `funcIndex` from `lambdas` with parameters `action`.

Actions have the following parameters (index in the list matches the index in `lambdas`):

0. initializeExchange(tokenAmount: nat) : sets initial liquiidty, XTZ must be sent.
1. tezToToken(minTokensOut: nat, receiver: address) : exchanges XTZ to tokens and sends them to `receiver`; operation is reverted if the amount of exchanged tokens is less than `minTokensOut`.
2. tokenToTez(tokensIn: nat, minTezOut: nat, receiver: address) : exchanges `tokensIn` tokens to XTZ and sends them to `receiver`; operation is reverted if the amount of exchanged XTZ is less than `minTezOut`.
3. tokenToTokenOut(tokensIn: nat, minTokensOut: nat, token: address, receiver: address) : exchanges `tokensIn` of current token to `token` and sends them to `receiver`; operation is reverted if the amount of exchanged `token` is less than `minTokensOut`.
4. investLiquidity(minShares: nat) : allows to own `minShares` by investing tokens and XTZ; corresponding amount of XTZ should be sent woth transaction and amount of tokens should be approved to be spent by `Dex`.
5. divestLiquidity(sharesBurned: nat, minTezDivested: nat, minSharesDivested: nat) : divests `sharesBurned` and sends tokens and XTZ to owner; operation is reverted if the amount of divested tokens is smaller than `minTezDivested` or the amount of divested XTZ is smaller than `minTezDivested`.
6. setVotesDelegation(deputy: address, isAllowed: bool) : allows or prohibits `deputy` to vote with sender shares.
7. vote(voter: address, candidate: key_hash) : votes for `candidate` with shares of `voter`.
8. veto(voter: address) : votes agains current deligate with shares of `voter`.
9. default() : default entrypoint to receive payments; received XTZ are destributed between liquidity providers in the end of the delegation circle.
10. withdrawProfit(receiver: address) : withdraws delagation reward of sender to `receiver` address.

## Token FA1.2

Implements standart [FA1.2 interface](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-7/tzip-7.md).

# Testing

Mocha is used for testing and is installed along with other packages.
Run:

```
npm test
```

NOTE: if you want to use different network, configure `$npm_package_config_network` in `package.json`
