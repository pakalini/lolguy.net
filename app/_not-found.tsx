import type { Metadata, Viewport } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found - LOL Guy",
  description: "The page you're looking for doesn't exist.",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-white">
      <h1 className="text-4xl font-bold mb-4 font-sketch text-black">404 - Page Not Found</h1>
      <p className="mb-8 text-lg text-black">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-sketch border border-black"
      >
        Return Home
      </Link>
    </div>
  )
}
