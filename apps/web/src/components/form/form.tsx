"use client";

import { BACKEND_URL, cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Form({
  isUpdate,
  websiteId,
}: {
  isUpdate: boolean;
  websiteId?: string;
}) {
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isUpdate) return;

    (async function getWebsite() {
      if (!websiteId) return;
      const response = await axios.get(
        `${BACKEND_URL}/api/website/get/id?id=${websiteId}`,
      );
      setName(response.data.website.name);
      setUrl(response.data.website.url);
    })();
  }, [isUpdate, websiteId]);

  const handleWebsiteUpdate = async () => {
    if (!BACKEND_URL) {
      console.error("`NEXT_PUBLIC_BACKEND_URL` is not available in .env!");
      return;
    }
    try {
      if (!websiteId) return;
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/website/update`, {
        name,
        url,
        websiteId,
      });
      console.log(response.data.id);
      setLoading(false);
      toast("You can see updated in your dashboard.");
    } catch (error) {
      setLoading(false);
      toast("Please try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleWebsiteCreate = async () => {
    if (!BACKEND_URL) {
      console.error("`NEXT_PUBLIC_BACKEND_URL` is not available in .env!");
      return;
    }
    try {
      if (!name || !url) return;
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/website/create`, {
        name,
        url,
      });
      console.log(response.data.id);
      setLoading(false);
      toast("Website tracking will be started in 3min.");
      toast("You can see updated in your dashboard.");
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      toast("Please try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-4 pt-20">
      <div
        className={cn(
          "mx-auto grid h-140 w-full max-w-200 place-items-center rounded-2xl",
          `bg-gradient-to-br ${isUpdate ? "from-[#2828286a] to-[#5454545b] backdrop-blur-sm" : "from-transparent to-[#494949]/20"}`,
        )}
      >
        <div
          className={cn(
            `relative h-[98%] w-[98.5%] rounded-2xl bg-gradient-to-br ${isUpdate ? "from-[#040217a2] to-[#07032a8a] backdrop-blur-sm" : "from-transparent to-[#494949]/20"} p-4`,
            "flex flex-col items-center justify-center gap-6 py-20",
          )}
        >
          {!isUpdate && <TopGlow />}
          {!isUpdate && <LeftGlow />}
          <h2
            className={cn(
              "font-outline-1 bg-clip-text text-4xl text-transparent sm:text-5xl",
              "bg-gradient-to-r from-[#ccc1f1] to-[#F6F6FE] pb-6",
            )}
          >
            {isUpdate ? "Update" : "Add"} your website
          </h2>
          <form
            className="flex flex-col items-center space-y-4"
            onSubmit={isUpdate ? handleWebsiteUpdate : handleWebsiteCreate}
          >
            <div className="flex flex-col items-start">
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Name"
                className={cn(
                  "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee]",
                  "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#EEEEEE]",
                )}
              />
              <p className="mt-1 pl-2 text-xs text-[#ddd]">
                A friendly name to identify your website in the dashboard.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                placeholder="Website URL"
                className={cn(
                  "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee]",
                  "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#EEEEEE]",
                )}
              />
              <p className="mt-1 pl-2 text-xs text-[#ddd]">
                The URL of your website. We&apos;ll automatically add https://
                if not provided.
              </p>
            </div>
            <Button
              disabled={name?.length === 0 || url?.length === 0 || loading}
              type="submit"
              variant="custom"
              className="px-10 py-6 text-xl"
            >
              {loading ? "Submiitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

function TopGlow() {
  return (
    <>
      <span
        className={cn(
          "absolute top-0 h-px w-[80%]",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%]",
          "bg-gradient-to-r from-transparent via-[#4b21ff] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%] mix-blend-plus-lighter blur-sm",
          "bg-gradient-to-r from-transparent via-[#4b21ff] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%] mix-blend-plus-lighter blur-sm",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%]",
          "bg-gradient-to-r from-transparent via-[#4b21ff] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%]",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%] mix-blend-plus-lighter blur-sm",
          "bg-gradient-to-r from-transparent via-[#4b21ff] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute top-0 h-px w-[80%] mix-blend-plus-lighter blur-sm",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
    </>
  );
}

function LeftGlow() {
  return (
    <>
      <span
        className={cn(
          "absolute -left-49 h-px w-[50%] rotate-90",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute -left-49 h-px w-[50%] rotate-90",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute -left-49 h-px w-[50%] rotate-90 blur-sm",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
      <span
        className={cn(
          "absolute -left-49 h-px w-[50%] rotate-90 blur-sm",
          "bg-gradient-to-r from-transparent via-[#7300FF] to-transparent",
        )}
      />
    </>
  );
}
