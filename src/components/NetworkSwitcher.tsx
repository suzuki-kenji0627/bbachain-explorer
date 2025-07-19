import { FC } from "react";
import dynamic from "next/dynamic";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useNetworkConfiguration } from "../contexts/NetworkConfigurationProvider";
import useQueryContext from "hooks/useQueryContext";
import { EndpointTypes } from "models/types";

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } =
    useNetworkConfiguration();
  const { router, changedClusterUrl } = useQueryContext();

  const changeCluster = (value: string) => {
    setNetworkConfiguration(value);
    changedClusterUrl(value as EndpointTypes);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200 }}>
      <Typography
        variant="body2"
        sx={{ color: "text.primary", fontWeight: 500 }}
      >
        Network
      </Typography>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={networkConfiguration}
          onChange={(e) => changeCluster(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            "& .MuiSelect-select": {
              color: "text.primary",
            },
            "& .MuiSvgIcon-root": {
              color: "text.primary",
            },
          }}
        >
          <MenuItem value="mainnet">Mainnet</MenuItem>
          <MenuItem value="testnet">Testnet</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false,
});
