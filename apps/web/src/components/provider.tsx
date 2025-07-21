import { Toaster } from "./ui/sonner";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      {children}
    </div>
  );
}
