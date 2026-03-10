"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider & {
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const getChainName = (id: string) => {
    const chains: Record<string, string> = {
      "0x1": "Ethereum",
      "0x89": "Polygon",
      "0xa": "Optimism",
      "0xa4b1": "Arbitrum",
      "0x2105": "Base",
    };
    return chains[id] ?? `Chain ${parseInt(id, 16)}`;
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("No wallet detected. Install MetaMask.");
      return;
    }
    try {
      setIsConnecting(true);
      setError(null);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAddress(accounts[0]);
      setChainId("0x" + network.chainId.toString(16));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setChainId(null);
  };

  // Sync on account / chain change
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const [accounts] = args;
      const accs = accounts as string[];
      if (accs.length === 0) disconnectWallet();
      else setAddress(accs[0]);
    };

    const handleChainChanged = (...args: unknown[]) => {
      const [id] = args;
      setChainId(id as string);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const navLinks = ["Explore", "Portfolio", "Analytics", "Docs"];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            <span className="font-semibold text-white tracking-tight font-mono text-sm">
              volt<span className="text-violet-400">.fi</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="px-3.5 py-2 text-sm text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.06] transition-all duration-150 font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Chain badge */}
            {chainId && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {getChainName(chainId)}
              </span>
            )}

            {/* Wallet button */}
            {address ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 hover:border-violet-500/40 text-violet-300 text-sm font-mono font-medium transition-all duration-200">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  {shortenAddress(address)}
                </button>

                {/* Dropdown on hover */}
                <div className="absolute right-0 mt-1.5 w-48 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                  <div className="bg-[#111117] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-0.5">Connected</p>
                      <p className="text-xs text-zinc-300 font-mono">{shortenAddress(address)}</p>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                {isConnecting ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Connecting…
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Connect Wallet
                  </>
                )}
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-md hover:bg-white/[0.06] transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="block px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Error toast */}
      {error && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm shadow-lg">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-1 hover:text-red-300">✕</button>
        </div>
      )}
    </nav>
  );
}