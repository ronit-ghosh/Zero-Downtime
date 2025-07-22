"use client";

import WebsiteDetailsComponent from "@/components/dashboard/website-details";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  if (!id) return
  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-[#0A071E] to-[#040116]">
      <WebsiteDetailsComponent id={id} />
    </div>
  );
}
