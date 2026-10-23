"use client";

export type NetworkId = "testnet" | "mainnet";

export interface WalletInfo {
  id: string;
  name: string;
  address: string;
  index?: number;
  isDefault?: boolean;
  balance: number;
  usdValue: number;
  type: "aeko" | "nft";
}

export interface WalletSummary {
  wallets: WalletInfo[];
  currentWalletId?: string;
  stakingInfo: { balance: number; rewards: number; isStaking: boolean };
  network?: NetworkId;
  networkLabel?: string;
}

export interface WalletTransaction {
  id: string;
  type: "received" | "sent";
  title: string;
  subtitle?: string;
  amount: number;
  timestamp: string;
  isPositive: boolean;
  signature?: string;
  success?: boolean;
}

export interface NetworkInfo {
  id: NetworkId;
  label: string;
  available: boolean;
  isDefault: boolean;
  faucet: boolean;
  scanUrl: string | null;
}

export class WalletApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "WalletApiError";
  }
}

const NETWORK_KEY = "aeko-wallet-network";
const WALLET_KEY = "aeko-wallet-address";

/** The network the wallet page is pointed at; remembered per browser. */
export function getStoredNetwork(): NetworkId {
  try {
    return localStorage.getItem(NETWORK_KEY) === "mainnet" ? "mainnet" : "testnet";
  } catch {
    return "testnet";
  }
}
export function storeNetwork(network: NetworkId) {
  try {
    localStorage.setItem(NETWORK_KEY, network);
  } catch {
    // Private mode: the choice just doesn't persist.
  }
}
export function getStoredWallet(): string | null {
  try {
    return localStorage.getItem(WALLET_KEY);
  } catch {
    return null;
  }
}
export function storeWallet(address: string) {
  try {
    localStorage.setItem(WALLET_KEY, address);
  } catch {
    // ignore
  }
}

/**
 * Calls the wallet proxy. Every request carries the selected network; the
 * backend answers 503 NETWORK_UNAVAILABLE for a network that isn't live.
 */
export async function walletApi<T>(
  path: string,
  {
    method = "GET",
    body,
    network,
  }: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; network: NetworkId },
): Promise<T> {
  const res = await fetch(`/api/wallet/${path}`, {
    method,
    headers: {
      "x-aeko-network": network,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new WalletApiError(
      json.message || json.error || `Request failed (${res.status})`,
      res.status,
      json.code,
      typeof json.retryAfterSeconds === "number" ? json.retryAfterSeconds : undefined,
    );
  }
  return json as T;
}

export const formatAeko = (value: number, digits = 4) =>
  `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: digits })} AEKO`;

export const shortAddress = (address: string) =>
  address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;
