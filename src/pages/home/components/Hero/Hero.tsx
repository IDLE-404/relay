import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useI18n } from '@/shared/i18n/I18nContext'
import AppWindow from '@/pages/home/components/AppWindow'
import FlowCanvas from '@/components/FlowCanvas'
import HeroBackground from '../HeroBackground'
import { heroFlow } from './flow'
import styles from './Hero.module.css'

const Hero = () => {
  const { t } = useI18n()
  const [line, lead, accent] = t.landing.hero.title

  return (
    <section className={styles.hero}>
      <HeroBackground />

      <div className={styles.content}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          {t.landing.hero.badge}
        </span>
        <h1 className={styles.title}>
          {line}
          <br />
          {lead} <em>{accent}</em>
        </h1>
        <p className={styles.text}>{t.landing.hero.text}</p>
        <div className={styles.actions}>
          <Link to="/console" className={styles.primary}>
            {t.landing.hero.primary}
            <FiArrowRight />
          </Link>
          <a href="#how-it-works" className={styles.secondary}>
            {t.landing.hero.secondary}
          </a>
        </div>
      </div>

      <div className={styles.stage}>
        <AppWindow>
          <FlowCanvas flow={heroFlow} autoLoop />
        </AppWindow>
      </div>
    </section>
  )
}

export default Hero
