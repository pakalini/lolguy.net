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

  // Add autofire state tracking
  const [isAutofiring, setIsAutofiring] = useState(false)

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

  // Add effect to monitor autofire state
  useEffect(() => {
    const checkAutofireState = () => {
      const autofiring = (window as any).isAutofiring || false
      if (autofiring !== isAutofiring) {
        setIsAutofiring(autofiring)
      }
    }

    // Check autofire state every 100ms
    const interval = setInterval(checkAutofireState, 100)

    return () => clearInterval(interval)
  }, [isAutofiring])

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

  // Apply autofire class conditionally to the main container
  return (
    <main className={`viewport-container ${isDesktop ? "desktop-layout" : ""} ${isAutofiring ? "autofiring" : ""}`}>
      <meta name="app-version" content={version} hidden />

      {/* DynamicLineBackground is now rendered directly to body */}
      <DynamicLineBackground />

      <ImagePreloader version={version} />
      <SimpleSound />

      <div className="centered-content" ref={contentRef}>
        {/* Title - REMOVED rage classes */}
        <h1 className={`title ${showElements.title ? "entrance-visible" : "entrance-hidden"}`}>
          <Link
            href="https://knowyourmeme.com/memes/lol-guy"
            target="_blank"
            rel="noopener noreferrer"
            className="title-link"
          >
            LOL GUY
          </Link>
        </h1>

        {/* Face - REMOVED rage classes */}
        <div
          ref={faceContainerRef}
          className={`face-container ${showElements.face ? "entrance-visible" : "entrance-hidden"}`}
          style={{
            width: faceSize.width,
            height: faceSize.height,
          }}
        >
          <DynamicLolFace />
          <Suspense fallback={null}>{isHydrated && <TextParticlesMinimal />}</Suspense>
        </div>

        {/* Counter - REMOVED rage classes */}
        <div className={`counter-container ${showElements.counter ? "entrance-visible" : "entrance-hidden"}`}>
          <Suspense fallback={null}>{isHydrated && <SingleEventCounter />}</Suspense>
        </div>

        {/* Buttons - REMOVED rage classes */}
        <div className={`buttons-container ${showElements.buttons ? "entrance-visible" : "entrance-hidden"}`}>
          <BuyButton />
          <CopyButton />
        </div>

        {/* Social Links - REMOVED rage classes */}
        <div className={`social-links-container ${showElements.socials ? "entrance-visible" : "entrance-hidden"}`}>
          <SocialLinkMemeContest />
          <SocialLinkX />
          <SocialLinkTelegram />
          <SocialLinkChart />
        </div>
      </div>

      <style jsx>{`
        /* Entrance Animations - CALM IN REST MODE */
        .entrance-hidden {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          filter: blur(5px);
        }

        .entrance-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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
          /* NO screen shake in rest mode */
          animation: none;
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
