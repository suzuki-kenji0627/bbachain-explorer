import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

export function LoadingCard({ message }: { message?: string }) {
  return (
    <Card sx={{ width: "100%", mb: 2 }}>
      <CardContent sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {message || "Loading"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress
            size={32}
            thickness={4}
            sx={{
              color: "primary.contrastText",
              animationDuration: "1.5s",
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          {message || "Loading..."}
        </Typography>
      </CardContent>
    </Card>
  );
}
