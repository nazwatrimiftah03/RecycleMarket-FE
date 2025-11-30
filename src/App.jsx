import { RouterProvider } from 'react-router'
import { router } from './utils/routes'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProductProvider } from './contexts/ProductContext.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </AuthProvider>
  )
}
