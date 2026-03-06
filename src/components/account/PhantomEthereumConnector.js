import { AbstractConnector } from "@web3-react/abstract-connector";
import { UserRejectedRequestError } from "@web3-react/injected-connector";

export function getPhantomEthereumProvider() {
  if (typeof window === "undefined") return undefined;
  return window.phantom?.ethereum ?? undefined;
}

export class NoPhantomProviderError extends Error {
  constructor() {
    super();
    this.name = "NoPhantomProviderError";
    this.message =
      "No Phantom Ethereum provider. Install Phantom from https://phantom.com and enable Ethereum in the app.";
  }
}

export class PhantomEthereumConnector extends AbstractConnector {
  constructor(kwargs) {
    super(kwargs);
    this._provider = null;
    this.handleChainChanged = this.handleChainChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this);
  }

  handleChainChanged(chainId) {
    const p = this._provider || getPhantomEthereumProvider();
    this.emitUpdate({ chainId, provider: p });
  }

  handleAccountsChanged(accounts) {
    if (!accounts || accounts.length === 0) {
      this.emitDeactivate();
    } else {
      this.emitUpdate({ account: accounts[0] });
    }
  }

  handleClose() {
    this.emitDeactivate();
  }

  handleNetworkChanged(networkId) {
    const p = this._provider || getPhantomEthereumProvider();
    this.emitUpdate({ chainId: networkId, provider: p });
  }

  async activate() {
    const ethereum = getPhantomEthereumProvider();
    if (!ethereum) {
      throw new NoPhantomProviderError();
    }
    this._provider = ethereum;

    if (ethereum.on) {
      ethereum.on("chainChanged", this.handleChainChanged);
      ethereum.on("accountsChanged", this.handleAccountsChanged);
      ethereum.on("close", this.handleClose);
      ethereum.on("networkChanged", this.handleNetworkChanged);
    }
    if (ethereum.isMetaMask) {
      ethereum.autoRefreshOnNetworkChange = false;
    }

    let account;
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      account = accounts && accounts[0];
    } catch (error) {
      if (error.code === 4001) {
        throw new UserRejectedRequestError();
      }
      throw error;
    }

    return { provider: ethereum, account };
  }

  getProvider() {
    const p = this._provider || getPhantomEthereumProvider();
    return Promise.resolve(p);
  }

  getChainId() {
    const ethereum = this._provider || getPhantomEthereumProvider();
    if (!ethereum) {
      return Promise.reject(new NoPhantomProviderError());
    }
    return ethereum.request({ method: "eth_chainId" });
  }

  getAccount() {
    const ethereum = this._provider || getPhantomEthereumProvider();
    if (!ethereum) {
      return Promise.reject(new NoPhantomProviderError());
    }
    return ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => (accounts && accounts[0]) || null);
  }

  deactivate() {
    const ethereum = this._provider;
    if (ethereum?.removeListener) {
      ethereum.removeListener("chainChanged", this.handleChainChanged);
      ethereum.removeListener("accountsChanged", this.handleAccountsChanged);
      ethereum.removeListener("close", this.handleClose);
      ethereum.removeListener("networkChanged", this.handleNetworkChanged);
    }
    this._provider = null;
  }

  isAuthorized() {
    const ethereum = getPhantomEthereumProvider();
    if (!ethereum) {
      return Promise.resolve(false);
    }
    return ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => Array.isArray(accounts) && accounts.length > 0);
  }
}
