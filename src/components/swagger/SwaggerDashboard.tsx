"use client";

import {
  useState,
  useMemo,
  ReactElement,
  useEffect,
  useRef,
  type ChangeEvent,
} from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { SwaggerViewer } from "./SwaggerViewer";
import { detectSchemaFormat } from "@/lib/swagger/detect-schema-format";

const ACCEPTED_SCHEMA_EXTENSIONS = ".json,.yaml,.yml";

export default function SwaggerDashboard(): ReactElement {
  const [schemaText, setSchemaText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (): void => {
      if (typeof reader.result === "string") setSchemaText(reader.result);
      event.target.value = "";
    };
    reader.readAsText(file);
  };
  const schemaFormat = useMemo(
    () => detectSchemaFormat(schemaText),
    [schemaText]
  );

  const [isMobile, setIsMobile] = useState<boolean>((): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect((): (() => void) => {
    const mediaQuery: MediaQueryList = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent): void => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return (): void => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  const currentOrientation = isMobile
    ? ("vertical" as const)
    : ("horizontal" as const);
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[#1b1b1b] select-none">
      <ResizablePanelGroup
        orientation={currentOrientation}
        className="flex h-full w-full bg-[#1b1b1b]"
      >
        {/* Editor - for example - feature of Mark */}
        <ResizablePanel defaultSize={50} minSize={25} className="h-full w-full">
          <div className="flex h-full flex-col bg-[#1b1b1b] font-mono text-[#f8f8f2]">
            <div className="flex h-9 items-center justify-between border-b border-[#1a1a1a] bg-[#2d2d2d] px-4 select-none">
              <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                Swagger Editor // Live Code
              </span>
              {schemaFormat !== "unknown" && (
                <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  {schemaFormat}
                </span>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_SCHEMA_EXTENSIONS}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Upload JSON/YAML file
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#1b1b1b] p-2">
              <textarea
                className="custom-scrollbar h-full w-full resize-none bg-[#1b1b1b] p-3 font-mono text-[13px] leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                placeholder="Paste scheme here..."
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="border-zinc-800 bg-[#1a1a1a] transition-colors hover:bg-zinc-700 data-[panel-group-direction=horizontal]:w-2 data-[panel-group-direction=vertical]:h-2"
        />

        <ResizablePanel defaultSize={50} minSize={25} className="h-full w-full">
          <div className="flex h-full flex-col bg-white text-zinc-900">
            <div className="flex h-9 items-center border-b border-zinc-200 bg-zinc-50 px-4 select-none">
              <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                Swagger UI // API Documentation
              </span>
            </div>

            <div className="custom-scrollbar-light flex-1 overflow-y-auto bg-white p-6">
              {schemaText.trim() ? (
                <div className="animate-fade-in">
                  <ResizablePanel
                    defaultSize={50}
                    minSize={25}
                    className="h-full w-full"
                  >
                    <div className="flex h-full flex-col bg-white text-zinc-900">
                      <div className="custom-scrollbar-light flex-1 overflow-y-auto bg-white p-6">
                        <SwaggerViewer schemaText={schemaText} />
                      </div>
                    </div>
                  </ResizablePanel>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center select-none">
                  <p className="text-xs text-zinc-400">
                    The Viewer will automatically populate when schema is
                    provided.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
