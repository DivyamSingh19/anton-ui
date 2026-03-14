// SignInButton.tsx
"use client";

import { useRouter } from "next/navigation";

interface SignInButtonProps {
  onClick?: () => void;
  label?: string;
  href?: string;
  size?: "default" | "sm";
}

export default function SignInButton({
  onClick,
  label = "SIGN IN",
  href,
  size = "default",
}: SignInButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.push("/login"); // Default fallback to login
    }
  };

  const cutSize = size === "sm" ? 8 : 12;
  const sizeClasses = size === "sm" ? "px-5 py-2 text-xs font-extrabold" : "px-10 py-4 text-lg font-black";

  return (
    <button
      onClick={handleClick}
      style={{
        clipPath:
          `polygon(0% 0%, calc(100% - ${cutSize}px) 0%, 100% ${cutSize}px, 100% 100%, ${cutSize}px 100%, 0% calc(100% - ${cutSize}px))`,
      }}
      className={`
        bg-[#AAFF00]
        text-black
        tracking-widest
        uppercase
        transition-all
        duration-150
        hover:brightness-110
        active:scale-95
        cursor-pointer
        select-none
        ${sizeClasses}
      `}
    >
      {label}
    </button>
  );
}