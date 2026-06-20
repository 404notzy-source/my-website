import { Suspense, lazy } from 'react'

const HeroParticles = lazy(() => import('./HeroParticles'))

interface HeroProps {
  name: string
  title: string
  tagline: string
  ctaText: string
  ctaHref: string
}

export default function Hero({ name, title, tagline, ctaText, ctaHref }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-gray-950 transition-colors duration-700" style={{ minHeight: '100dvh' }}>
      {/* 渐变背景层 —— 半透明装饰 */}
      <div
        className="hero-gradient-bg absolute inset-0 -z-10 opacity-40 dark:opacity-30 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Canvas 粒子层 */}
      <Suspense fallback={null}>
        <HeroParticles />
      </Suspense>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4" style={{ minHeight: '100dvh' }}>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white text-center transition-colors duration-700">
          {name}
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent text-center transition-all duration-700">
          {title}
        </h2>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-prose transition-colors duration-700">
          {tagline}
        </p>

        <a
          href={ctaHref}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-8 py-3 text-base font-medium text-blue-600 dark:text-blue-400 dark:border-purple-500/30 dark:bg-purple-500/10 transition-all duration-700 hover:bg-blue-500/20 hover:border-blue-500/50 dark:hover:bg-purple-500/20 dark:hover:border-purple-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {ctaText}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
