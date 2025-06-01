"use client"

import type React from "react"

import { useState, useRef, memo, useEffect } from "react"

const TOKEN_ADDRESS = "53Xy4g1RJnGR6saaJRDNoo1rYTGZ3W5U321EDdSa5BGD"

const ContractAddress = memo(function ContractAddress() {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isCopyingRef = useRef(false)
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const vibrationSupportedRef = useRef<boolean | null>(null)

  useEffect(() => {
    vibrationSupportedRef.current =
      typeof navigator !== "undefined" && "vibrate" in navigator && typeof navigator.vibrate === "function"

    if (vibrationSupportedRef.current) {
      try {
        navigator.vibrate(1)
      } catch (e) {
        vibrationSupportedRef.current = false
      }
    }
  }, [])

  const triggerVibration = () => {
    if (!vibrationSupportedRef.current) return false

    try {
      const success = navigator.vibrate([50, 25, 50])
      return success
    } catch (e) {
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
        resolve(false)
      }
    })
  }

  const handleCopy = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()

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

      // Set copied state but don't show confirmation text
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
      }, 2000)
    } catch (err) {
      console.error("Copy operation failed:", err)
    } finally {
      setTimeout(() => {
        isCopyingRef.current = false
      }, 300)
    }
  }

  return (
    <div
      className={`contract-address-container ${isHovered ? "hovered" : ""} ${copied ? "copied" : ""} zero-gravity-sync-micro`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCopy}
    >
      <span className="bracket-left">[</span>
      <span className="address-text">{TOKEN_ADDRESS}</span>
      <span className="bracket-right">]</span>

      <style jsx>{`
        .contract-address-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 0;
          background: transparent;
          color: black;
          padding: clamp(4px, 1vh, 8px) clamp(6px, 1.5vw, 12px);
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-orbitron), monospace;
          margin: 0;
          border: none;
          position: relative;
          overflow: visible;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          font-weight: 400;
          cursor: pointer;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          word-break: break-all;
          text-align: center;
          line-height: 1.2;
          min-width: auto;
          max-width: 90vw;
          background: transparent;
          box-shadow: none;
        }

        .bracket-left,
        .bracket-right {
          font-weight: 900 !important;
          /* 2x bigger brackets - doubled from previous size */
          font-size: clamp(1.6rem, 5vmin, 2.6rem);
          color: #000000 !important;
          -webkit-text-stroke: 1.5px #000000 !important;
          /* Enhanced black shadow for brackets */
          text-shadow: 0 0 12px rgba(0, 0, 0, 0.4), 0 6px 10px rgba(0, 0, 0, 0.3),
            0 0 24px rgba(0, 0, 0, 0.2) !important;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25)) !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          position: relative;
          z-index: 2;
          line-height: 0.8;
          display: flex;
          align-items: center;
        }

        .address-text {
          font-weight: 900 !important;
          font-size: clamp(0.7rem, 2.2vmin, 1.1rem);
          letter-spacing: 0.02em;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          position: relative;
          z-index: 2;
          color: #ff0000 !important;
          -webkit-text-stroke: 1px #ff0000 !important;
          /* Red shadow for text */
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.3), 0 4px 8px rgba(255, 0, 0, 0.2),
            0 0 20px rgba(255, 0, 0, 0.1) !important;
          filter: drop-shadow(0 8px 16px rgba(255, 0, 0, 0.15)) !important;
          word-spacing: -0.1em;
          font-variant-numeric: tabular-nums;
          padding: 0;
        }

        .contract-address-container:hover .address-text {
          color: #ff0000 !important;
          /* Enhanced red shadow on hover */
          text-shadow: 0 0 15px rgba(255, 0, 0, 0.4), 0 6px 12px rgba(255, 0, 0, 0.3),
            0 0 30px rgba(255, 0, 0, 0.2) !important;
          filter: drop-shadow(0 12px 24px rgba(255, 0, 0, 0.2)) !important;
        }

        .contract-address-container:hover .bracket-left,
        .contract-address-container:hover .bracket-right {
          /* Enhanced black shadow on hover */
          text-shadow: 0 0 18px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.4),
            0 0 36px rgba(0, 0, 0, 0.3) !important;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.3)) !important;
        }

        .contract-address-container:hover, 
        .contract-address-container.hovered {
          transform: translateZ(0) translateY(-2px) scale(1.02);
        }

        .contract-address-container:active {
          transform: translateZ(0) translateY(-1px) scale(1.01);
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .address-text {
            font-size: clamp(0.6rem, 2vmin, 1rem);
            letter-spacing: 0.01em;
          }
          
          .bracket-left,
          .bracket-right {
            /* Still 2x bigger than address text on mobile */
            font-size: clamp(1.4rem, 4.4vmin, 2.2rem);
          }
          
          .contract-address-container {
            padding: clamp(3px, 0.8vh, 6px) clamp(4px, 1vw, 8px);
            max-width: 95vw;
            gap: 0;
          }
        }

        @media (max-width: 360px) {
          .address-text {
            font-size: clamp(0.55rem, 1.8vmin, 0.9rem);
          }
          
          .bracket-left,
          .bracket-right {
            /* Still 2x bigger than address text on very small screens */
            font-size: clamp(1.2rem, 4vmin, 2rem);
          }
          
          .contract-address-container {
            gap: 0;
          }
        }
      `}</style>
    </div>
  )
})

export default ContractAddress
