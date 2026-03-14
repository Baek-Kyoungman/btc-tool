"use client";

import { useEffect } from "react";

/**
 * Chrome 확장 프로그램(지갑 등)의 "Origin not allowed" 에러를 무시합니다.
 * localhost 개발 시 MetaMask, Phantom 등 지갑 확장이 주입하는 스크립트가
 * 이 에러를 발생시킬 수 있습니다.
 */
export function ExtensionErrorSuppress() {
  useEffect(() => {
    const original = window.onerror;

    window.onerror = (
      message: string | Event,
      source?: string,
      _lineno?: number,
      _colno?: number,
      _error?: Error
    ) => {
      const msg = typeof message === "string" ? message : (message as ErrorEvent).message;
      const src = source ?? (message as ErrorEvent).filename;
      const isExtErr =
        (msg?.includes("Origin not allowed") || msg?.includes("sseError not found")) &&
        (typeof src === "string" && src.startsWith("chrome-extension://"));
      if (isExtErr) return true;
      if (original) {
        return original(message, source ?? "", _lineno ?? 0, _colno ?? 0, _error);
      }
      return false;
    };

    // Next.js 에러 오버레이가 "Origin not allowed" 표시 시 자동 닫기
    const getOverlayText = (el: Element): string => {
      let text = el.textContent ?? "";
      const shadow = el.shadowRoot;
      if (shadow) {
        text += " " + (shadow.textContent ?? "");
        shadow.querySelectorAll("*").forEach((c) => {
          text += " " + (c.textContent ?? "");
        });
      }
      return text;
    };

    const findAndClickClose = (el: Element): boolean => {
      const closeBtn =
        el.querySelector('button[aria-label="Close"]') ??
        el.querySelector('[aria-label="close"]') ??
        el.querySelector('button[type="button"]');
      if (closeBtn instanceof HTMLElement) {
        closeBtn.click();
        return true;
      }
      const shadow = el.shadowRoot;
      if (shadow) {
        const btn =
          shadow.querySelector('button[aria-label="Close"]') ??
          shadow.querySelector('[aria-label="close"]');
        if (btn instanceof HTMLElement) {
          btn.click();
          return true;
        }
      }
      return false;
    };

    const checkOverlay = () => {
      const portals = document.querySelectorAll("nextjs-portal, [data-nextjs-dialog]");
      portals.forEach((overlay) => {
        const text = getOverlayText(overlay);
        const isExtErr =
          (text.includes("Origin not allowed") || text.includes("sseError not found")) &&
          text.includes("chrome-extension");
        if (isExtErr) {
          if (!findAndClickClose(overlay)) {
            const el = overlay as HTMLElement;
            el.style.display = "none";
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }
        }
      });
    };

    const timer = setInterval(checkOverlay, 200);
    const observer = new MutationObserver(checkOverlay);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.onerror = original;
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
