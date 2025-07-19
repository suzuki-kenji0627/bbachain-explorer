import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";

export function ErrorCard({
  retry,
  retryText,
  text,
  subtext,
}: {
  retry?: () => void;
  retryText?: string;
  text: string;
  subtext?: string;
}) {
  const buttonText = retryText || "Try Again";

  return (
    <Card sx={{ width: "100%", mb: 2 }}>
      <CardContent sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" gutterBottom>
          {text}
        </Typography>

        {retry && (
          <Box sx={{ mt: 3 }}>
            {/* Desktop button */}
            <Button
              variant="contained"
              color="primary"
              onClick={retry}
              sx={{
                mr: 1,
                display: { xs: "none", md: "inline-flex" },
              }}
            >
              {buttonText}
            </Button>

            {/* Mobile button */}
            <Button
              variant="contained"
              color="primary"
              onClick={retry}
              fullWidth
              sx={{
                mt: 2,
                display: { xs: "flex", md: "none" },
              }}
            >
              {buttonText}
            </Button>

            {subtext && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {subtext}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
