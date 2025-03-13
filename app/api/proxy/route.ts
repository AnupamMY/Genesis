import { route } from "@fal-ai/serverless-proxy/nextjs";
import { type NextRequest } from "next/server";

// Update the URL allow list to include more fal.ai endpoints
const URL_ALLOW_LIST = [
  "https://rest.alpha.fal.ai/tokens/",
  "https://rest.alpha.fal.ai/fal-ai/fast-lightning-sdxl/",
  "https://rest.alpha.fal.ai/fal-ai/",
  "wss://fal.run/fal-ai/fast-lightning-sdxl/ws",
  "https://fal.run/fal-ai/fast-lightning-sdxl/ws"
];

export const POST = (req: NextRequest) => {
  const url = req.headers.get("x-fal-target-url");
  
  // Log the headers for debugging
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  if (!url) {
    console.error("Missing x-fal-target-url header");
    return new Response("Missing the x-fal-target-url header", { status: 400 });
  }

  // More permissive URL check - just check if it contains fal.ai or fal.run
  const isAllowedUrl = URL_ALLOW_LIST.some(allowedUrl => url.startsWith(allowedUrl)) || 
                       url.includes("fal.ai") || 
                       url.includes("fal.run");
  
  if (!isAllowedUrl) {
    console.error(`URL not allowed: ${url}`);
    return new Response(`URL not allowed: ${url}`, { status: 403 });
  }

  // Make cookie check optional in production
  if (process.env.NODE_ENV !== "production") {
    const appCheckCookie = req.cookies.get("fal-app");
    if (!appCheckCookie || !appCheckCookie.value) {
      console.error("Missing fal-app cookie");
      return new Response("Not allowed - missing cookie", { status: 403 });
    }
  }

  return route.POST(req);
};

export const GET = (req: NextRequest) => {
  return route.GET(req);
};
