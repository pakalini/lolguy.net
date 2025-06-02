"use client"

import { useState } from "react"
// Removed ExternalLink import as it's no longer used
// import { ExternalLink } from 'lucide-react'

const TOKEN_ADDRESS = "53Xy4g1RJnGR6saaJRDNoo1rYTGZ3W5U321EDdSa5BGD"

export default function BuyButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <a
      href={`https://jup.ag/swap/USDC-${TOKEN_ADDRESS}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`buy-button ${isHovered ? "hovered" : ""} ${isClicked ? "button-pulse-active" : ""} zero-gravity-sync-primary`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 300)
      }}
    >
      <span className="buy-text">BUY $LOL</span>
      {/* Removed the icon-wrapper and ExternalLink */}

      <style jsx>{`
        .buy-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          color: black;
          padding: 0; /* Added horizontal padding for brackets */
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-orbitron), monospace;
          font-size: clamp(0.9rem, 3.5vmin, 2rem);
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
          -webkit-text-stroke: 0.5px #000000;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          filter: none;
          word-break: keep-all;
          white-space: nowrap;
          text-align: center;
          line-height: 1.2;
          min-width: auto;
          animation: peaceful-bob 7.1s ease-in-out infinite alternate;
        }

        .buy-text {
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
          color: #000000;
          -webkit-text-stroke: 0.5px rgb(0, 0, 0);
          /* Equalized shadow - no glow */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
        }

        /* Removed icon-wrapper styles as the icon is removed */

        .buy-button:hover .buy-text {
          /* Equalized hover shadow - no glow */
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
        }

        .buy-button:hover, .buy-button.hovered {
          color: #333;
          transform: translateZ(0) translateY(-3px) scale(1.05);
        }

        .buy-button:active {
          transform: translateZ(0) translateY(-1px) scale(1.02);
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

        @keyframes peaceful-bob {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </a>
  )
}
