import { ThemeToggle } from "@/components/theme-toggle";
import { ModelIcon } from "@/components/icons/model-icon";
import Link from "next/link";
import { Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

const spaceMono = Space_Mono({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

export function Nav() {
  return (
    <div className="h-14 py-2 px-2 md:px-8 border-b flex items-center">
      <div className="flex flex-1 items-center justify-between">
        <Link href="/">
          <h1 className={cn("font-light text-xl", spaceMono.className)}>
            <span>Genesis</span>
          </h1>
        </Link>
        <div className="right-side flex">
          <Link href="/creations">
            <h1 className={cn("font-light text-xl mr-5", spaceMono.className)}>
              <span>creations</span>
            </h1>
          </Link>
          <Link href="/about">
            <h1 className={cn("font-light text-xl mr-5", spaceMono.className)}>
              <span>about</span>
            </h1>
          </Link>
        </div>
      </div>
      <div className="flex flex-none items-center space-x-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
