"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Navbar from "./navbar";
import { motion } from "motion/react";

export default function Landing() {
  return (
    <div className="relative z-20 mx-auto h-full w-full max-w-5xl">
      <Navbar />
      <div className="flex flex-col items-center">
        <motion.h1
          initial={{
            y: 30,
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
          className="mt-48 flex flex-col items-center"
        >
          <span
            className={cn(
              "font-outline-1 bg-clip-text text-4xl font-extrabold text-transparent sm:text-7xl md:text-8xl",
              "bg-gradient-to-r from-[#ccc1f1] to-[#F6F6FE]",
            )}
          >
            Built for
          </span>
          <span className="relative">
            <span
              className={cn(
                "font-outline-1 relative z-40 bg-clip-text text-4xl font-extrabold text-transparent sm:text-7xl md:text-8xl",
                "bg-gradient-to-r from-[#DAD3F4] to-[#F6F6FE]",
              )}
            >
              Zero Downtime
            </span>
            <span
              className={cn(
                "absolute inset-0 z-10 text-4xl font-extrabold mix-blend-plus-lighter blur-[5px] sm:text-7xl md:text-8xl",
                "bg-[#917FD3] bg-clip-text text-transparent",
              )}
            >
              Zero Downtime
            </span>
            <span
              className={cn(
                "absolute inset-0 z-10 text-4xl font-extrabold mix-blend-plus-lighter blur-md sm:text-7xl md:text-8xl",
                "bg-[#4C42E1] bg-clip-text text-transparent",
              )}
            >
              Zero Downtime
            </span>
          </span>
        </motion.h1>
        <motion.h3
          initial={{
            opacity: 0,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.3,
          }}
          className={cn(
            "mt-6 w-full max-w-xl px-4 text-center text-xs font-light text-[#eee] sm:text-lg md:text-xl",
            "bg-gradient-to-b from-[#C6BBEE] to-[#E7E0FF] bg-clip-text text-transparent",
          )}
        >
          Stop relying on luck. Get a modern observability tool that actually
          alerts you when your site goes down, instantly.
        </motion.h3>
        <motion.div
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
          className="mx-auto mt-10 flex w-full flex-col items-center gap-3 px-2 sm:flex-row sm:justify-center"
        >
          <Input
            placeholder="Enter website url"
            className={cn(
              "h-12 w-full max-w-xs border opacity-45 sm:max-w-md md:w-96 dark:border-[#eee] dark:bg-[#D9D9D9]",
              "placeholder:text-lg placeholder:text-black",
            )}
          />
          <Button
            variant="custom"
            className="h-12 w-full max-w-xs px-6 text-base font-bold opacity-88 sm:w-auto sm:px-8 sm:text-lg"
          >
            Start for Free
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
