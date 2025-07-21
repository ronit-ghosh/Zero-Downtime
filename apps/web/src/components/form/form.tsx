import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Form() {
  return (
    <main className="px-4 pt-20">
      <div
        className={cn(
          "mx-auto grid h-140 w-full max-w-200 place-items-center rounded-2xl",
          "bg-gradient-to-br from-transparent to-[#494949]/20",
        )}
      >
        <div
          className={cn(
            "relative h-[98%] w-[98.5%] rounded-2xl bg-gradient-to-br from-transparent to-[#494949]/20 p-4",
            "flex flex-col items-center justify-center gap-6 py-20",
          )}
        >
          <TopGlow />
          <LeftGlow />
          <h2
            className={cn(
              "font-outline-1 bg-clip-text text-4xl text-transparent sm:text-5xl",
              "bg-gradient-to-r from-[#ccc1f1] to-[#F6F6FE] pb-6",
            )}
          >
            Add your website
          </h2>
          <div className="flex flex-col items-start">
            <Input
              placeholder="Name"
              className={cn(
                "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee] dark:bg-[#D9D9D9]/6",
                "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#EEEEEE]",
              )}
            />
            <p className="mt-1 pl-2 text-xs text-[#ddd]">
              A friendly name to identify your website in the dashboard.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <Input
              placeholder="Website URL"
              className={cn(
                "h-12 w-full border opacity-45 sm:w-md dark:border-[#eee] dark:bg-[#D9D9D9]/6",
                "rounded-2xl pl-4 placeholder:text-lg placeholder:text-[#EEEEEE]",
              )}
            />
            <p className="mt-1 pl-2 text-xs text-[#ddd]">
              The URL of your website. We&apos;ll automatically add https:// if
              not provided.
            </p>
          </div>

          <Button variant="custom" className="px-10 py-6 text-xl">
            Submit
          </Button>
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
