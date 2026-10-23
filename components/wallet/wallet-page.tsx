"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Copy,
  Droplets,
  ExternalLink,
  Loader2,
  Plus,
  QrCode,
  RefreshCw,
  Send,
  Star,
  Wallet as WalletIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  formatAeko,
  getStoredNetwork,
  getStoredWallet,
  type NetworkId,
  type NetworkInfo,
  shortAddress,
  storeNetwork,
  storeWallet,
  type WalletInfo,
  type WalletSummary,
  type WalletTransaction,
  walletApi,
  WalletApiError,
} from "@/lib/wallet-api";

const WITHDRAWAL_FEE_AEKO = 0.8;
const PAGE_SIZE = 15;
const ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

type DialogKind = "send" | "withdraw" | "receive" | "create" | null;

/**
 * The web wallet. Same backend as the app: custodial wallets (several per
 * account), testnet/mainnet switch, send/withdraw, testnet faucet, activity
 * read from the chain.
 */
export function WalletPage() {
  const [network, setNetwork] = useState<NetworkId>("testnet");
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNetwork(getStoredNetwork());
    setSelected(getStoredWallet());
  }, []);

  const current = useMemo<WalletInfo | null>(() => {
    if (!summary) return null;
    return (
      summary.wallets.find((w) => w.address === selected) ??
      summary.wallets.find((w) => w.id === summary.currentWalletId) ??
      summary.wallets[0] ??
      null
    );
  }, [summary, selected]);

  const networkInfo = networks.find((n) => n.id === network);
  const scanUrl = networkInfo?.scanUrl ?? "https://scan.aeko.online";

  const loadTransactions = useCallback(
    async (address: string, nextPage: number, net: NetworkId) => {
      setLoadingTx(true);
      try {
        const res = await walletApi<{ transactions: WalletTransaction[]; page: number; hasMore: boolean }>(
          `transactions?page=${nextPage}&limit=${PAGE_SIZE}&wallet=${encodeURIComponent(address)}`,
          { network: net },
        );
        setTransactions((cur) => (nextPage === 1 ? res.transactions : [...cur, ...res.transactions]));
        setPage(res.page);
        setHasMore(res.hasMore);
      } catch (err) {
        if (nextPage === 1) setTransactions([]);
        toast.error(err instanceof Error ? err.message : "Couldn't load activity");
      } finally {
        setLoadingTx(false);
      }
    },
    [],
  );

  const load = useCallback(
    async (net: NetworkId, preferred: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const [nets, sum] = await Promise.all([
          walletApi<{ networks: NetworkInfo[] }>("networks", { network: net }).then((r) => r.networks).catch(() => []),
          walletApi<WalletSummary>("summary", { network: net }),
        ]);
        if (nets.length) setNetworks(nets);
        setSummary(sum);
        const wallet =
          sum.wallets.find((w) => w.address === preferred) ??
          sum.wallets.find((w) => w.id === sum.currentWalletId) ??
          sum.wallets[0];
        if (wallet) await loadTransactions(wallet.address, 1, net);
      } catch (err) {
        setSummary(null);
        setTransactions([]);
        setError(err instanceof Error ? err.message : "Your wallet could not be loaded.");
      } finally {
        setLoading(false);
      }
    },
    [loadTransactions],
  );

  useEffect(() => {
    void load(network, selected);
    // `selected` changes are handled by switchWallet; this effect is for the initial load and network changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, load]);

  const switchNetwork = (next: NetworkId) => {
    const info = networks.find((n) => n.id === next);
    if (info && !info.available) {
      toast.info(`${info.label} isn't live yet.`);
      return;
    }
    storeNetwork(next);
    setNetwork(next);
  };

  const switchWallet = (wallet: WalletInfo) => {
    storeWallet(wallet.address);
    setSelected(wallet.address);
    setTransactions([]);
    void loadTransactions(wallet.address, 1, network);
  };

  const refresh = () => void load(network, current?.address ?? selected);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Address copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const faucet = async () => {
    if (!current) return;
    setBusy("faucet");
    try {
      const res = await walletApi<{ amount: number; confirmed: boolean }>("airdrop", {
        method: "POST",
        body: { wallet: current.address },
        network,
      });
      toast.success(res.confirmed ? `${res.amount} AEKO added to your wallet` : `${res.amount} AEKO is on its way`);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't reach the faucet");
    } finally {
      setBusy(null);
    }
  };

  const makeDefault = async () => {
    if (!current) return;
    try {
      await walletApi(`${encodeURIComponent(current.address)}`, { method: "PATCH", body: { isDefault: true }, network });
      toast.success(`${current.name} is now your default wallet`);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the wallet");
    }
  };

  const isTestnet = network === "testnet";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground">Your AEKO on the {networkInfo?.label ?? (isTestnet ? "Testnet" : "Mainnet")}.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-border p-1" role="radiogroup" aria-label="Network">
            {(["testnet", "mainnet"] as NetworkId[]).map((id) => {
              const info = networks.find((n) => n.id === id);
              const active = network === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => switchNetwork(id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    info && !info.available && "opacity-60",
                  )}
                >
                  {info?.label ?? (id === "testnet" ? "Testnet" : "Mainnet")}
                  {info && !info.available ? " · soon" : ""}
                </button>
              );
            })}
          </div>
          <Button variant="outline" size="icon" className="rounded-full" onClick={refresh} aria-label="Refresh" disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
          {error}
          <Button variant="link" className="ml-2 h-auto p-0" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : null}

      {/* Wallet chips */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {loading && !summary ? (
          <>
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </>
        ) : (
          <>
            {summary?.wallets.map((w) => {
              const active = w.address === current?.address;
              return (
                <button
                  key={w.address}
                  type="button"
                  onClick={() => switchWallet(w)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={active}
                >
                  <WalletIcon className="h-4 w-4" />
                  <span className="font-medium">{w.name}</span>
                  {w.isDefault ? <Star className="h-3 w-3 fill-current" aria-label="Default" /> : null}
                  <span className="text-xs opacity-70">{formatAeko(w.balance, 2)}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setDialog("create")}
              className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" /> New wallet
            </button>
          </>
        )}
      </div>

      {/* Balance */}
      <section className="mt-4 rounded-3xl bg-gradient-to-br from-primary to-emerald-700 p-6 text-primary-foreground shadow-lg">
        {loading && !summary ? (
          <Skeleton className="h-24 w-full bg-white/20" />
        ) : current ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm opacity-80">{current.name}{isTestnet ? " · Testnet" : ""}</div>
                <div className="mt-1 text-3xl font-bold sm:text-4xl">{formatAeko(current.balance)}</div>
              </div>
              {!current.isDefault ? (
                <Button variant="secondary" size="sm" className="shrink-0 rounded-full" onClick={makeDefault}>
                  <Star className="mr-1 h-3.5 w-3.5" /> Make default
                </Button>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <code className="rounded-full bg-black/20 px-3 py-1 font-mono text-xs">{shortAddress(current.address)}</code>
              <button type="button" onClick={() => copy(current.address)} className="rounded-full bg-black/20 p-1.5 hover:bg-black/30" aria-label="Copy address">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <a
                href={`${scanUrl}/explorer/account/${current.address}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-black/20 p-1.5 hover:bg-black/30"
                aria-label="View on AekoScan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </>
        ) : (
          <div className="text-sm opacity-90">No wallet yet.</div>
        )}
      </section>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button className="h-12 rounded-2xl" onClick={() => setDialog("send")} disabled={!current}>
          <Send className="mr-2 h-4 w-4" /> Send
        </Button>
        <Button variant="outline" className="h-12 rounded-2xl" onClick={() => setDialog("receive")} disabled={!current}>
          <QrCode className="mr-2 h-4 w-4" /> Receive
        </Button>
        <Button variant="outline" className="h-12 rounded-2xl" onClick={() => setDialog("withdraw")} disabled={!current}>
          <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
        </Button>
        {isTestnet ? (
          <Button variant="outline" className="h-12 rounded-2xl" onClick={faucet} disabled={!current || busy === "faucet"}>
            {busy === "faucet" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Droplets className="mr-2 h-4 w-4" />}
            Get test AEKO
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Activity */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</h2>
          <div className="mt-3 divide-y divide-border/60 rounded-2xl border border-border/60">
            {loadingTx && transactions.length === 0 ? (
              <div className="space-y-3 p-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No activity yet.{isTestnet ? " Tap “Get test AEKO” to fund this wallet." : ""}
              </p>
            ) : (
              transactions.map((tx) => (
                <a
                  key={tx.id}
                  href={tx.signature ? `${scanUrl}/explorer/tx/${tx.signature}` : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", tx.isPositive ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-foreground")}>
                    {tx.isPositive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{tx.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {tx.subtitle} · {new Date(tx.timestamp).toLocaleString()}
                    </span>
                  </span>
                  <span className={cn("shrink-0 text-sm font-semibold", tx.isPositive ? "text-emerald-600" : "")}>
                    {tx.isPositive ? "+" : "−"}
                    {formatAeko(tx.amount)}
                  </span>
                </a>
              ))
            )}
          </div>
          {hasMore ? (
            <div className="mt-3 flex justify-center">
              <Button variant="outline" size="sm" disabled={loadingTx} onClick={() => current && void loadTransactions(current.address, page + 1, network)}>
                {loadingTx ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more"}
              </Button>
            </div>
          ) : null}
        </section>

        {/* Side */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-border/60 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Staking</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Staked</dt><dd className="font-medium">{formatAeko(summary?.stakingInfo.balance ?? 0)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Rewards</dt><dd className="font-medium">{formatAeko(summary?.stakingInfo.rewards ?? 0)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Staking opens when the chain's staking program goes live.</p>
          </section>
          <section className="rounded-2xl border border-border/60 p-4 text-xs text-muted-foreground">
            {isTestnet
              ? "Testnet AEKO is free and has no value. Balances here may be reset."
              : "Mainnet transfers and withdrawals are final. Double-check addresses."}
          </section>
        </aside>
      </div>

      {current ? (
        <>
          <TransferDialog
            kind={dialog === "send" || dialog === "withdraw" ? dialog : null}
            wallet={current}
            network={network}
            onClose={() => setDialog(null)}
            onDone={() => {
              setDialog(null);
              refresh();
            }}
          />
          <ReceiveDialog open={dialog === "receive"} wallet={current} onClose={() => setDialog(null)} />
        </>
      ) : null}
      <CreateWalletDialog
        open={dialog === "create"}
        count={summary?.wallets.length ?? 0}
        network={network}
        onClose={() => setDialog(null)}
        onCreated={(w) => {
          setDialog(null);
          storeWallet(w.address);
          setSelected(w.address);
          void load(network, w.address);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ dialogs */

function TransferDialog({
  kind,
  wallet,
  network,
  onClose,
  onDone,
}: {
  kind: "send" | "withdraw" | null;
  wallet: WalletInfo;
  network: NetworkId;
  onClose: () => void;
  onDone: () => void;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const open = kind !== null;
  const withdraw = kind === "withdraw";
  const fee = withdraw ? WITHDRAWAL_FEE_AEKO : 0;
  const value = Number(amount);
  const total = Number.isFinite(value) ? value + fee : 0;
  const addressOk = ADDRESS_RE.test(to.trim()) && to.trim() !== wallet.address;
  const amountOk = Number.isFinite(value) && value > 0 && total <= wallet.balance;

  useEffect(() => {
    if (!open) {
      setTo("");
      setAmount("");
    }
  }, [open]);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await walletApi<{ signature: string }>(withdraw ? "withdraw" : "transfer", {
        method: "POST",
        body: { toAddress: to.trim(), amountAeko: value, fromWallet: wallet.address },
        network,
      });
      toast.success(`${formatAeko(value)} ${withdraw ? "withdrawn" : "sent"} · ${res.signature.slice(0, 8)}…`);
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{withdraw ? "Withdraw AEKO" : "Send AEKO"}</DialogTitle>
          <DialogDescription>
            {withdraw
              ? `To an external address. A flat ${WITHDRAWAL_FEE_AEKO} AEKO fee applies.`
              : `From ${wallet.name} (${formatAeko(wallet.balance)} available).`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="transfer-to">
              Recipient address
            </label>
            <Input id="transfer-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="AEKO address" spellCheck={false} autoComplete="off" className="font-mono text-sm" />
            {to && !addressOk ? (
              <p className="mt-1 text-xs text-destructive">{to.trim() === wallet.address ? "That's this wallet." : "Not a valid AEKO address."}</p>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="transfer-amount">
              Amount (AEKO)
            </label>
            <div className="flex gap-2">
              <Input id="transfer-amount" type="number" min="0" step="0.0001" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
              <Button type="button" variant="outline" onClick={() => setAmount(String(Math.max(0, wallet.balance - fee)))}>
                Max
              </Button>
            </div>
            {amount && !amountOk ? <p className="mt-1 text-xs text-destructive">Not enough balance{fee ? ` (includes ${fee} AEKO fee)` : ""}.</p> : null}
            {fee && amountOk ? <p className="mt-1 text-xs text-muted-foreground">Total deducted: {formatAeko(total)}</p> : null}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !addressOk || !amountOk}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {withdraw ? "Withdraw" : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReceiveDialog({ open, wallet, onClose }: { open: boolean; wallet: WalletInfo; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Receive AEKO</DialogTitle>
          <DialogDescription>Share this address or let the sender scan the code.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG value={wallet.address} size={192} level="M" />
          </div>
          <code className="break-all rounded-xl bg-muted px-3 py-2 text-center font-mono text-xs">{wallet.address}</code>
          <Button variant="outline" className="w-full" onClick={copy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy address"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateWalletDialog({
  open,
  count,
  network,
  onClose,
  onCreated,
}: {
  open: boolean;
  count: number;
  network: NetworkId;
  onClose: () => void;
  onCreated: (wallet: WalletInfo) => void;
}) {
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!open) setLabel("");
  }, [open]);
  const submit = async () => {
    setBusy(true);
    try {
      const res = await walletApi<{ wallet: WalletInfo }>("create", { method: "POST", body: { label: label.trim() || undefined }, network });
      toast.success(`${res.wallet.name} created`);
      onCreated(res.wallet);
    } catch (err) {
      toast.error(err instanceof WalletApiError ? err.message : "Couldn't create a wallet");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New wallet</DialogTitle>
          <DialogDescription>A fresh address under your account. The same address works on testnet and mainnet.</DialogDescription>
        </DialogHeader>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={`Wallet ${count + 1}`} maxLength={40} autoFocus aria-label="Wallet name" />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WalletPage;
