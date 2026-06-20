export interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  brandName: string
  items: NavItem[]
}

export default function Navbar({ brandName, items }: NavbarProps) {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-slate-200/50 dark:border-gray-800/50 transition-colors duration-500 pr-16">
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* 左侧：品牌名 */}
        <a
          href="#hero"
          className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          {brandName}
        </a>

        {/* 右侧：导航链接 */}
        <ul className="flex items-center gap-3 sm:gap-6">
          {items.map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
