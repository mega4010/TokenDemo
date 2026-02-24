import { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import ERC20Balance from "components/ERC20Balance";
import Dashboard from "containers/dashboard";
import Home from "containers/home";
import About from "containers/about";
import Gallery from "containers/gallery";
import Transactions from "containers/transactions";
import NFTs from "containers/nfts";
import "antd/dist/antd.css";
import Ramper from "./components/Ramper";
import Footer from "./components/layout/Footer";
import MainNavigation from "components/layout/Header/MainNavigation";
import Swap from "containers/swap";
import Presale from "containers/pre-sale";
import Mint from "containers/mint";
import Stake from "containers/stake";

const App = () => {
  const { library, account, deactivate } = useWeb3React();

  // Sync localStorage with connection state
  useEffect(() => {
    if (library && account) {
      localStorage.setItem("connected", "true");
    } else {
      localStorage.removeItem("connected");
      localStorage.removeItem("wallet");
    }
  }, [library, account]);

  // Disconnect app when user locks MetaMask or revokes site access
  useEffect(() => {
    // Use the same provider that web3-react uses when connected, else window.ethereum
    const provider = library?.provider || window.ethereum;
    if (!provider || !account) return;

    const disconnectApp = () => {
      deactivate();
      localStorage.removeItem("connected");
      localStorage.removeItem("wallet");
    };

    const handleAccountsChanged = (accounts) => {
      const hasAccount =
        accounts &&
        accounts.length > 0 &&
        accounts.some((a) => a.toLowerCase() === account.toLowerCase());
      if (!hasAccount) {
        disconnectApp();
      }
    };

    const handleDisconnect = () => {
      disconnectApp();
    };

    // Support both .on (EIP-1193) and addEventListener (some wallets)
    if (typeof provider.on === "function") {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("disconnect", handleDisconnect);
    }
    if (typeof provider.addEventListener === "function") {
      provider.addEventListener("accountsChanged", handleAccountsChanged);
      provider.addEventListener("disconnect", handleDisconnect);
    }

    // Polling fallback: when MetaMask is locked it may not emit events
    const pollInterval = setInterval(async () => {
      try {
        const accounts =
          typeof provider.request === "function"
            ? await provider.request({ method: "eth_accounts" })
            : [];
        const hasAccount =
          accounts &&
          accounts.length > 0 &&
          accounts.some((a) => a.toLowerCase() === account.toLowerCase());
        if (!hasAccount) {
          disconnectApp();
        }
      } catch {
        disconnectApp();
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
      if (typeof provider.removeListener === "function") {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("disconnect", handleDisconnect);
      }
      if (typeof provider.removeEventListener === "function") {
        provider.removeEventListener("accountsChanged", handleAccountsChanged);
        provider.removeEventListener("disconnect", handleDisconnect);
      }
    };
  }, [library, account, deactivate]);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route>
          <>
            <MainNavigation />
            <main style={{ marginTop: 90, marginBottom: 90 }}>
              <Switch>
                <Route exact path="/home" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/swap" component={Swap} />
                <Route exact path="/gallery" component={Gallery} />
                <Route exact path="/erc20balance" component={ERC20Balance} />
                <Route exact path="/onramp" component={Ramper} />
                <Route exact path="/transactions" component={Transactions} />
                <Route exact path="/nfts" component={NFTs} />
                <Route exact path="/pre-sale" component={Presale} />
                <Route exact path="/mint" component={Mint} />
                <Route exact path="/stake" component={Stake} />
                <Route exact path="/nonauthenticated">
                  <>Please login using the "Authenticate" button</>
                </Route>
              </Switch>
            </main>
            <Footer />
          </>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
