import { useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  PhantomEthereumConnector,
  NoPhantomProviderError,
} from "./PhantomEthereumConnector.js";
import { ethers } from "ethers";
import Web3 from "web3";
//0 ropsten, 1 bsc
let netid = 0;
let provider = null;
let injected, phantomInjected, bsc;

//mainnet
// const netlist = [
//   {
//     chaind : 1,
//     rpcurl : "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
//     blockurl : "https://etherscan.io",
//     chainname : "Ethereum Mainnet",
//     chainnetname : "Ethereum Mainnet",
//     chainsymbol : "ETH",
//     chaindecimals : 18
//   },
//   {
//     chaind : 56,
//     rpcurl : "https://bsc-dataseed1.ninicoin.io",
//     blockurl : "https://bscscan.com/",
//     chainname : "Binance Smart Chain Mainnet",
//     chainnetname : "Binance Smart Chain Mainnet",
//     chainsymbol : "BNB",
//     chaindecimals : 18
//   },
// ]

// Chain params for wallet_addEthereumChain (when chain not in wallet)
const CHAIN_PARAMS = {
  1: {
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
  56: {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  97: {
    chainId: "0x61",
    chainName: "BSC Testnet",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
};

//testnet (index 0 = Ethereum mainnet, 1 = BSC testnet)
const netlist = [
  {
    chaind: 1,
    rpcurl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    blockurl: "https://etherscan.io",
    chainname: "Ethereum Mainnet",
    chainnetname: "Ethereum Mainnet",
    chainsymbol: "ETH",
    chaindecimals: 18,
  },
  {
    chaind: 97,
    rpcurl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockurl: "https://testnet.bscscan.com/",
    chainname: "BSC Testnet",
    chainnetname: "BSC Testnet",
    chainsymbol: "BNB",
    chaindecimals: 18,
  },
];

const defaultethereumconflag = {
  testing: false,
  autoGasMultiplier: 1.5,
  defaultConfirmations: 1,
  defaultGas: "6000000",
  defaultGasPrice: "1000000000000",
  nodetimeout: 10000,
};

function web3ProviderFrom(endpoint, config) {
  const ethConfig = Object.assign(defaultethereumconflag, config || {});

  const providerClass = endpoint.includes("wss")
    ? Web3.providers.WebsocketProvider
    : Web3.providers.HttpProvider;

  return new providerClass(endpoint, {
    timeout: ethConfig.nodetimeout,
  });
}

export function getDefaultProvider() {
  if (!provider) {
    provider = new ethers.providers.Web3Provider(
      web3ProviderFrom(netlist[netid].rpcurl),
      netlist[netid].chaind,
    );
  }

  return provider;
}

export function setNet(id) {
  netid = id;
  const chainId = netlist[netid].chaind;
  injected = new InjectedConnector({
    supportedChainIds: [chainId],
  });
  phantomInjected = new PhantomEthereumConnector({
    supportedChainIds: [chainId],
  });
}

export function useWalletConnector() {
  const { activate, deactivate } = useWeb3React();
  const [, setProvider] = useState({});

  const setupNetwork = async (connector) => {
    let ethereum;
    try {
      ethereum = connector && typeof connector.getProvider === "function"
        ? await connector.getProvider()
        : typeof window !== "undefined" ? window.ethereum : null;
    } catch (_) {
      ethereum = typeof window !== "undefined" ? window.ethereum : null;
    }
    if (!ethereum) {
      console.error(
        "Cannot switch network: no Ethereum provider. Install MetaMask.",
      );
      return false;
    }
    const chainId = netlist[netid].chaind;
    const chainIdHex = `0x${chainId.toString(16)}`;
    const request = (opts) => {
      if (typeof ethereum.request === "function") {
        return ethereum.request(opts);
      }
      if (typeof ethereum.send === "function") {
        return ethereum.send(opts.method, opts.params || []);
      }
      return Promise.reject(new Error("No request method"));
    };
    try {
      await request({ method: "wallet_switchEthereumChain", params: [{ chainId: chainIdHex }] });
      return true;
    } catch (switchError) {
      if (switchError?.code === 4902 && CHAIN_PARAMS[chainId]) {
        try {
          await request({ method: "wallet_addEthereumChain", params: [CHAIN_PARAMS[chainId]] });
          return true;
        } catch (addError) {
          console.error("User rejected or failed to add chain:", addError);
          return false;
        }
      }
      console.error("Failed to switch network:", switchError);
      return false;
    }
  };

  const loginMetamask = async () => {
    loginWallet(injected);
  };

  const loginPhantom = async () => {
    loginWallet(phantomInjected);
  };

  const loginBSC = async () => {
    loginWallet(bsc);
  };

  const loginWallet = async (connector) => {
    if (!connector) {
      console.warn("Unable to connect: connector not initialized. Try choosing network and wallet again.");
      return;
    }
    setProvider(connector);
    try {
      await activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork(connector);
          if (hasSetup) {
            try {
              await activate(connector);
            } catch (retryError) {
              console.error("Failed to connect after switching network:", retryError);
            }
          }
        } else {
          if (error instanceof NoEthereumProviderError) {
            console.error("No wallet found. Install MetaMask or another Web3 wallet.");
          } else if (error instanceof NoPhantomProviderError) {
            console.error(
              "Phantom Ethereum not found. Install Phantom and enable Ethereum in the extension.",
            );
          } else if (error instanceof UserRejectedRequestErrorInjected) {
            console.log("Connection rejected by user.");
          } else {
            console.error("Connection error:", error?.message || error);
          }
        }
      });
    } catch (err) {
      console.error("Activate error:", err);
    }
  };

  const logoutWalletConnector = () => {
    deactivate();
    setProvider({});
    return true;
  };

  return {
    loginMetamask,
    loginInjected: loginMetamask,
    loginPhantom,
    loginBSC,
    logoutWalletConnector,
  };
}

