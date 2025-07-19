import { FC, useState } from "react";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// Using Unicode icons instead of icon imports
import Text from "./Text";
import NavElement from "./nav-element";
import useQueryContext from "hooks/useQueryContext";

type Props = {
  children: React.ReactNode;
};

export const ContentContainer: React.FC<Props> = ({ children }) => {
  const { fmtUrlWithCluster } = useQueryContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const navigationItems = [
    { label: "Home", href: fmtUrlWithCluster("/") },
    { label: "Blocks", href: fmtUrlWithCluster("/blocks") },
    { label: "Transactions", href: fmtUrlWithCluster("/transactions") },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
    >
      {/* Main Content */}
      <Box component="main" sx={{ flex: 1, position: "relative" }}>
        {children}
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        variant="temporary"
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 320,
            bgcolor: "#011909",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Box sx={{ p: 3, pb: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.025em",
                textAlign: "center",
                background: "linear-gradient(135deg, #6366f1 0%, #d946ef 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Menu
            </Typography>
            <IconButton onClick={closeDrawer} sx={{ color: "text.primary" }}>
              ✕
            </IconButton>
          </Box>
        </Box>

        <List sx={{ px: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.label} sx={{ mb: 1 }}>
              <Link
                href={item.href}
                passHref
                style={{ textDecoration: "none", width: "100%" }}
              >
                <ListItemText
                  primary={item.label}
                  onClick={closeDrawer}
                  sx={{
                    cursor: "pointer",
                    "& .MuiListItemText-primary": {
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      color: "text.primary",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: "primary.main",
                      },
                    },
                  }}
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
