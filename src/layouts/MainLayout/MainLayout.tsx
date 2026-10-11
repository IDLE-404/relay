import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from './components/Footer'
import styles from './MainLayout.module.css'

const MainLayout = () => {
  const { pathname } = useLocation()

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      {/* Full footer with the CTA band on the landing; compact everywhere else. */}
      <Footer compact={pathname !== '/'} />
    </div>
  )
}

export default MainLayout
