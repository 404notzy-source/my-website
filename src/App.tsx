import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import HistoryPage from './pages/HistoryPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '商品', href: '/shop' },
  { label: '购物车', href: '/cart' },
  { label: '关于我', href: '#about' },
]

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar brandName="大超潮牌店" items={NAV_ITEMS} />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
