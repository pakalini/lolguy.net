"use client"

import { useState, memo } from "react"

const SocialLinkChart = memo(function SocialLinkChart() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  return (
    <a
      href="https://dexscreener.com/solana/hnmnnj7uvx988rwxjkk8ggwaqsi3e1nueecab763dqys"
      target="_blank"
      rel="noopener noreferrer"
      className={`social-link-button ${isHovered ? "hovered" : ""} ${isClicked ? "button-pulse-active" : ""} zero-gravity-sync-micro`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <span className="social-text">CHART</span>

      <style jsx>{`
        .social-link-button {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: transparent;
          color: #000000 !important;
          padding: 0; /* Added horizontal padding for brackets */
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-orbitron), monospace;
          font-size: clamp(1.458rem, 5.67vmin, 3.24rem);
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
          animation: calm-sway 6.7s ease-in-out infinite alternate-reverse; /* Individual animation */
        }

        .social-text {
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
          color: #000000 !important;
          -webkit-text-stroke: 0.5px #000000 !important;
          /* Equalized shadow - no glow */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
        }

        .social-link-button:hover .social-text {
          /* Equalized hover shadow - no glow */
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
        }

        .social-link-button:hover, .social-link-button.hovered {
          color: #333 !important;
          transform: translateZ(0) translateY(-3px) scale(1.05);
        }

        .social-link-button:active {
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

        @keyframes calm-sway {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(3px);
          }
        }
      `}</style>
    </a>
  )
})

export default SocialLinkChart
