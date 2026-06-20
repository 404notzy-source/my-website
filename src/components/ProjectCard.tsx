import { useState } from 'react'
import type { Project } from '../data/projects'

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%22300%22 y=%22210%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2224%22%3E暂无图片%3C/text%3E%3C/svg%3E'

export default function ProjectCard({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article className="group rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-gray-950/50">
      {/* 项目图片 */}
      <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-gray-800">
        <img
          src={imgError ? PLACEHOLDER : project.imageUrl}
          alt={project.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* 内容区 */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
          {project.name}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
          {project.description}
        </p>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
        >
          查看详情
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H17.25M17.25 6L17.25 9.75M17.25 6L7 16.5"
            />
          </svg>
        </a>
      </div>
    </article>
  )
}
