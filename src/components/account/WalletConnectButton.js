import { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import WalletProviders from "./NetworkWalletProviders";
import WalletIcon from "../ui/icons/Wallet";

function WalletConnectButton({
  fullWidth = false,
  variant = "contained",
  size = "medium",
  sx = {},
}) {
  const [walletProvidersDialogOpen, setWalletProvidersDialogOpen] =
    useState(false);

  const handleWalletProvidersDialogToggle = () => {
    setWalletProvidersDialogOpen(!walletProvidersDialogOpen);
  };

  return (
    <Fragment>
      <Button
        type="button"
        variant={variant}
        size={size}
        disableElevation
        fullWidth={fullWidth}
        onClick={handleWalletProvidersDialogToggle}
        startIcon={<WalletIcon />}
        sx={{
          ...(variant === "contained" && {
            boxShadow: "rgb(0 0 0 / 8%) 0px 8px 28px",
          }),
          ...sx,
        }}
      >
        Wallet Connect
      </Button>
      <WalletProviders
        walletProvidersDialogOpen={walletProvidersDialogOpen}
        handleWalletProvidersDialogToggle={handleWalletProvidersDialogToggle}
      />
    </Fragment>
  );
}

export default WalletConnectButton;
