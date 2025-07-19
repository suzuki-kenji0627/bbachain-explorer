import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// Components
import { Logo } from "./common/Logo";
import NavElement from "./nav-element";
import NetworkSwitcher from "./NetworkSwitcher";

// Hooks
import useQueryContext from "hooks/useQueryContext";

export function AppBarContainer() {
  const { fmtUrlWithCluster } = useQueryContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [settingsMenuAnchor, setSettingsMenuAnchor] =
    useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#14460f",
        backgroundOpacity: 0.66,
        borderBottom: "1px solid rgb(113 113 122)",
        boxShadow: theme.shadows[4],
        mb: { xs: 1, md: 2 },
      }}
    >
      <Toolbar sx={{ minHeight: 80, px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", mr: "auto" }}>
          <Box sx={{ display: { xs: "none", sm: "block" }, ml: { md: 4 } }}>
            <Link
              href={fmtUrlWithCluster("/")}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Logo width={200} height={100} />
            </Link>
          </Box>
        </Box>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
            mr: 3,
          }}
        >
          <NavElement
            label="Home"
            href={fmtUrlWithCluster("/")}
            navigationStarts={() => {}}
          />
          <NavElement
            label="Blocks"
            href={fmtUrlWithCluster("/blocks")}
            navigationStarts={() => {}}
          />
          <NavElement
            label="Transactions"
            href={fmtUrlWithCluster("/transactions")}
            navigationStarts={() => {}}
          />
          <NavElement
            label="Validators"
            href={fmtUrlWithCluster("/validators")}
            navigationStarts={() => {}}
          />
          <NavElement
            label="Accounts"
            href={fmtUrlWithCluster("/accounts")}
            navigationStarts={() => {}}
          />
        </Box>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open mobile menu"
            edge="end"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            ☰
          </IconButton>
        )}

        {/* Settings Menu */}
        <IconButton
          color="inherit"
          aria-label="settings"
          onClick={handleSettingsMenuOpen}
          sx={{ mr: { xs: 0, md: 2 } }}
        >
          ⚙️
        </IconButton>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={handleMobileMenuClose}>
            <NavElement
              label="Home"
              href={fmtUrlWithCluster("/")}
              navigationStarts={handleMobileMenuClose}
            />
          </MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>
            <NavElement
              label="Blocks"
              href={fmtUrlWithCluster("/blocks")}
              navigationStarts={handleMobileMenuClose}
            />
          </MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>
            <NavElement
              label="Transactions"
              href={fmtUrlWithCluster("/transactions")}
              navigationStarts={handleMobileMenuClose}
            />
          </MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>
            <NavElement
              label="Validators"
              href={fmtUrlWithCluster("/validators")}
              navigationStarts={handleMobileMenuClose}
            />
          </MenuItem>
          <MenuItem onClick={handleMobileMenuClose}>
            <NavElement
              label="Accounts"
              href={fmtUrlWithCluster("/accounts")}
              navigationStarts={handleMobileMenuClose}
            />
          </MenuItem>
        </Menu>

        {/* Settings Menu */}
        <Menu
          anchorEl={settingsMenuAnchor}
          open={Boolean(settingsMenuAnchor)}
          onClose={handleSettingsMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              minWidth: 160,
            },
          }}
        >
          <MenuItem onClick={handleSettingsMenuClose}>
            <Box sx={{ width: "100%" }}>
              <NetworkSwitcher />
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

// Export with alias for backward compatibility
export { AppBarContainer as AppBar };
