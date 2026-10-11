import { createBrowserRouter, Navigate } from 'react-router-dom'
import RequireAuth from '@/components/RequireAuth'
import MainLayout from '@/layouts/MainLayout'
import ConsolePage from '@/pages/console/ConsolePage'
import HomePage from '@/pages/home/HomePage'
import SignInPage from '@/pages/signin/SignInPage'

// The app is served from a sub-path on GitHub Pages (vite `base`), so routes use it as basename.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: 'console',
          element: (
            <RequireAuth>
              <ConsolePage />
            </RequireAuth>
          ),
        },
      ],
    },
    // Own layout: no site header or footer on the sign-in screen.
    { path: '/signin', element: <SignInPage /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  { basename },
)
