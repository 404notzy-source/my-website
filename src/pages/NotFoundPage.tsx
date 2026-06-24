import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-700">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          页面不存在
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-8 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
