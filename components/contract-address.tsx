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
      <span className="address-text">{TOKEN_ADDRESS}</span>

      <style jsx>{`
        .contract-address-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          color: black;
          padding: clamp(4px, 1vh, 8px) clamp(6px, 1.5vw, 12px);
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-orbitron), monospace;
          margin: 0;
          border: 4px solid #000000;
          position: relative;
          overflow: visible;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
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
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.05));
          /* Red border shadow */
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
        }

        .contract-address-container:hover .address-text {
          color: #ff0000 !important;
          /* Enhanced red shadow on hover */
          text-shadow: 0 0 15px rgba(255, 0, 0, 0.4), 0 6px 12px rgba(255, 0, 0, 0.3),
            0 0 30px rgba(255, 0, 0, 0.2) !important;
          filter: drop-shadow(0 12px 24px rgba(255, 0, 0, 0.2)) !important;
        }

        .contract-address-container:hover, 
        .contract-address-container.hovered {
          transform: translateZ(0) translateY(-2px) scale(1.02);
          border-color: #333333;
          /* Enhanced red shadow on hover */
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.6), 0 6px 16px rgba(0, 0, 0, 0.4), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(0, 0, 0, 0.2);
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
          
          .contract-address-container {
            padding: clamp(3px, 0.8vh, 6px) clamp(4px, 1vw, 8px);
            max-width: 95vw;
            gap: 6px;
            border-width: 3px;
          }
        }

        @media (max-width: 360px) {
          .address-text {
            font-size: clamp(0.55rem, 1.8vmin, 0.9rem);
          }
          
          .contract-address-container {
            gap: 4px;
            border-width: 2px;
          }
        }
      `}</style>
    </div>
  )
})

export default ContractAddress
