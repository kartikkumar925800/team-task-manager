import React from "react"
import { AuthProvider } from "@/context/AuthContext"
import NextTopLoader from "nextjs-toploader"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear()

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        <NextTopLoader 
          color="#4f46e5"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #4f46e5,0 0 5px #4f46e5"
        />
        <AuthProvider>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 text-center">
              <div className="flex flex-col items-center gap-8">
                {/* Main Creator Attribution */}
                <div>
                  <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center gap-3">
                    Made with <span className="text-red-500 animate-pulse">❤️</span> by 
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      Kartik Kumar
                    </span>
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 font-medium italic">Full Stack Developer • Enterprise Task Management Solution</p>
                </div>
                
                {/* Clean Social/Portfolio Links */}
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
                  <a href="https://kartikkumar-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-all hover:scale-105">
                    <span className="text-lg">🌐</span> Portfolio
                  </a>
                  <a href="https://github.com/kartikkumar925800" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-all hover:scale-105">
                    <span className="text-lg">💻</span> GitHub
                  </a>
                  <a href="https://linkedin.com/in/kartikkumar925800" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-all hover:scale-105">
                    <span className="text-lg">👔</span> LinkedIn
                  </a>
                </div>

                {/* Simplified Copyright */}
                <div className="pt-8 border-t border-gray-100 w-full max-w-2xl">
                   <p className="text-xs font-medium text-gray-400">
                    &copy; {currentYear} TaskManager Pro. Developed for Professional Assessment.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}