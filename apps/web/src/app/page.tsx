import Landing from "@/components/landing/landing";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#040116]">
      <Landing />
      <Image
        src="/bg.png"
        alt="bg"
        width={5000}
        height={5000}
        className="fixed -bottom-60 z-10 h-[90%]  w-full place-self-center object-cover"
      />
    </div>
  );
}
