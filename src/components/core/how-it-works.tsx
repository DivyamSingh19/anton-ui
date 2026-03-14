"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Step",
    description:
      "Developers add their smart contract address and ABI to Kaizen & the system verifies the contract on-chain and begins monitoring activity instantly.",
  },
  {
    number: "02",
    title: "Step",
    description:
      "Kaizen continuously streams mempool and block data, tracking every transaction, event, and interaction related to the registered contract.",
  },
  {
    number: "03",
    title: "Step",
    description:
      "Machine learning models and rule-based security checks analyze contract behavior to detect anomalies like abnormal fund outflows, suspicious admin calls, and flash loan patterns.",
  },
  {
    number: "04",
    title: "Step",
    description:
      "Every suspicious activity receives a risk score. Developers receive instant alerts with clear explanations and transaction details.",
  },
];

function CornerBracket({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const base = "absolute w-4 h-4";
  const borders: Record<string, string> = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`${base} ${borders[position]} border-[#7c3aed]`}
    />
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col gap-6 lg:gap-8 border border-[#2a2a2a] p-6 lg:p-10 xl:p-12 pb-8 h-full bg-black
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        group hover:border-[#7c3aed]/50`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Corner brackets */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Step label */}
      <div className="font-mono text-sm lg:text-base xl:text-xl tracking-widest text-[#a3e635] select-none">
        {step.number} {step.title}
      </div>

      {/* Spacer line */}
      <div className="w-full h-px bg-[#1e1e1e] group-hover:bg-[#7c3aed]/30 transition-colors duration-500" />

      {/* Description */}
      <p className="font-mono text-[13px] lg:text-[14px] xl:text-[16px] leading-relaxed xl:leading-loose text-[#8a8a8a] group-hover:text-[#b0b0b0] transition-colors duration-500">
        {step.description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-black min-h-screen py-16 px-6 md:px-12 font-mono overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        }}
      />

      {/* Main container */}
      <div className="relative z-10 max-w-7xl xl:max-w-[90rem] mx-auto">

        {/* Header box */}
        <div
          ref={headerRef}
          className={`relative border border-[#2a2a2a] px-8 py-5 mb-10
            transition-all duration-700
            ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          {/* Corner accent squares */}
          <span className="absolute top-[-4px] left-[-4px] w-2.5 h-2.5 bg-[#a3e635]" />
          <span className="absolute top-[-4px] right-[-4px] w-2.5 h-2.5 bg-[#a3e635]" />
          <span className="absolute bottom-[-4px] left-[-4px] w-2.5 h-2.5 bg-[#a3e635]" />
          <span className="absolute bottom-[-4px] right-[-4px] w-2.5 h-2.5 bg-[#a3e635]" />

          <h2 className="text-center text-sm md:text-base xl:text-lg tracking-[0.2em] text-[#a855f7] uppercase">
            Continuous protection for smart contracts — from monitoring to autonomous defense.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#2a2a2a]">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`border-[#2a2a2a] flex flex-col ${i < steps.length - 1
                  ? "border-b sm:border-b-0 sm:border-r lg:border-r"
                  : ""
                }`}
            >
              <StepCard step={step} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}