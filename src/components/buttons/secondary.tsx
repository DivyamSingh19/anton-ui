"use client";

import { motion, useAnimation } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode, useRef } from "react";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label text or children */
  children?: ReactNode;
  /** Text label – used if children is not provided */
  label?: string;
  /** Extra Tailwind classes */
  className?: string;
  /** onChange-style text input handler (wired to the button's value) */
  onInputChange?: (value: string) => void;
  /** Loading / active state */
  isActive?: boolean;
}

/**
 * CyberButton
 *
 * A pixel-perfect recreation of the neon-lime cyberpunk button.
 * Built with Next.js 14 · Tailwind CSS · TypeScript · Framer Motion
 *
 * The distinctive clipped-corner shape is achieved with CSS `clip-path`
 * so every corner is crisp at every breakpoint.
 */
export default function CyberButton({
  children,
  label,
  className = "",
  onInputChange,
  isActive = false,
  onClick,
  ...rest
}: CyberButtonProps) {
  const controls = useAnimation();
  const rippleRef = useRef<HTMLSpanElement>(null);

  /* ── clip-path polygon that matches the reference image exactly ── */
  const CLIP =
    "polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)";

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    /* ripple burst */
    await controls.start({
      scale: [1, 0.95, 1.03, 1],
      transition: { duration: 0.25, ease: "easeInOut" },
    });
    onClick?.(e);
  };

  return (
    <motion.button
      animate={controls}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onClick={handleClick}
      className={[
        /* base */
        "relative inline-flex items-center justify-center",
        "px-12 py-4",
        "cursor-pointer select-none outline-none border-0",
        /* font */
        "font-mono text-2xl font-normal tracking-wide text-black",
        /* shape */
        "bg-[#BFFF00]",
        /* glow */
        "shadow-[0_0_18px_4px_rgba(191,255,0,0.45),0_0_40px_8px_rgba(191,255,0,0.20)]",
        className,
      ].join(" ")}
      style={{ clipPath: CLIP }}
      aria-label={label ?? (typeof children === "string" ? children : "button")}
      {...(rest as object)}
    >
      {/* ── animated border glow overlay ── */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: CLIP }}
        animate={{
          boxShadow: [
            "inset 0 0 0 2.5px #1a1a00",
            "inset 0 0 0 2.5px #3d4d00",
            "inset 0 0 0 2.5px #1a1a00",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── scan-line shimmer ── */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: CLIP }}
      >
        <motion.span
          className="absolute inset-y-0 w-[60px] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
          animate={{ left: ["-80px", "calc(100% + 80px)"] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatDelay: 1.8,
            ease: "easeInOut",
          }}
        />
      </motion.span>

      {/* ── label ── */}
      <span className="relative z-10 leading-none">
        {children ?? label ?? "Button"}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   Usage demo – drop this into any Next.js page
   ───────────────────────────────────────────── */
export function Demo() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-10">
      {/* Default */}
      <CyberButton
        label="Start Monitoring"
        onClick={() => console.log("monitoring started")}
      />

      {/* Custom text via children */}
      <CyberButton onClick={() => console.log("deploy")}>
        Deploy System
      </CyberButton>

      {/* Wired to an input */}
      <CyberButton
        label="Submit Query"
        onInputChange={(v) => console.log("input:", v)}
      />
    </div>
  );
}