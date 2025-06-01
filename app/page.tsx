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
        <h1 className={`title rage-violent glitch-text ${showElements.title ? "entrance-visible" : "entrance-hidden"}`}>
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
          className={`face-container rage-chaotic color-strobe ${
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
          className={`counter-container rage-manic screen-shake ${
            showElements.counter ? "entrance-visible" : "entrance-hidden"
          }`}
        >
          <Suspense fallback={null}>{isHydrated && <SingleEventCounter />}</Suspense>
        </div>

        {/* Buttons - Updated layout for single row */}
        <div
          className={`buttons-container rage-insane ${showElements.buttons ? "entrance-visible" : "entrance-hidden"}`}
        >
          <BuyButton />
          <CopyButton />
        </div>

        {/* Social Links - Updated with meme contest link */}
        <div
          className={`social-links-container rage-berserk ${showElements.socials ? "entrance-visible" : "entrance-hidden"}`}
        >
          <SocialLinkMemeContest />
          <SocialLinkX />
          <SocialLinkTelegram />
          <SocialLinkChart />
        </div>
      </div>

      <style jsx>{`
        /* AGGRESSIVE RAGE ANIMATIONS - NO MORE PEACEFUL FLOATING */
        @keyframes rage-shake-violent {
          0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          5% { transform: translate3d(-8px, 12px, 0) rotate(-2.5deg) scale(1.02); }
          10% { transform: translate3d(15px, -6px, 0) rotate(1.8deg) scale(0.98); }
          15% { transform: translate3d(-12px, -9px, 0) rotate(-1.2deg) scale(1.03); }
          20% { transform: translate3d(9px, 14px, 0) rotate(2.1deg) scale(0.97); }
          25% { transform: translate3d(-16px, 3px, 0) rotate(-2.8deg) scale(1.01); }
          30% { transform: translate3d(11px, -11px, 0) rotate(1.5deg) scale(1.04); }
          35% { transform: translate3d(-7px, 8px, 0) rotate(-1.9deg) scale(0.96); }
          40% { transform: translate3d(13px, -4px, 0) rotate(2.3deg) scale(1.02); }
          45% { transform: translate3d(-10px, 16px, 0) rotate(-1.6deg) scale(0.99); }
          50% { transform: translate3d(14px, -8px, 0) rotate(2.7deg) scale(1.03); }
          55% { transform: translate3d(-9px, 5px, 0) rotate(-2.2deg) scale(0.98); }
          60% { transform: translate3d(12px, -13px, 0) rotate(1.4deg) scale(1.01); }
          65% { transform: translate3d(-15px, 7px, 0) rotate(-2.6deg) scale(1.04); }
          70% { transform: translate3d(8px, 10px, 0) rotate(1.7deg) scale(0.97); }
          75% { transform: translate3d(-11px, -5px, 0) rotate(-1.3deg) scale(1.02); }
          80% { transform: translate3d(16px, 9px, 0) rotate(2.4deg) scale(0.99); }
          85% { transform: translate3d(-6px, -12px, 0) rotate(-2.9deg) scale(1.03); }
          90% { transform: translate3d(10px, 15px, 0) rotate(1.1deg) scale(0.96); }
          95% { transform: translate3d(-13px, -2px, 0) rotate(-1.8deg) scale(1.01); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
        }

        /* Entrance Animations with RAGE */
        .entrance-hidden {
          opacity: 0;
          transform: translateY(50px) scale(0.8) rotate(-10deg);
          filter: blur(15px) hue-rotate(180deg);
        }

        .entrance-visible {
          opacity: 1;
          transform: translateY(0) scale(1) rotate(0deg);
          filter: blur(0px) hue-rotate(0deg);
          transition: all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* Enhanced RAGE Effects */
        .title {
          font-family: var(--font-orbitron), monospace;
          font-size: clamp(0.96rem, 3.2vmin, 2rem);
          font-weight: 900;
          -webkit-text-stroke: 2px #000000;
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
          backface-visibility: hidden;
          transform: translateZ(0);
          /* AGGRESSIVE shadow effects */
          text-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 8px 16px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(255, 255, 0, 0.4), 0 0 60px rgba(0, 255, 0, 0.3);
          filter: drop-shadow(0 16px 32px rgba(255, 0, 0, 0.4)) contrast(1.5) saturate(2);
          transition: all 0.3s ease;
        }

        .title-link:hover {
          color: #ff0000;
          text-shadow: 0 0 30px rgba(255, 0, 0, 1), 0 12px 24px rgba(0, 0, 0, 0.8),
            0 0 60px rgba(255, 255, 0, 0.6), 0 0 80px rgba(0, 255, 0, 0.5);
          filter: drop-shadow(0 24px 48px rgba(255, 0, 0, 0.6)) contrast(2) saturate(3);
          transform: translateY(-4px) scale(1.1);
        }

        .face-container {
          position: relative;
          transition: width 0.3s ease, height 0.3s ease, filter 0.3s ease, transform 0.3s ease;
          background-color: transparent !important;
          will-change: transform;
          contain: layout size style;
          flex-shrink: 0;
          backface-visibility: hidden;
          transform: translateZ(0);
          /* AGGRESSIVE shadow effects with color cycling */
          filter: drop-shadow(0 8px 16px rgba(255, 0, 0, 0.6)) 
                  drop-shadow(0 4px 8px rgba(0, 255, 0, 0.4))
                  drop-shadow(0 12px 24px rgba(0, 0, 255, 0.3))
                  contrast(1.8) saturate(2.5);
        }

        .face-container:hover {
          filter: drop-shadow(0 16px 32px rgba(255, 0, 0, 0.8)) 
                  drop-shadow(0 8px 16px rgba(0, 255, 0, 0.6))
                  drop-shadow(0 24px 48px rgba(0, 0, 255, 0.5))
                  contrast(2.2) saturate(3);
          transform: translateZ(0) scale(1.05) rotate(2deg);
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
          backface-visibility: hidden;
          transform: translateZ(0);
          filter: contrast(1.6) saturate(2) brightness(1.2);
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
          backface-visibility: hidden;
          transform: translateZ(0);
          filter: contrast(1.4) saturate(1.8);
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
          backface-visibility: hidden;
          transform: translateZ(0);
          filter: contrast(1.7) saturate(2.2) brightness(1.1);
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
          /* Add subtle screen shake to entire viewport */
          animation: screen-shake 0.1s infinite;
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
