"use client"

import { useState, memo } from "react"

const SocialLinkMemeContest = memo(function SocialLinkMemeContest() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
  }

  return (
    <a
      href="https://x.com/lolguysolana"
      target="_blank"
      rel="noopener noreferrer"
      className={`social-link-button meme-contest-link ${isHovered ? "hovered" : ""} ${isClicked ? "button-pulse-active" : ""} zero-gravity-sync-quaternary`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <span className="social-text meme-contest-text">ENTER MEME CONTEST</span>

      <style jsx>{`
        .social-link-button.meme-contest-link {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: transparent;
          color: #000000 !important; /* Changed to black */
          padding: 0;
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
          animation: peaceful-bob 7.2s ease-in-out infinite alternate; /* Individual animation */
        }

        .social-text.meme-contest-text {
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
          color: #000000 !important; /* Changed to black */
          -webkit-text-stroke: 0.5px #000000 !important; /* Changed to black */
          /* Equalized shadow - no glow */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
          text-decoration: underline;
          text-decoration-color: black;
          text-decoration-thickness: 5px; /* Adjusted thickness (10% thinner than 6px) */
          text-underline-offset: 3px; /* Adjusted offset for better balance */
        }

        /* Force black color with maximum specificity */
        .social-link-button.meme-contest-link .social-text.meme-contest-text,
        .social-link-button.meme-contest-link:hover .social-text.meme-contest-text,
        .social-link-button.meme-contest-link:active .social-text.meme-contest-text,
        .social-link-button.meme-contest-link:focus .social-text.meme-contest-text {
          color: #000000 !important; /* Changed to black */
          -webkit-text-stroke: 0.5px #000000 !important; /* Changed to black */
        }

        .social-link-button.meme-contest-link:hover .social-text.meme-contest-text {
          /* Equalized hover shadow - no glow */
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3);
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
        }

        .social-link-button.meme-contest-link:hover, 
        .social-link-button.meme-contest-link.hovered {
          color: #333 !important; /* Keep consistent hover color for text */
          transform: translateZ(0) translateY(-3px) scale(1.05);
        }

        .social-link-button.meme-contest-link:active {
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
            transform: translateY(-5px);
          }
        }
      `}</style>
    </a>
  )
})

export default SocialLinkMemeContest
