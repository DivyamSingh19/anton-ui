"use client"

import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { WalletIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

export function WalletButton() {
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("Browser wallet not detected. Please install MetaMask.")
      return
    }

    try {
      setConnecting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      if (accounts.length > 0) {
        setAddress(accounts[0])
        toast.success("Wallet connected")
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error)
      toast.error(error.message || "Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    toast.info("Wallet disconnected")
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: any) => {
        const accs = accounts as string[]
        if (accs.length > 0) {
          setAddress(accs[0])
        } else {
          setAddress(null)
        }
      })
    }
  }, [])

  const truncatedAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : ""

  return (
    <div className="flex items-center gap-3">
      {address ? (
        <button
          onClick={disconnectWallet}
          className="group relative flex items-center gap-3 bg-zinc-900/40 border border-emerald-500/20 px-4 py-2.5 rounded-xl hover:bg-zinc-900/60 hover:border-emerald-500/40 transition-all duration-300"
        >
          <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 font-mono">
            {truncatedAddress}
          </span>
          <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="group relative overflow-hidden flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all duration-300 shadow-2xl shadow-white/5 active:scale-95 disabled:opacity-50"
        >
          {connecting ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <div className="flex items-center justify-center size-4 bg-black rounded-md rotate-[-10deg] group-hover:rotate-0 transition-transform duration-300">
               <WalletIcon className="size-2.5 text-white" />
            </div>
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {connecting ? "Connecting..." : "Connect Wallet"}
          </span>
        </button>
      )}
    </div>
  )
}
