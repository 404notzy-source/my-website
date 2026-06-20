import { ThemeProvider, useTheme } from './components/ThemeProvider'
import Navbar, { type NavItem } from './components/Navbar'
import Hero from './components/Hero'
import ProjectSection from './components/ProjectSection'
import AboutSection from './components/AboutSection'

const NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '#hero' },
  { label: '项目', href: '#projects' },
  { label: '联系我', href: '#contact' },
]

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

function AppContent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-700">
      {/* 临时主题切换按钮——后续由独立 toggle 组件替代 */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-500"
        aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <Navbar brandName="大超潮牌店" items={NAV_ITEMS} />

      <Hero
        name="大超潮牌店"
        title="老子实干家"
        tagline="不随波逐流，只做时间洪流里的风格雕刻者。"
        ctaText="查看我的项目"
        ctaHref="#projects"
      />

      <ProjectSection />

      <AboutSection />
    </div>
  )
}

export default App
