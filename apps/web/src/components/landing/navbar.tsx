"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IconArrowRight, IconMenu } from "@tabler/icons-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "../ui/sheet";

const NAV_LINKS = [
  {
    name: "home",
    href: "/",
  },
  {
    name: "demo",
    href: "/demo",
  },
  {
    name: "github",
    href: "https://github.com/ronit-ghosh/Zero-Downtime",
  },
];

export default function Navbar() {
  const [hovered, setHovered] = useState<number | null>();
  return (
    <motion.header
      initial={{
        y: -30,
        opacity: 0,
        filter: "blur(10px)",
      }}
      animate={{
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.3,
      }}
      className="mx-auto flex max-w-4xl items-center justify-between px-4 pt-4"
    >
      <Link href="/" className="relative cursor-pointer">
        <Image
          src="/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="z-40"
        />
        <Image
          src="/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="absolute inset-0 z-10 mix-blend-plus-lighter blur-[4px]"
        />
      </Link>
      {/* Desktop Nav */}
      <nav className="hidden md:block">
        <ul>
          <li className="gap- flex items-center justify-center">
            {NAV_LINKS.map((link, i) => {
              return (
                <Link
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  key={i}
                  href={link.href}
                  className="relative flex cursor-pointer items-center justify-center px-6 py-2"
                >
                  <span className="z-40 font-semibold text-[#eee] capitalize">
                    {link.name}
                  </span>
                  {hovered === i && (
                    <motion.span
                      layoutId="nav-bg"
                      className={cn(
                        "absolute inset-0 z-10 rounded-2xl border border-[#2B2B61]",
                        "bg-gradient-to-t from-[#11112E] to-[#040116]",
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </li>
        </ul>
      </nav>
      {/* Desktop Dashboard Button */}
      <Link href="/dashboard" className="hidden md:block">
        <Button variant="custom">
          Dashboard
          <IconArrowRight />
        </Button>
      </Link>
      {/* Mobile Hamburger + Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="custom" size="icon">
              <IconMenu />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gradient-to-tl from-[#040114] to-[#080421]" side="right">
            <SheetTitle />
            <nav className="mt-8 flex flex-col gap-4 divide-y-2 px-3">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="font-semibold capitalize text-[#eee] px-4 py-2 rounded hover:bg-[#22223a] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/dashboard" className="flex justify-center">
                <Button variant="custom" className="mt-4">
                  Dashboard <IconArrowRight />
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
