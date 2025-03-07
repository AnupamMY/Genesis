"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import * as fal from "@fal-ai/serverless-client";
import { useEffect, useRef, useState, use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { ModelIcon } from "@/components/icons/model-icon";
import Link from "next/link";
import axios from "axios"
const DEFAULT_PROMPT =
  "A cinematic shot a beach in sunset with beautifull trees around";

function randomSeed() {
  return Math.floor(Math.random() * 10000000).toFixed(0);
}

fal.config({
  proxyUrl: "/api/proxy",
});

const INPUT_DEFAULTS = {
  _force_msgpack: new Uint8Array([]),
  enable_safety_checker: true,
  image_size: "square_hd",
  sync_mode: true,
  num_images: 1,
  num_inference_steps: "2",
};

export default function Lightning() {
  const [image, setImage] = useState<null | string>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [seed, setSeed] = useState<string>(randomSeed());
  const [inferenceTime, setInferenceTime] = useState<number>(NaN);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const connection = fal.realtime.connect("fal-ai/fast-lightning-sdxl", {
    connectionKey: "lightning-sdxl",
    throttleInterval: 64,
    onResult: (result) => {
      const blob = new Blob([result.images[0].content], { type: "image/jpeg" });
      setImage(URL.createObjectURL(blob));
      setInferenceTime(result.timings.inference);
    },
  });

  const timer = useRef<any | undefined>(undefined);

  const handleOnChange = async (prompt: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setPrompt(prompt);
    const input = {
      ...INPUT_DEFAULTS,
      prompt: prompt,
      seed: seed ? Number(seed) : Number(randomSeed()),
    };
    connection.send(input);
    timer.current = setTimeout(() => {
      connection.send({ ...input, num_inference_steps: "4" });
    }, 500);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.cookie = "fal-app=true; path=/; samesite=strict; secure;";
    }
    // initial image
    connection.send({
      ...INPUT_DEFAULTS,
      num_inference_steps: "4",
      prompt: prompt,
      seed: seed ? Number(seed) : Number(randomSeed()),
    });
  }, []);

  const handleDownload = () => {
    const img = document.getElementById("imageDisplay") as HTMLImageElement;
    if (img && img.complete) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      const blob = dataURLtoBlob(dataURL);
      saveAs(blob, "image.jpg");
      uploadImage(blob);
    } else {
      console.error("Image not loaded.");
    }
  };

  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  const uploadImage = async (imageBlob) => {
    try {
      if (!(imageBlob instanceof Blob)) {
        console.error("Invalid image data");
        return;
      }

      const formData = new FormData();
      formData.append("file", imageBlob);

      const response = await axios.post('/api/upload', formData);
      console.log("Upload successful:", response.data);
      return response.data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Upload failed:", error.response?.data?.error?.message || error.message);
      } else {
        console.error("Upload failed:", error);
      }
      return null;
    }
  };
  return (
    <main>
      <div className="flex flex-col justify-between h-[calc(100vh-56px)]">
        <div className="py-4 md:py-10 px-0 space-y-4 lg:space-y-8 mx-auto w-full max-w-xl">
          <div className="container px-3 md:px-0 flex flex-col space-y-2">
            <div className="flex flex-col max-md:space-y-4 md:flex-row md:space-x-4 max-w-full">
              <div className="flex-1 space-y-1">
                <label>Prompt</label>
                <Input
                  onChange={(e) => {
                    handleOnChange(e.target.value);
                  }}
                  className="font-light w-full"
                  placeholder="Type something..."
                  value={prompt}
                />
              </div>
              <div className="space-y-1">
                <label>Seed</label>
                <Input
                  onChange={(e) => {
                    setSeed(e.target.value);
                    handleOnChange(prompt);
                  }}
                  className="font-light w-28"
                  placeholder="random"
                  type="number"
                  value={seed}
                />
              </div>
            </div>
            <div className="download-button flex justify-end">
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </div>
          <div className="container flex flex-col space-y-6 lg:flex-row lg:space-y-0 p-3 md:p-0">
            <div className="flex-1 flex-col flex items-center justify-center">
              {image && inferenceTime && (
                <div className="flex flex-row space-x-1 text-sm w-full mb-2">
                  <span className="text-neutral-500">Inference time:</span>
                  <span
                    className={
                      !inferenceTime ? "text-neutral-500" : "text-green-400"
                    }
                  >
                    {inferenceTime
                      ? `${(inferenceTime * 1000).toFixed(0)}ms`
                      : `n/a`}
                  </span>
                </div>
              )}
              <div className="md:min-h-[512px] max-w-fit">
                {image && (
                  <img id="imageDisplay" src={image} alt="Dynamic Image" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center my-4">
          <span className="text-neutral-500">
            There are pre written prompt with seed number to get new image write
            new prompt in prompt box
          </span>
          <p className="text-sm text-base-content/70 py-4 text-center text-neutral-400">
            Made by Anupam.
          </p>
        </div>
      </div>
    </main>
  );
}
