"use client"

import type React from "react"

import { useState, useRef, memo, useEffect } from "react"

const TOKEN_ADDRESS = "53Xy4g1RJnGR6saaJRDNoo1rYTGZ3W5U321EDdSa5BGD"

const ContractAddressDisplay = memo(function ContractAddressDisplay() {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const isCopyingRef = useRef(false)
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const vibrationSupportedRef = useRef<boolean | null>(null)

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

  const triggerVibration = () => {
    if (!vibrationSupportedRef.current) return false

    try {
      const success = navigator.vibrate([100, 30, 100])
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

    console.log("Contract address clicked")

    // Play LOL sound
    if (typeof window !== "undefined" && window.playLolSound) {
      window.playLolSound()
    }

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

  // Function to truncate address in the middle - showing only first 5 and last 5 characters
  const getTruncatedAddress = () => {
    if (copied) return "COPIED!"

    // Show first 5 and last 5 characters with ... in between
    const start = TOKEN_ADDRESS.slice(0, 5)
    const end = TOKEN_ADDRESS.slice(-5)
    return `${start}...${end}`
  }

  return (
    <a
      href="#"
      onClick={handleCopy}
      className={`contract-address-button ${isHovered ? "hovered" : ""} ${isClicked ? "button-pulse-active" : ""} ${copied ? "copied" : ""} zero-gravity-sync-quintuple`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="contract-address-text">{getTruncatedAddress()}</span>
      {copied && <span className="check-icon">✓</span>}

      <style jsx>{`
        .contract-address-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          color: #000000 !important;
          padding: 0;
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-orbitron), monospace;
          /* Full size font matching other buttons */
          font-size: clamp(1.458rem, 5.67vmin, 3.24rem) !important;
          box-shadow: none;
          margin: 0;
          border: none;
          position: relative;
          overflow: visible;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          font-weight: 900;
          letter-spacing: 0.05em;
          cursor: pointer;
          -webkit-text-stroke: 0.5px #000000 !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          filter: none;
          word-break: keep-all;
          white-space: nowrap;
          text-align: center;
          line-height: 1.2;
          min-width: auto;
          max-width: 90vw;
          /* Calmed down floating motion - reduced movement and slower duration */
          animation: calm-gentle-float 8.5s ease-in-out infinite alternate-reverse;
        }

        .contract-address-text {
          font-weight: 900;
          /* Full size font matching other buttons */
          font-size: clamp(1.458rem, 5.67vmin, 3.24rem) !important;
          letter-spacing: 0.05em;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          position: relative;
          z-index: 2;
          color: #000000 !important;
          -webkit-text-stroke: 0.5px #000000 !important;
          /* Equalized shadow - no glow */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
          text-decoration: underline;
          text-decoration-color: black;
          text-decoration-thickness: 5px; /* Back to full thickness matching other buttons */
          text-underline-offset: 3px; /* Back to full offset matching other buttons */
          word-break: keep-all;
          overflow-wrap: normal;
        }

        .check-icon {
          color: #00ff00 !important; /* Back to green */
          font-size: 17px; /* Matching other buttons */
          font-weight: 900;
          -webkit-text-stroke: 1px #00ff00 !important; /* Back to green */
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

        .contract-address-button:hover .contract-address-text {
          /* Equalized hover shadow - no glow */
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
        }

        .contract-address-button:hover, .contract-address-button.hovered {
          color: #333 !important;
          transform: translateZ(0) translateY(-3px) scale(1.05);
        }

        .contract-address-button:active {
          transform: translateZ(0) translateY(-1px) scale(1.02);
        }

        .contract-address-button.copied .contract-address-text {
          color: #000000 !important;
          -webkit-text-stroke: 0.5px #000000 !important;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
        }

        .button-pulse-active {
          animation: pulse 0.3s ease-out;
        }

        @keyframes pulse {
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

        /* Calmed down floating animation - reduced movement and slower */
        @keyframes calm-gentle-float {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-2px); /* Reduced from -4px to -2px */
          }
        }

        /* Responsive adjustments for mobile devices */
        @media (max-width: 768px) {
          .contract-address-button {
            max-width: 95vw;
          }
          
          .contract-address-text {
            word-break: keep-all;
            line-height: 1.1;
          }
        }

        @media (max-width: 480px) {
          .contract-address-button {
            max-width: 98vw;
          }
          
          .contract-address-text {
            letter-spacing: 0.02em;
          }
        }
      `}</style>
    </a>
  )
})

export default ContractAddressDisplay

declare global {
  interface Window {
    playLolSound?: () => void
  }
}
