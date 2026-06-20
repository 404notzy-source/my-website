import { useState } from 'react'

const PHOTO_URL = 'https://picsum.photos/seed/portrait/400/400'
const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Ccircle cx=%22100%22 cy=%2285%22 r=%2240%22 fill=%22%23cbd5e1%22/%3E%3Ccircle cx=%22100%22 cy=%22155%22 r=%2260%22 fill=%22%23cbd5e1%22/%3E%3C/svg%3E'

export default function AboutSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gray-950 transition-colors duration-700"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-500">
          关于我
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400 transition-colors duration-500">
          做一个在时间洪流里雕刻风格的人
        </p>

        {/* 双栏：照片 + 联系方式 */}
        <div className="mt-12 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* 左侧：照片 */}
          <div className="shrink-0">
            <img
              src={imgError ? PLACEHOLDER : PHOTO_URL}
              alt="个人照片"
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-48 h-48 rounded-full object-cover border-4 border-slate-200 dark:border-gray-700 transition-colors duration-500"
            />
          </div>

          {/* 右侧：联系方式 */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
              联系方式
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white tracking-wide transition-colors duration-500">
              13302020278
            </p>

            {/* 品牌标签 */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="inline-block px-6 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-sm font-medium transition-colors duration-500">
                大超潮牌店
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
