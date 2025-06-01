"use client"

import { useState, useEffect, useRef, lazy, Suspense } from "react"
import Link from "next/link"
import DynamicLolFace from "@/components/dynamic-lol-face"
import ImagePreloader from "@/components/image-preloader"
import BuyButton from "@/components/buy-button"
import SimpleSound from "@/components/simple-sound"
import CopyButton from "@/components/copy-button"
import DynamicLineBackground from "@/components/dynamic-line-background"
import SocialLinkMemeContest from "@/components/social-link-meme-contest"
import SocialLinkX from "@/components/social-link-x"
import SocialLinkTelegram from "@/components/social-link-telegram"
import SocialLinkChart from "@/components/social-link-chart"

// Lazy load non-critical components - UPDATED to use minimal component
const TextParticlesMinimal = lazy(() => import("@/components/text-particles-minimal"))
const SingleEventCounter = lazy(() => import("@/components/single-event-counter"))

// Token address
const TOKEN_ADDRESS = "53Xy4g1RJnGR6saaJRDNoo1rYTGZ3W5U321EDdSa5BGD"

export default function Home() {
  // Component state
  const [isMounted, setIsMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [version] = useState(() => "1.0.0")
  const [showElements, setShowElements] = useState({
    title: false,
    face: false,
    counter: false,
    buttons: false,
    socials: false,
  })

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const faceContainerRef = useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialSizeSetRef = useRef<boolean>(false)
  const audioInitializedRef = useRef<boolean>(false)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  // Initialize audio on page load
  useEffect(() => {
    if (audioInitializedRef.current) return
    audioInitializedRef.current = true

    // Create and play a silent audio to initialize audio context
    const initAudio = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          const silentContext = new AudioContextClass()
          if (silentContext.state === "suspended") {
            silentContext.resume().catch((e) => console.error("Failed to resume silent context:", e))
          }

          const oscillator = silentContext.createOscillator()
          const gain = silentContext.createGain()
          gain.gain.value = 0.001
          oscillator.connect(gain)
          gain.connect(silentContext.destination)

          oscillator.start()
          setTimeout(() => {
            oscillator.stop()
          }, 1)
        }
      } catch (e) {
        console.error("Error initializing silent audio:", e)
      }
    }

    const initOnInteraction = () => {
      initAudio()
      window.removeEventListener("mousedown", initOnInteraction)
      window.removeEventListener("touchstart", initOnInteraction)
      window.removeEventListener("keydown", initOnInteraction)
    }

    initAudio()

    window.addEventListener("mousedown", initOnInteraction, { once: true })
    window.addEventListener("touchstart", initOnInteraction, { once: true })
    window.addEventListener("keydown", initOnInteraction, { once: true })

    return () => {
      window.removeEventListener("mousedown", initOnInteraction)
      window.removeEventListener("touchstart", initOnInteraction)
      window.removeEventListener("keydown", initOnInteraction)
    }
  }, [])

  // Optimize viewport dimension updates with debounce
  const updateViewportDimensions = () => {
    cancelAnimationFrame(
      requestAnimationFrame(() => {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current)
        }

        resizeTimeoutRef.current = setTimeout(() => {
          const vw = window.innerWidth
          const vh = window.innerHeight

          if (vw !== viewportWidth || vh !== viewportHeight) {
            setViewportWidth(vw)
            setViewportHeight(vh)
            setIsLandscape(vw > vh)
            setIsDesktop(vw >= 1024)
          }
        }, 100)
      }),
    )
  }

  // Initialize component with optimized handler
  useEffect(() => {
    setIsMounted(true)

    const vw = window.innerWidth
    const vh = window.innerHeight
    setViewportWidth(vw)
    setViewportHeight(vh)
    setIsLandscape(vw > vh)
    setIsDesktop(vw >= 1024)
    initialSizeSetRef.current = true

    requestAnimationFrame(() => {
      setIsHydrated(true)
    })

    window.addEventListener("resize", updateViewportDimensions, { passive: true })
    window.addEventListener("orientationchange", updateViewportDimensions, { passive: true })

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      window.removeEventListener("resize", updateViewportDimensions)
      window.removeEventListener("orientationchange", updateViewportDimensions)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Stagger entrance animations
    const timeouts = [
      setTimeout(() => setShowElements((prev) => ({ ...prev, title: true })), 200),
      setTimeout(() => setShowElements((prev) => ({ ...prev, face: true })), 400),
      setTimeout(() => setShowElements((prev) => ({ ...prev, counter: true })), 800),
      setTimeout(() => setShowElements((prev) => ({ ...prev, buttons: true })), 1000),
      setTimeout(() => setShowElements((prev) => ({ ...prev, socials: true })), 1200),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [isHydrated])

  // Memoized face size calculation
  const calculateFaceSize = () => {
    if (!isMounted || !initialSizeSetRef.current) return { width: "50vmin", height: "50vmin" }

    const baseDimension = Math.min(viewportWidth, viewportHeight)

    let sizeFactor = 0.45
    if (isDesktop) {
      sizeFactor = 0.28
    } else if (isLandscape) {
      sizeFactor = 0.32
    }

    const size = Math.max(150, baseDimension * sizeFactor)

    return {
      width: `${size}px`,
      height: `${size}px`,
    }
  }

  const faceSize = calculateFaceSize()

  if (!isMounted) {
    return null
  }

  return (
    <main className={`viewport-container ${isDesktop ? "desktop-layout" : ""}`}>
      <meta name="app-version" content={version} hidden />

      {/* DynamicLineBackground is now rendered directly to body */}
      <DynamicLineBackground />

      <ImagePreloader version={version} />
      <SimpleSound />

      <div className="centered-content" ref={contentRef}>
        {/* Title */}
        <h1
          className={`title zero-gravity-sync-primary ${showElements.title ? "entrance-visible" : "entrance-hidden"}`}
        >
          <Link
            href="https://knowyourmeme.com/memes/lol-guy"
            target="_blank"
            rel="noopener noreferrer"
            className="title-link"
          >
            LOL Guy
          </Link>
        </h1>

        {/* Face */}
        <div
          ref={faceContainerRef}
          className={`face-container zero-gravity-sync-secondary ${
            showElements.face ? "entrance-visible" : "entrance-hidden"
          }`}
          style={{
            width: faceSize.width,
            height: faceSize.height,
          }}
        >
          <DynamicLolFace />
          <Suspense fallback={null}>{isHydrated && <TextParticlesMinimal />}</Suspense>
        </div>

        {/* Counter */}
        <div
          className={`counter-container zero-gravity-sync-quaternary ${
            showElements.counter ? "entrance-visible" : "entrance-hidden"
          }`}
        >
          <Suspense fallback={null}>{isHydrated && <SingleEventCounter />}</Suspense>
        </div>

        {/* Buttons - Updated layout for single row */}
        <div
          className={`buttons-container zero-gravity-sync-primary-delayed ${
            showElements.buttons ? "entrance-visible" : "entrance-hidden"
          }`}
        >
          <BuyButton />
          <CopyButton />
        </div>

        {/* Social Links - Updated with meme contest link */}
        <div className={`social-links-container ${showElements.socials ? "entrance-visible" : "entrance-hidden"}`}>
          <SocialLinkMemeContest />
          <SocialLinkX />
          <SocialLinkTelegram />
          <SocialLinkChart />
        </div>
      </div>

      <style jsx>{`
        /* Define the keyframes directly in the component */
        @keyframes float-sync-primary {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(4px, -3px, 0) rotate(0.8deg);
          }
          50% {
            transform: translate3d(-3px, 5px, 0) rotate(-0.6deg);
          }
          75% {
            transform: translate3d(-5px, -2px, 0) rotate(0.4deg);
          }
        }

        @keyframes float-sync-secondary {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(-3px, 4px, 0) rotate(-0.6deg);
          }
          50% {
            transform: translate3d(5px, -2px, 0) rotate(0.8deg);
          }
          75% {
            transform: translate3d(2px, 3px, 0) rotate(-0.4deg);
          }
        }

        @keyframes float-sync-tertiary {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(2px, -4px, 0) rotate(0.5deg);
          }
          50% {
            transform: translate3d(-4px, 2px, 0) rotate(-0.7deg);
          }
          75% {
            transform: translate3d(3px, -1px, 0) rotate(0.3deg);
          }
        }

        @keyframes float-sync-quaternary {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(-2px, 3px, 0) rotate(-0.4deg);
          }
          50% {
            transform: translate3d(3px, -4px, 0) rotate(0.6deg);
          }
          75% {
            transform: translate3d(-4px, 1px, 0) rotate(-0.2deg);
          }
        }

        @keyframes float-sync-micro {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          25% {
            transform: translate3d(1px, -2px, 0) rotate(0.2deg);
          }
          50% {
            transform: translate3d(-2px, 1px, 0) rotate(-0.3deg);
          }
          75% {
            transform: translate3d(2px, -1px, 0) rotate(0.1deg);
          }
        }

        /* Entrance Animations */
        .entrance-hidden {
          opacity: 0;
          transform: translateY(30px) scale(0.9);
          filter: blur(10px);
        }

        .entrance-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced Glow Effects */
        .title {
          font-family: var(--font-orbitron), monospace;
          font-size: clamp(0.96rem, 3.2vmin, 2rem);
          font-weight: 900;
          -webkit-text-stroke: 1px #000000;
          letter-spacing: 0.5px;
          color: #000000;
          margin: 0;
          will-change: transform;
          -webkit-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          line-height: 1.2;
          text-align: center;
          flex-shrink: 0;
          animation: float-sync-primary 20s ease-in-out infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
          /* Enhanced glow and shadow */
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(255, 255, 255, 0.1);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
          transition: all 0.3s ease;
        }

        .title-link:hover {
          color: #333;
          text-shadow: 0 0 15px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(255, 255, 255, 0.2);
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.2));
          transform: translateY(-2px);
        }

        .face-container {
          position: relative;
          transition: width 0.3s ease, height 0.3s ease, filter 0.3s ease, transform 0.3s ease;
          background-color: transparent !important;
          will-change: transform;
          contain: layout size style;
          flex-shrink: 0;
          animation: float-sync-secondary 20s ease-in-out infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
          /* Add subtle black shadow around LOL face - increased by another 10% (total 21% increase) */
          filter: drop-shadow(0 4.84px 9.68px rgba(0, 0, 0, 0.2)) drop-shadow(0 2.42px 4.84px rgba(0, 0, 0, 0.1));
        }

        .face-container:hover {
          filter: drop-shadow(0 7.26px 14.52px rgba(0, 0, 0, 0.25)) drop-shadow(0 3.63px 7.26px rgba(0, 0, 0, 0.15));
          transform: translateZ(0) scale(1.02);
        }

        .counter-container {
          margin: 0;
          background-color: transparent !important;
          will-change: transform;
          min-height: clamp(1.5rem, 3vh, 3rem);
          contain: layout size style;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float-sync-quaternary 20s ease-in-out infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
          filter: none;
          transition: filter 0.3s ease;
        }

        .buttons-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 3vw, 24px);
          margin: 0;
          background-color: transparent !important;
          will-change: transform;
          flex-wrap: nowrap;
          width: 100%;
          max-width: min(90vw, 500px);
          padding: 0 clamp(4px, 1vw, 8px);
          flex-shrink: 0;
          animation: float-sync-primary 20s ease-in-out infinite;
          animation-delay: -5s;
          backface-visibility: hidden;
          transform: translateZ(0);
          filter: none;
          transition: filter 0.3s ease;
        }

        .social-links-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(0.594vh, 0.99vh, 1.485vh);
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          width: 100%;
          max-width: 95vw;
          flex-shrink: 0;
          will-change: transform;
          animation: float-sync-micro 20s ease-in-out infinite;
          backface-visibility: hidden;
          transform: translateZ(0);
          filter: none;
          transition: filter 0.3s ease;
        }

        .viewport-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background-color: var(--background-grey) !important;
          padding: 0;
          margin: 0;
          position: relative;
          contain: layout size style;
          -webkit-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          z-index: 1;
        }

        .centered-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          max-height: 100vh;
          max-height: 100dvh;
          padding: 0;
          box-sizing: border-box;
          gap: clamp(0.9vh, 1.8vh, 2.7vh);
          background-color: transparent !important;
          contain: layout style;
          position: relative;
          z-index: 10;
        }

        /* Very narrow screens */
        @media (max-width: 360px) {
          .buttons-container {
            gap: clamp(8px, 2vw, 16px);
            flex-direction: column;
          }
          
          .centered-content {
            gap: clamp(0.7vh, 1.4vh, 2.1vh);
          }
        }

        /* Ultra-narrow screens (like folded phones) */
        @media (max-width: 280px) {
          .title {
            font-size: clamp(1rem, 3.5vmin, 2rem);
          }

          .buttons-container {
            flex-direction: column;
          }
          
          .centered-content {
            gap: clamp(0.6vh, 1.2vh, 1.8vh);
          }
        }

        /* Ultra-wide screens */
        @media (min-width: 1600px) {
          .centered-content {
            max-width: 1400px;
          }
        }
      `}</style>
    </main>
  )
}
