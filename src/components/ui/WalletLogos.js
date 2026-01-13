import Metamask from "../../assets/images/wallet-logos/metamask.svg";
import Phantom from "../../assets/images/wallet-logos/phantom.svg";

export const MetamaskLogo = ({ width = 25 }) => (
  <img src={Metamask} alt="MetaMask Logo" width={width} />
);

export const PhantomLogo = ({ width = 25 }) => (
  <img src={Phantom} alt="Phantom Logo" width={width} />
);
