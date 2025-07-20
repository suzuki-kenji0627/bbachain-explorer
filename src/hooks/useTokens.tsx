import React, { createContext, useContext } from "react";
import { Connection, PublicKey } from "@bbachain/web3.js";
import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@bbachain/spl-token-metadata";

// Common
import * as Cache from "./useCache";
import { Cluster } from "./useCluster";

// Utils
import { reportError } from "utils/sentry";

export type TokenInfo = {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
  logo?: string;
  description?: string;
  website?: string;
  twitter?: string;
  holders?: number;
  marketCap?: number;
};

export type TokensData = {
  tokens: TokenInfo[];
  total: number;
};

export type TokensState = Cache.State<TokensData>;
export type TokensDispatch = Cache.Dispatch<TokensData>;

const TokensStateContext = createContext<TokensState | undefined>(undefined);
const TokensDispatchContext = createContext<TokensDispatch | undefined>(
  undefined
);

export function useTokens(): Cache.CacheEntry<TokensData> | undefined {
  const context = useContext(TokensStateContext);
  if (!context) {
    throw new Error(`useTokens must be used within a TokensProvider`);
  }
  return context.entries["tokens"];
}

export function useTokensDispatch() {
  const dispatch = useContext(TokensDispatchContext);
  if (dispatch === undefined) {
    throw new Error(`useTokensDispatch must be used within a TokensProvider`);
  }
  return dispatch;
}

export async function fetchTokens(
  dispatch: TokensDispatch,
  url: string,
  cluster: Cluster,
  limit: number = 20 // Reduced from 100 to avoid overwhelming RPC
) {
  dispatch({
    type: Cache.ActionType.Update,
    status: Cache.FetchStatus.Fetching,
    key: "tokens",
    url,
  });

  let status: Cache.FetchStatus;
  let data: TokensData | undefined = undefined;

  try {
    const connection = new Connection(url, "confirmed");

    // Define TOKEN_PROGRAM_ID for SPL tokens
    const TOKEN_PROGRAM_ID = new PublicKey(
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    );

    // Get all SPL token mint accounts
    console.log("Fetching SPL token mints...");
    const mintAccounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 82, // Mint account data size
        },
      ],
    });

    console.log(`Found ${mintAccounts.length} token mints`);

    // Process only the first 'limit' tokens to avoid overwhelming the RPC
    const limitedMints = mintAccounts.slice(0, limit);
    const tokens: TokenInfo[] = [];

    // Process tokens in batches to avoid overwhelming the connection
    const batchSize = 5;
    for (let i = 0; i < limitedMints.length; i += batchSize) {
      const batch = limitedMints.slice(i, i + batchSize);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (account) => {
          try {
            const mintPubkey = account.pubkey;
            const mintInfo = await connection.getParsedAccountInfo(mintPubkey);

            if (!mintInfo.value || !("parsed" in mintInfo.value.data)) {
              return null;
            }

            const parsed = mintInfo.value.data.parsed;
            if (parsed.type !== "mint") {
              return null;
            }

            const mintData = parsed.info;

            // Try to fetch metadata using @bbachain/spl-token-metadata
            let metadata = null;
            let jsonMetadata = null;

            try {
              // Derive metadata account PDA
              const [metadataAddress] = PublicKey.findProgramAddressSync(
                [
                  Buffer.from("metadata"),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  mintPubkey.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID
              );

              // Fetch metadata account
              metadata = await Metadata.fromAccountAddress(connection, metadataAddress);

              // If metadata has URI, try to fetch JSON metadata (with timeout)
              if (metadata.data.uri && metadata.data.uri.trim()) {
                try {
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
                  
                  const response = await fetch(metadata.data.uri.trim(), {
                    signal: controller.signal,
                  });
                  clearTimeout(timeoutId);
                  
                  if (response.ok) {
                    jsonMetadata = await response.json();
                  }
                } catch (uriError) {
                  console.warn(`Failed to fetch JSON metadata for ${mintPubkey.toBase58()}:`, uriError.message);
                }
              }
            } catch (err) {
              // Metadata not found, use default values
              console.warn(`No metadata found for ${mintPubkey.toBase58()}`);
            }

            const tokenInfo: TokenInfo = {
              mint: mintPubkey.toBase58(),
              name: metadata?.data?.name?.trim() || `Token ${mintPubkey.toBase58().slice(0, 8)}...`,
              symbol: metadata?.data?.symbol?.trim() || `T${mintPubkey.toBase58().slice(0, 4).toUpperCase()}`,
              decimals: mintData.decimals,
              supply: mintData.supply,
              logo: jsonMetadata?.image,
              description: jsonMetadata?.description || metadata?.data?.uri,
              website: jsonMetadata?.external_url,
            };

            return tokenInfo;
          } catch (err) {
            console.warn(`Failed to process token ${account.pubkey.toBase58()}:`, err);
            return null;
          }
        })
      );

      // Filter out failed results and add successful ones
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          tokens.push(result.value);
        }
      });

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(limitedMints.length / batchSize)}, total tokens: ${tokens.length}`);
    }

    console.log(`Successfully processed ${tokens.length} tokens`);

    data = {
      tokens: tokens.sort((a, b) => {
        // Sort by supply (descending) then by name
        const supplyA = parseInt(a.supply || "0");
        const supplyB = parseInt(b.supply || "0");
        if (supplyA !== supplyB) {
          return supplyB - supplyA;
        }
        return a.name.localeCompare(b.name);
      }),
      total: tokens.length,
    };

    status = Cache.FetchStatus.Fetched;
  } catch (err) {
    console.error("Error fetching tokens:", err);
    status = Cache.FetchStatus.FetchFailed;
    if (cluster !== Cluster.Custom) {
      reportError(err, { url });
    }
  }

  dispatch({
    type: Cache.ActionType.Update,
    url,
    key: "tokens",
    status,
    data,
  });
}

export { TokensStateContext, TokensDispatchContext };
