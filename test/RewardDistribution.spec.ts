import { Context } from "./helpers/context";
import saveContractAddress from "../helpers/saveContractAddress";
const standard = process.env.EXCHANGE_TOKEN_STANDARD;

contract("RewardsDistribution()", function () {
  let context: Context;
  let tokenAddress: string;
  let pairAddress: string;

  before(async () => {
    context = await Context.init([], false, "alice", false);
    await context.setDexFactoryFunction(0, "initialize_exchange");
    await context.setDexFactoryFunction(3, "withdraw_profit");
    await context.setDexFactoryFunction(4, "invest_liquidity");
    await context.setDexFactoryFunction(5, "divest_liquidity");
    await context.setDexFactoryFunction(6, "vote");
    await context.setDexFactoryFunction(7, "veto");
    await context.setDexFactoryFunction(8, "receive_reward");
    await context.factory.setTokenFunction(0, "transfer");
    await context.factory.setTokenFunction(
      1,
      standard == "FA2" ? "update_operators" : "approve"
    );
    pairAddress = await context.createPair({
      tezAmount: 100,
      tokenAmount: 100,
    });
    tokenAddress = await context.pairs[0].contract.address;
    saveContractAddress('dex', tokenAddress);
    await context.pairs[0].sendReward(1000000);
  });

    it('launches DEX contract', async function () {
        // this a preparation for the token-farm test
        // Alice is ready to transfer tokens
    });
});
