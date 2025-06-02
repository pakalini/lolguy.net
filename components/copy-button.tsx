"use client"

import type React from "react"

import { useState, useRef, memo, useEffect } from "react"
// Removed Copy import as it's no longer used
// import { Copy } from 'lucide-react'

const TOKEN_ADDRESS = "53Xy4g1RJnGR6saaJRDNoo1rYTGZ3W5U321EDdSa5BGD"

const CopyButton = memo(function CopyButton() {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [buttonWidth, setButtonWidth] = useState<number | null>(null)
  const isCopyingRef = useRef(false)
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const vibrationSupportedRef = useRef<boolean | null>(null)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    vibrationSupportedRef.current =
      typeof navigator !== "undefined" && "vibrate" in navigator && typeof navigator.vibrate === "function"

    if (vibrationSupportedRef.current) {
      try {
        navigator.vibrate(1)
        console.log("Vibration API is supported and initialized")
      } catch (e) {
        console.warn("Vibration API is supported but failed to initialize:", e)
        vibrationSupportedRef.current = false
      }
    } else {
      console.warn("Vibration API is not supported on this device")
    }
  }, [])

  useEffect(() => {
    if (buttonRef.current && !buttonWidth) {
      const width = buttonRef.current.offsetWidth
      setButtonWidth(width)
    }
  }, [buttonWidth])

  const triggerVibration = () => {
    if (!vibrationSupportedRef.current) return false

    try {
      const success = navigator.vibrate([100, 30, 100, 30, 100])

      if (success) {
        console.log("Vibration triggered successfully")
      } else {
        console.warn("Vibration call returned false")
        setTimeout(() => {
          navigator.vibrate(200)
        }, 50)
      }

      return success
    } catch (e) {
      console.error("Vibration failed:", e)
      return false
    }
  }

  const fallbackCopyTextToClipboard = (text: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const textArea = document.createElement("textarea")
        textArea.value = text

        Object.assign(textArea.style, {
          position: "fixed",
          left: "0",
          top: "0",
          width: "2em",
          height: "2em",
          padding: "0",
          border: "none",
          outline: "none",
          boxShadow: "none",
          background: "transparent",
          opacity: "0",
        })

        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)
        resolve(successful)
      } catch (err) {
        console.error("Fallback copy failed:", err)
        resolve(false)
      }
    })
  }

  const handleCopy = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)

    console.log("Copy button clicked")
    triggerVibration()

    if (isCopyingRef.current || copied) return
    isCopyingRef.current = true

    try {
      let copySuccessful = false

      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
          await navigator.clipboard.writeText(TOKEN_ADDRESS)
          copySuccessful = true
        } catch (clipboardError) {
          // Silently fallback to next method
        }
      }

      if (!copySuccessful) {
        copySuccessful = await fallbackCopyTextToClipboard(TOKEN_ADDRESS)
      }

      if (!copySuccessful) {
        window.prompt("Copy the address by pressing Ctrl+C / Cmd+C:", TOKEN_ADDRESS)
        copySuccessful = true
      }

      requestAnimationFrame(() => {
        setCopied(true)
      })

      if (copySuccessful) {
        setTimeout(() => triggerVibration(), 100)
      }

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current)
      }

      copyTimerRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          setCopied(false)
          copyTimerRef.current = null
        })
      }, 3000)
    } catch (err) {
      console.error("Copy operation failed:", err)
    } finally {
      setTimeout(() => {
        isCopyingRef.current = false
      }, 300)
    }
  }

  return (
    <a
      ref={buttonRef}
      href="#"
      onClick={handleCopy}
      className={`copy-button ${isHovered ? "hovered" : ""} ${copied ? "copied" : ""} ${isClicked ? "button-pulse-active" : ""} zero-gravity-sync-secondary`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonWidth ? { width: `${buttonWidth}px` } : {}}
    >
      <span className="copy-text">{copied ? "Copied" : "COPY CA"}</span>
      {
        copied ? (
          <span className="check-icon-wrapper">✓</span>
        ) : // Removed the icon-wrapper and Copy icon
        // <span className="icon-wrapper">
        //   <Copy size={17} strokeWidth={4} stroke="#ff0000" />
        // </span>
        null // Render nothing if not copied and no icon
      }

      <style jsx>{`
        .copy-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent !important;
          color: black !important;
          padding: 0; /* Added horizontal padding for brackets */
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-orbitron), monospace;
          font-size: clamp(0.9rem, 3.5vmin, 2rem);
          box-shadow: none;
          margin: 0;
          border: none;
          cursor: pointer;
          min-width: auto;
          max-width: 100%;
          white-space: nowrap;
          overflow: visible;
          text-overflow: ellipsis;
          position: relative;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          font-weight: 900;
          letter-spacing: 0.05em;
          -webkit-text-stroke: 0.5px #000000;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          filter: none;
          word-break: keep-all;
          text-align: center;
          line-height: 1.2;
          animation: calm-sway 6.5s ease-in-out infinite alternate-reverse;
        }

        .copy-text {
          font-weight: 900;
          font-size: clamp(1.458rem, 5.67vmin, 3.24rem);
          letter-spacing: 0.05em;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          position: relative;
          z-index: 2;
          color: black !important;
          -webkit-text-stroke: 0.5px rgb(0, 0, 0);
          /* Equalized shadow - no glow */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
        }

        /* Removed icon-wrapper styles as the icon is removed */

        .copy-button:hover .copy-text {
          /* Equalized hover shadow - no glow */
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
        }

        .check-icon-wrapper {
          color: #00ff00 !important;
          font-size: 17px;
          font-weight: 900;
          -webkit-text-stroke: 1px #00ff00 !important;
          /* Green shadow only - no glow or animation */
          filter: drop-shadow(0 2px 4px rgba(0, 255, 0, 0.4)) drop-shadow(0 4px 8px rgba(0, 255, 0, 0.3));
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          width: 17px;
          height: 17px;
          flex-shrink: 0;
          transform-origin: center;
          position: relative;
          z-index: 2;
        }

        .copy-button:hover, 
        .copy-button.hovered {
          color: #333 !important;
          transform: translateZ(0) translateY(-3px) scale(1.05);
        }

        .copy-button:active {
          transform: translateZ(0) translateY(-1px) scale(1.02);
        }

        .copy-button .copy-text,
        .copy-button:hover .copy-text,
        .copy-button:active .copy-text,
        .copy-button.copied .copy-text {
          color: black !important;
        }

        .button-pulse-active {
          animation: button-pulse 0.3s ease-out;
        }

        @keyframes button-pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes calm-sway {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          100% {
            transform: translateX(3px) rotate(1deg);
          }
        }
      `}</style>
    </a>
  )
})

export default CopyButton
