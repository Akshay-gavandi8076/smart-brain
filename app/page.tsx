import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Header from "./header";

export default function LandingPage() {
  const words = [
    {
      text: "Smart",
    },
    {
      text: "Brain",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <>
      <Header />

      <div className="relative flex h-full w-full items-center justify-center bg-white bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <div className="flex max-w-fit flex-col items-center justify-center">
          <TypewriterEffect words={words} />

          <p className="relative mt-5 max-w-prose bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-xl font-bold text-transparent">
            Unlock the power of seamless organization and lightning-fast
            retrieval with Smart Brain. Whether you&apos;re jotting down notes,
            uploading files, or searching for information instantly, our
            intelligent platform is designed to enhance your productivity like
            never before.
          </p>
        </div>
      </div>
    </>
  );
}
