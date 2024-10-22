import { BlockfrostProvider, BrowserWallet, Transaction } from "@meshsdk/core";
import { StakeButton, useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import Input from "./components/Input";

const blockfrostApiKey = process.env.NEXT_PUBLIC_APIKEY!;

export default function Home() {
  const blockchainProvider = new BlockfrostProvider(blockfrostApiKey);

  const walletInfo = useWallet();

  const [poolId, setPoolId] = useState<string | null>(
    "pool12jthfp4uqah0yndtdu6x2tqaxvgnlpc7h30gvwey3rsrc789tme"
  );

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [messageAfterStake, setMessageAfterStake] = useState<string | null>("");

  const [isStakeAddressRegistered, setIsStakeAddressRegistered] =
    useState(false);

  const [wallet, setBrowserWallet] = useState<BrowserWallet | null>(null);
  const [rewardAddress, setRewardAddress] = useState<string | null>(null);

  const checkIfRegistered = async (stakeAddress: string) => {
    const info = await blockchainProvider.get(`/accounts/${stakeAddress}`);
    const { active } = info;
    setIsStakeAddressRegistered(active);
  };

  useEffect(() => {
    if (walletInfo.name) {
      BrowserWallet.enable(walletInfo.name).then((wallet) => {
        setBrowserWallet(wallet);
        wallet.getRewardAddresses().then((addresses) => {
          setRewardAddress(addresses[0]);
          checkIfRegistered(addresses[0]);
        });
        setError("");
      });
    }
  }, [walletInfo.name]);

  const userHasStaked = () => {
    // Do something after user has staked to the pool
    setMessageAfterStake(`You has staked to the pool. Great job! 🎉
      In real-world cases, you can show useful information to the user after they have staked to the pool. For example, sending them appreciation emails, showing links to discord channels, or other resources that can help them learn more about your activity.`);
  };

  const registerStake = async () => {
    if (!rewardAddress) {
      setError("Error registering stake address: Connect your wallet first");
      return;
    }

    if (isStakeAddressRegistered) {
      setError(
        "Error registering stake address: Stake address is already registered"
      );
      return;
    }

    try {
      const tx = new Transaction({ initiator: wallet });
      tx.registerStake(rewardAddress);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash: ", txHash);

      if (txHash) {
        setSuccess("Registered stake address successfully");
        setIsStakeAddressRegistered(true);
      }
    } catch (e) {
      setError(`Error registering stake address: ${e}`);
    }
  };

  const deregisterStake = async () => {
    if (!rewardAddress) {
      setError("Error de-registering stake address: Connect your wallet first");
      return;
    }

    if (!isStakeAddressRegistered) {
      setError(
        "Error de-registering stake address: Stake address is not registered"
      );
      return;
    }

    try {
      const tx = new Transaction({ initiator: wallet });
      tx.deregisterStake(rewardAddress);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash: ", txHash);
      if (txHash) {
        setSuccess("De-registered stake address successfully");
        setIsStakeAddressRegistered(false);
      }
    } catch (e) {
      setError(`Error de-registering stake address: ${e}`);
    }
  };

  const stakeToPool = async () => {
    if (!rewardAddress) {
      setError("Connect your wallet first before staking to pool");
      return;
    }

    try {
      const tx = new Transaction({ initiator: wallet });
      if (!isStakeAddressRegistered) {
        tx.registerStake(rewardAddress);
      }

      tx.delegateStake(rewardAddress, poolId);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("txHash: ", txHash);

      if (txHash) {
        setSuccess("Staked to pool successfully");
      }
    } catch (e) {
      setError(`Error staking to pool: ${e}`);
    }
  };

  return (
    <div className="relative max-w-screen-xl w-screen mx-auto text-gray-500">
      <div className="relative w-full px-4 py-8 flex flex-col gap-8 lg:py-16">
        <h1 className="font-bold text-gray-800 text-3xl">
          <a href="https://meshjs.dev/">Mesh</a> Pool Operator Portal
        </h1>

        <div className="box">
          <h2 className="font-semibold">Stake Pool ID</h2>
          <Input value={poolId} onChange={(e) => setPoolId(e.target.value)} />
        </div>

        <div className="flex relative mb-4 flex-col gap-2 box">
          {wallet ? (
            <>
              <h2>Your rewardAddress: </h2>
              {rewardAddress}
            </>
          ) : (
            <h2>Connect your wallet to get started</h2>
          )}
          <StakeButton
            onCheck={(address: string) =>
              blockchainProvider.fetchAccountInfo(address)
            }
            poolId={poolId}
            onDelegated={userHasStaked}
            label={"Stake your ADA"}
          />

          {messageAfterStake && (
            <p className="text-green-600">
              <strong>{messageAfterStake}</strong>
            </p>
          )}
        </div>
        <p>{success && <span>{success}</span>}</p>
        <p>{error && <span className="text-red-500">{error}</span>}</p>

        <div className="flex flex-col gap-2">
          <h2 className="title">Register Reward Address</h2>
          <div className="box">
            <p>
              You can build a transaction with{" "}
              <code>.registerStake(rewardAddress)</code> to deregister a stake
              address
            </p>
            <button className="btn-outline" onClick={registerStake}>
              Register address
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="title">Deregister Reward Address</h2>
          <div className="box">
            <p>
              You can build a transaction with{" "}
              <code>.deregisterStake(rewardAddress)</code> to deregister a stake
              address
            </p>
            <button className="btn-outline" onClick={deregisterStake}>
              Deregister address
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="title">Delegate Stake to Pool</h2>
          <div className="box">
            <p>
              You can build a transaction with{" "}
              <code>.delegateStake(rewardAddress, poolId)</code> to delegate
              stake to a pool
            </p>
            <button className="btn-outline" onClick={stakeToPool}>
              Delegate Stake
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="title">Resources</h2>
          <div className="gap-4 flex">
            <a
              href="https://meshjs.dev/apis"
              target="_blank"
              className="box btn"
            >
              <h2 className="title">Mesh API Documentation</h2>
              <p className="content">
                From wallet integrations to transaction builders, Mesh makes
                Web3 development easy with reliable, scalable, and
                well-engineered APIs & developer tools.
              </p>
            </a>

            <a
              href="https://meshjs.dev/apis/transaction/staking"
              target="_blank"
              className="box btn"
            >
              <h2 className="title">Staking Transactions</h2>
              <p className="content">
                Learn more about the staking transaction that delegates ADA and
                manages stakepools
              </p>
            </a>

            <a
              href="https://meshjs.dev/react"
              target="_blank"
              className="box btn"
            >
              <h2 className="title">React components</h2>
              <p className="content">
                Frontend components for wallet connections and staking, and
                useful React hooks to getting wallet states - Mesh provides
                everything you need to bring your Web3 user interface to life.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
