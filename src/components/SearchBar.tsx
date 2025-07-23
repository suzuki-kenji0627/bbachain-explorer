import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import bs58 from "bs58";
import Select, {
  InputActionMeta,
  ActionMeta,
  OnChangeValue,
} from "react-select";
import { useTheme, useMediaQuery } from "@mui/material";

// Hooks
import useQueryContext from "hooks/useQueryContext";
import { Cluster, useCluster } from "hooks/useCluster";

// Utils
import {
  LOADER_IDS,
  LoaderName,
  PROGRAM_INFO_BY_ID,
  SPECIAL_IDS,
  SYSVAR_IDS,
} from "utils/tx";

interface SearchOptions {
  label: string;
  options: {
    label: string;
    value: string[];
    pathname: string;
  }[];
}

function DropdownIndicator() {
  return (
    <button className="p-2 text-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 md:h-6 md:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}

const CustomOption = ({ innerProps, isDisabled, label, data }) =>
  !isDisabled ? (
    <li
      {...innerProps}
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        color: "#f9fafb",
        fontSize: "14px",
        fontFamily: "monospace",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Link
        href={data?.pathname || "/"}
        style={{
          color: "inherit",
          textDecoration: "none",
          display: "block",
          width: "100%",
        }}
      >
        {label}
      </Link>
    </li>
  ) : null;

const CustomMenuList = ({ children, maxHeight }) => {
  return (
    <ul
      className="w-full overflow-scroll"
      style={{
        maxHeight,
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        padding: "8px 0",
        margin: 0,
        listStyle: "none",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {children}
    </ul>
  );
};

export const SearchBar: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { fmtUrlWithCluster } = useQueryContext();
  const router = useRouter();
  const searchRef = React.useRef("");
  const [search, setSearch] = React.useState("");
  const [loadingSearch, setLoadingSearch] = React.useState<boolean>(false);
  const [searchOptions, setSearchOptions] = React.useState<SearchOptions[]>([]);
  const [loadingSearchMessage, setLoadingSearchMessage] =
    React.useState<string>("loading...");
  const { cluster, clusterInfo } = useCluster();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    searchRef.current = search;
    setLoadingSearchMessage("Loading...");
    setLoadingSearch(true);

    // builds and sets local search output
    const options = buildOptions(search, cluster, clusterInfo?.epochInfo.epoch);

    setSearchOptions(options);

    setLoadingSearch(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative w-full">
        <input
          type="text"
          placeholder={
            isMobile
              ? "Search..."
              : "Search by Address / Txn Hash / Block / Token..."
          }
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled
        />
      </div>
    );
  }

  const onInputChange = (value: string, { action }: InputActionMeta) => {
    if (action === "input-change") {
      setSearch(value);
    }
  };

  const onChange = (
    { pathname }: OnChangeValue<any, false>,
    meta: ActionMeta<any>
  ) => {
    if (meta.action === "select-option") {
      const url = fmtUrlWithCluster(pathname);
      router.push(url);
      setSearch("");
    }
  };

  const resetValue = "" as any;

  return (
    <div className="w-full">
      <Select
        blurInputOnSelect
        noOptionsMessage={() => "No Results"}
        placeholder={
          isMobile
            ? "Search..."
            : "Search by Address / Txn Hash / Block / Token / Domain Name"
        }
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            padding: isMobile ? "2px 4px" : "4px 8px",
            fontSize: isMobile ? "14px" : "16px",
            minHeight: isMobile ? "44px" : "52px",
            boxShadow: state.isFocused
              ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
              : "none",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
          }),
          input: (provided) => ({
            ...provided,
            color: "white",
            fontSize: isMobile ? "14px" : "16px",
            width: "100%",
            gridTemplateColumns: "0 minmax(min-content, 1fr)",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: isMobile ? "14px" : "16px",
            pointerEvents: "none",
            userSelect: "none",
            MozUserSelect: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "white",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#1a1a1a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            zIndex: 9999,
          }),
          menuList: (provided) => ({
            ...provided,
            padding: 0,
            maxHeight: isMobile ? "200px" : "300px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? "rgba(255, 255, 255, 0.1)"
              : "transparent",
            color: "#f9fafb",
            fontSize: isMobile ? "13px" : "14px",
            padding: isMobile ? "8px 12px" : "12px 16px",
            cursor: "pointer",
          }),
          noOptionsMessage: (provided) => ({
            ...provided,
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: isMobile ? "13px" : "14px",
          }),
          loadingMessage: (provided) => ({
            ...provided,
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: isMobile ? "13px" : "14px",
          }),
        }}
        loadingMessage={() => loadingSearchMessage}
        components={{
          DropdownIndicator,
          Option: CustomOption,
          MenuList: CustomMenuList,
        }}
        onInputChange={onInputChange}
        onChange={onChange}
        // Value and Options
        inputValue={search}
        options={searchOptions}
        value={resetValue}
        menuPosition="absolute"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
      />
    </div>
  );
};

function buildProgramOptions(search: string, cluster: Cluster) {
  const matchedPrograms = Object.entries(PROGRAM_INFO_BY_ID).filter(
    ([address, { name, deployments }]) => {
      if (!deployments.includes(cluster)) return false;
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        address.includes(search)
      );
    }
  );

  if (matchedPrograms.length > 0) {
    return {
      label: "Programs",
      options: matchedPrograms.map(([address, { name }]) => ({
        label: name,
        value: [name, address],
        pathname: "/address/" + address,
      })),
    };
  }
}

const SEARCHABLE_LOADERS: LoaderName[] = [
  "BPF Loader",
  "BPF Loader 2",
  "BPF Upgradeable Loader",
];

function buildLoaderOptions(search: string) {
  const matchedLoaders = Object.entries(LOADER_IDS).filter(
    ([address, name]) => {
      return (
        SEARCHABLE_LOADERS.includes(name) &&
        (name.toLowerCase().includes(search.toLowerCase()) ||
          address.includes(search))
      );
    }
  );

  if (matchedLoaders.length > 0) {
    return {
      label: "Program Loaders",
      options: matchedLoaders.map(([id, name]) => ({
        label: name,
        value: [name, id],
        pathname: "/address/" + id,
      })),
    };
  }
}

function buildSysvarOptions(search: string) {
  const matchedSysvars = Object.entries(SYSVAR_IDS).filter(
    ([address, name]) => {
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        address.includes(search)
      );
    }
  );

  if (matchedSysvars.length > 0) {
    return {
      label: "Sysvars",
      options: matchedSysvars.map(([id, name]) => ({
        label: name,
        value: [name, id],
        pathname: "/address/" + id,
      })),
    };
  }
}

function buildSpecialOptions(search: string) {
  const matchedSpecialIds = Object.entries(SPECIAL_IDS).filter(
    ([address, name]) => {
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        address.includes(search)
      );
    }
  );

  if (matchedSpecialIds.length > 0) {
    return {
      label: "Addresses",
      options: matchedSpecialIds.map(([id, name]) => ({
        label: name,
        value: [name, id],
        pathname: "/address/" + id,
      })),
    };
  }
}

// builds local search options
function buildOptions(
  rawSearch: string,
  cluster: Cluster,
  currentEpoch?: number
) {
  const search = rawSearch.trim();
  if (search.length === 0) return [];

  const options = [];

  const programOptions = buildProgramOptions(search, cluster);
  if (programOptions) {
    options.push(programOptions);
  }

  const loaderOptions = buildLoaderOptions(search);
  if (loaderOptions) {
    options.push(loaderOptions);
  }

  const sysvarOptions = buildSysvarOptions(search);
  if (sysvarOptions) {
    options.push(sysvarOptions);
  }

  const specialOptions = buildSpecialOptions(search);
  if (specialOptions) {
    options.push(specialOptions);
  }

  if (!isNaN(Number(search))) {
    options.push({
      label: "Block",
      options: [
        {
          label: `Slot #${search}`,
          value: [search],
          pathname: `/block/${search}`,
        },
      ],
    });

    if (currentEpoch !== undefined && Number(search) <= currentEpoch + 1) {
      options.push({
        label: "Epoch",
        options: [
          {
            label: `Epoch #${search}`,
            value: [search],
            pathname: `/epoch/${search}`,
          },
        ],
      });
    }
  }

  // Prefer nice suggestions over raw suggestions
  if (options.length > 0) return options;

  try {
    const decoded = bs58.decode(search);
    if (decoded.length === 32) {
      options.push({
        label: "Address",
        options: [
          {
            label: search,
            value: [search],
            pathname: "/address/" + search,
          },
        ],
      });
    } else if (decoded.length === 64) {
      options.push({
        label: "Transaction",
        options: [
          {
            label: search,
            value: [search],
            pathname: "/tx/" + search,
          },
        ],
      });
    }
  } catch (err) {}

  return options;
}
