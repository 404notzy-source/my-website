import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'

export default function ProjectSection() {
  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-700"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section 标题 */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-500">
          精选好物
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-400 transition-colors duration-500">
          潮流单品，品质之选——不随波逐流，只做风格雕刻者
        </p>

        {/* 空态 */}
        {projects.length === 0 ? (
          <p className="mt-16 text-center text-gray-400 dark:text-gray-500">
            暂无产品展示
          </p>
        ) : (
          /* 响应式卡片网格 */
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
