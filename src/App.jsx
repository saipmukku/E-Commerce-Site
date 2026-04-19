import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreLayout } from './components/layout/store-layout'
import { StoreProvider } from './context/store-context'
import { AccountPage } from './pages/account-page'
import { CartPage } from './pages/cart-page'
import { HomePage } from './pages/home-page'
import { SearchPage } from './pages/search-page'
import { ShopPage } from './pages/shop-page'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
