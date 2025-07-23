"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { IconArrowRight, IconBrandGoogle } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Session } from "better-auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Auth() {
  const [session, setSession] = useState<Session>();
  const [checkSession, setCheckSession] = useState(false);
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [loginModal, setLoginModal] = useState(true);

  useEffect(() => {
    (async function checkSession() {
      setCheckSession(true);
      const session = await authClient.getSession();
      setSession(session.data?.session);
      setCheckSession(false);
    })();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const response = await authClient.signIn.social({
      provider: "google",
      errorCallbackURL: "/",
      callbackURL: "/dashboard",
      newUserCallbackURL: "/add-website",
    });
    setLoading(false);
    if (response.error) {
      setLoading(false);
      toast(response.error.message);
    }
  };

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const response = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/add-website",
      rememberMe: true,
    });
    setLoading(false);
    if (response.error) {
      setLoading(false);
      toast(response.error.message);
    }
  };

  const handleEmailPasswordSignup = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    const response = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/add-website",
    });
    setLoading(false);
    if (response.error) {
      setLoading(false);
      toast(response.error.message);
    }
  };

  if (checkSession) return <Button variant="custom"></Button>;

  if (!session) {
    return (
      <Dialog>
        <DialogTrigger>
          <div
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 font-semibold text-[#eee]",
              "border border-[#2B2B61] bg-gradient-to-t from-[#11112E] to-[#040116]",
            )}
          >
            Login
            <IconArrowRight size={20} />
          </div>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="flex h-110 max-h-none w-full max-w-none items-center justify-center border-none bg-transparent p-0"
        >
          <DialogTitle />
          <div
            className={cn(
              "mx-auto grid h-150 w-full max-w-200 place-items-center rounded-2xl",
              "bg-gradient-to-br from-[#0A071E] to-[#040116]",
            )}
          >
            <div
              className={cn(
                "relative h-[98%] w-[98.5%] rounded-2xl bg-gradient-to-br from-transparent to-[#494949]/20 p-4",
                "flex flex-col items-center justify-center gap-6 py-20",
              )}
            >
              <h2
                className={cn(
                  "font-outline-1 bg-clip-text text-3xl text-transparent sm:text-4xl",
                  "bg-gradient-to-r from-[#ccc1f1] to-[#F6F6FE] pb-6",
                )}
              >
                {loginModal
                  ? "Log into your account"
                  : "Signup with your email"}
              </h2>
              {!loginModal && (
                <div className="flex flex-col items-start">
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={cn(
                      "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee] dark:bg-[#D9D9D9]/10",
                      "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#EEEEEE]",
                    )}
                  />
                </div>
              )}
              <div className="flex flex-col items-start">
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee] dark:bg-[#D9D9D9]/10",
                    "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#EEEEEE]",
                  )}
                />
                {loginModal ? (
                  <p className="mt-1 pl-2 text-xs text-[#ddd]">
                    Use{" "}
                    <span
                      onClick={() => {
                        toast("Email copied to clipboard ☑️");
                        navigator.clipboard.writeText("demo@gmail.com");
                      }}
                      className="cursor-copy underline"
                    >
                      {" "}
                      demo@gmail.com{" "}
                    </span>{" "}
                    if you don&apos;t want to login
                  </p>
                ) : (
                  <p className="mt-1 pl-2 text-xs text-[#ddd]">
                    User a valid email address.
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start">
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee] dark:bg-[#D9D9D9]/10",
                    "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#eee]",
                  )}
                />
                {loginModal ? (
                  <p className="mt-1 pl-2 text-xs text-[#ddd]">
                    Demo account password{" "}
                    <span
                      onClick={() => {
                        toast("Password copied to clipboard ☑️");
                        navigator.clipboard.writeText("demo1234");
                      }}
                      className="cursor-copy underline"
                    >
                      demo1234
                    </span>{" "}
                    . Click to copy.
                  </p>
                ) : (
                  <p className="mt-1 pl-2 text-xs text-[#ddd]">
                    Use a strong password.
                  </p>
                )}
              </div>

              <Button
                disabled={
                  !email || !password || loading || (!loginModal && !name)
                }
                onClick={
                  !loginModal
                    ? handleEmailPasswordSignup
                    : handleEmailPasswordLogin
                }
                variant="custom"
                className="w-full px-10 py-6 text-lg"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              {loginModal && (
                <Button
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  variant="custom"
                  className="w-full px-10 py-6 text-lg"
                >
                  <IconBrandGoogle className="size-5" />
                  {loading ? "Logging in..." : "Signin with Google"}
                </Button>
              )}
              {loginModal ? (
                <div
                  onClick={() => setLoginModal(!loginModal)}
                  className="cursor-default text-sm text-[#ddd]"
                >
                  New user? <span className="underline">Signup</span>
                </div>
              ) : (
                <div
                  onClick={() => setLoginModal(!loginModal)}
                  className="cursor-default text-sm text-[#ddd]"
                >
                  Already logged in? <span className="underline">Login</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Link href="/dashboard" className="hidden md:block">
      <Button variant="custom">
        Dashboard
        <IconArrowRight />
      </Button>
    </Link>
  );
}
