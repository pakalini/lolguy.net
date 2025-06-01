"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

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
      <span className="buy-text">Buy $LOL</span>
      <span className="icon-wrapper">
        <ExternalLink size={14} strokeWidth={4} stroke="#ff0000" />
      </span>

      <style jsx>{`
        .buy-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          color: black;
          padding: 0;
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
        }

        .buy-text {
          font-weight: 900;
          font-size: clamp(1.2rem, 4vmin, 2.5rem);
          letter-spacing: 0.05em;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          position: relative;
          z-index: 2;
          color: #000000;
          -webkit-text-stroke: 1px #000000;
          /* Enhanced shadow depth like LOL Guy title */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(255, 255, 255, 0.1);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
        }

        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          transition: all 0.3s ease !important;
        }

        .icon-wrapper svg {
          color: #ff0000 !important;
          stroke: #ff0000 !important;
          fill: none !important;
          stroke-width: 6 !important;
          width: 14px !important;
          height: 14px !important;
          display: block !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
        }

        /* Force stroke width with maximum specificity */
        .buy-button .icon-wrapper svg,
        .buy-button .icon-wrapper svg * {
          stroke-width: 6 !important;
          stroke: #ff0000 !important;
        }

        .buy-button:hover .icon-wrapper {
        }

        .buy-button:hover .buy-text {
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(255, 255, 255, 0.2);
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
      `}</style>
    </a>
  )
}
