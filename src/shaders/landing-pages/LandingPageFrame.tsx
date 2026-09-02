import { useEffect, useRef, useState, type CSSProperties } from "react";
import { applyPageCustomization, type LandingPageCustomization } from "./pageTypography";

export type LandingPageFrameProps = { className?: string; sourceUrl: string; srcDoc?: string; style?: CSSProperties; title: string; customization?: LandingPageCustomization };
export type LandingPageProps = Omit<LandingPageFrameProps, "sourceUrl" | "title" | "customization">;
const FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts";

export function LandingPageFrame({ className = "", customization, sourceUrl, srcDoc, style, title }: LandingPageFrameProps) {
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { applyPageCustomization(frameRef.current, customization); }, [customization]);
  return <div className={`threeui-background landing-page-frame${className ? ` ${className}` : ""}`} data-state={ready ? "ready" : "loading"} style={{ position: "relative", overflow: "hidden", background: "#080808", pointerEvents: "auto", ...style }}>
    <iframe ref={frameRef} title={title} {...(srcDoc ? { srcDoc } : { src: sourceUrl })} sandbox={FRAME_SANDBOX} loading="eager" onLoad={(event) => { applyPageCustomization(event.currentTarget, customization); setReady(true); }} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", border: 0, background: "#080808" }} />
  </div>;
}
