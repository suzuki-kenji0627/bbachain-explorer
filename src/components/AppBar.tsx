import React, { FC, useState } from "react";
import Link from "next/link";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Components
import { Logo } from "./common/Logo";
import NetworkSwitcher from "./NetworkSwitcher";

// Hooks
import useQueryContext from "hooks/useQueryContext";

// Custom Hamburger Menu Icon
const HamburgerIcon = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
      width: 20,
      height: 16,
    }}
  >
    <Box
      sx={{
        height: 2,
        bgcolor: "currentColor",
        borderRadius: 1,
      }}
    />
    <Box
      sx={{
        height: 2,
        bgcolor: "currentColor",
        borderRadius: 1,
      }}
    />
    <Box
      sx={{
        height: 2,
        bgcolor: "currentColor",
        borderRadius: 1,
      }}
    />
  </Box>
);

export function AppBarContainer() {
  const { fmtUrlWithCluster } = useQueryContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <MuiAppBar
      position="static"
      sx={{
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Logo />
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button
            component={Link}
            href={fmtUrlWithCluster("/blocks")}
            sx={{ color: "white", fontWeight: 500 }}
          >
            Blocks
          </Button>
          <Button
            component={Link}
            href={fmtUrlWithCluster("/transactions")}
            sx={{ color: "white", fontWeight: 500 }}
          >
            Transactions
          </Button>
          <Button
            component={Link}
            href={fmtUrlWithCluster("/tokens")}
            sx={{ color: "white", fontWeight: 500 }}
          >
            Tokens
          </Button>
          {/* <Button
            component={Link}
            href={fmtUrlWithCluster("/validators")}
            sx={{ color: "white", fontWeight: 500 }}
          >
            Validators
          </Button> */}
          <Button
            component={Link}
            href={fmtUrlWithCluster("/accounts")}
            sx={{ color: "white", fontWeight: 500 }}
          >
            Accounts
          </Button>
        </Box>

        {/* Network Switcher */}
        <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
          <NetworkSwitcher />
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: "block", md: "none" }, color: "white" }}
          onClick={handleMobileMenuOpen}
        >
          <HamburgerIcon />
        </IconButton>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(100, 116, 139, 0.2)",
              borderRadius: 2,
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            onClick={handleMobileMenuClose}
            component={Link}
            href={fmtUrlWithCluster("/")}
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(100, 116, 139, 0.1)",
              },
            }}
          >
            🏠 Home
          </MenuItem>
          <MenuItem
            onClick={handleMobileMenuClose}
            component={Link}
            href={fmtUrlWithCluster("/blocks")}
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(100, 116, 139, 0.1)",
              },
            }}
          >
            🧱 Blocks
          </MenuItem>
          <MenuItem
            onClick={handleMobileMenuClose}
            component={Link}
            href={fmtUrlWithCluster("/transactions")}
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(100, 116, 139, 0.1)",
              },
            }}
          >
            🔄 Transactions
          </MenuItem>
          <MenuItem
            onClick={handleMobileMenuClose}
            component={Link}
            href={fmtUrlWithCluster("/tokens")}
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(100, 116, 139, 0.1)",
              },
            }}
          >
            🪙 Tokens
          </MenuItem>
          <MenuItem
            onClick={handleMobileMenuClose}
            component={Link}
            href={fmtUrlWithCluster("/accounts")}
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(100, 116, 139, 0.1)",
              },
            }}
          >
            👥 Accounts
          </MenuItem>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderTop: "1px solid rgba(100, 116, 139, 0.2)",
            }}
          >
            <NetworkSwitcher />
          </Box>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  );
}

// Export with alias for backward compatibility
export { AppBarContainer as AppBar };
