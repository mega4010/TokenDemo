import { useEffect } from "react";
import { keyframes } from "@emotion/react";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useWeb3React } from "@web3-react/core";
import WalletConnectButton from "../../components/account/WalletConnectButton";
import logo from "../../assets/images/logo-elo.png";

const drift = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
  33% { transform: translate(3%, -2%) scale(1.03); opacity: 0.7; }
  66% { transform: translate(-2%, 3%) scale(0.98); opacity: 0.5; }
`;

const driftSlow = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
  50% { transform: translate(-4%, 2%) scale(1.05); opacity: 0.65; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseSoft = keyframes`
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
`;

const shellSx = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 2,
  py: { xs: 4, sm: 6 },
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#f4fbf5",
  backgroundImage: `
    radial-gradient(ellipse 80% 60% at 50% -30%, rgba(28, 172, 29, 0.16), transparent 55%),
    radial-gradient(ellipse 70% 50% at 100% 50%, rgba(28, 172, 29, 0.08), transparent 50%),
    radial-gradient(ellipse 60% 45% at 0% 80%, rgba(28, 172, 29, 0.1), transparent 45%),
    linear-gradient(180deg, #f8fdf9 0%, #eef8f0 45%, #e8f4ea 100%)
  `,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(28, 172, 29, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(28, 172, 29, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    maskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, black 20%, transparent 75%)",
    WebkitMaskImage:
      "radial-gradient(ellipse 85% 75% at 50% 40%, black 20%, transparent 75%)",
    pointerEvents: "none",
  },
};

function BackgroundOrbs() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-15%", md: "-20%" },
          right: { xs: "-25%", md: "-12%" },
          width: { xs: "90%", md: "55%" },
          height: { xs: "50%", md: "55%" },
          borderRadius: "50%",
          background: (theme) =>
            `radial-gradient(circle, ${theme.palette.primary.main}22 0%, ${theme.palette.primary.main}08 45%, transparent 70%)`,
          filter: "blur(2px)",
          animation: `${drift} 18s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "-20%", md: "-15%" },
          left: { xs: "-30%", md: "-10%" },
          width: { xs: "85%", md: "48%" },
          height: { xs: "45%", md: "48%" },
          borderRadius: "50%",
          background: (theme) =>
            `radial-gradient(circle, ${theme.palette.primary.main}18 0%, ${theme.palette.primary.main}06 50%, transparent 72%)`,
          filter: "blur(3px)",
          animation: `${driftSlow} 22s ease-in-out infinite`,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

export default function Dashboard() {
  const history = useHistory();
  const { library, account } = useWeb3React();

  useEffect(() => {
    if (library && account) {
      history.replace("/home");
    }
  }, [library, account, history]);

  if (library && account) {
    return (
      <Box sx={{ ...shellSx }}>
        <BackgroundOrbs />
        <Stack
          alignItems="center"
          spacing={2}
          sx={{
            position: "relative",
            zIndex: 1,
            animation: `${fadeUp} 0.5s ease-out`,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt=""
            sx={{
              width: 44,
              height: 44,
              objectFit: "contain",
              opacity: 0.9,
              animation: `${pulseSoft} 1.4s ease-in-out infinite`,
            }}
          />
          <CircularProgress
            size={40}
            thickness={4}
            sx={{ color: "primary.main" }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Opening your space…
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ ...shellSx }}>
      <BackgroundOrbs />
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          p: { xs: 3.5, sm: 5 },
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.85)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.88) 50%, rgba(248,252,249,0.95) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: `
            0 0 0 1px rgba(28, 172, 29, 0.06),
            0 32px 64px -24px rgba(28, 172, 29, 0.18),
            0 16px 40px -20px rgba(15, 23, 42, 0.12)
          `,
          animation: `${fadeUp} 0.65s ease-out`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "12%",
            right: "12%",
            height: 3,
            borderRadius: "0 0 12px 12px",
            background: (theme) =>
              `linear-gradient(90deg, transparent, ${theme.palette.primary.main}55, transparent)`,
            opacity: 0.9,
          },
        }}
      >
        <Stack spacing={3.5} alignItems="center" textAlign="center">
          <Box
            sx={{
              p: 2,
              borderRadius: "50%",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}18, ${theme.palette.primary.main}06)`,
              boxShadow:
                "0 12px 32px -8px rgba(28, 172, 29, 0.35), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.85)",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt=""
              sx={{
                width: { xs: 52, sm: 56 },
                height: { xs: 52, sm: 56 },
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: "0.2em",
                fontWeight: 700,
                color: "primary.main",
                fontSize: "0.7rem",
              }}
            >
              ELO · Wallet gateway
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
                display: "inline-block",
                background: (theme) =>
                  `linear-gradient(120deg, ${theme.palette.grey[900]} 0%, ${theme.palette.primary.main} 95%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Connect your wallet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.65, px: { xs: 0, sm: 1 } }}
            >
              Secure access to the app. After you approve in your wallet, you will continue to the
              home page.
            </Typography>
          </Stack>

          <Box sx={{ width: "100%", pt: 0.5 }}>
            <WalletConnectButton fullWidth size="large" variant="contained" />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
