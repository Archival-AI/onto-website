// App.jsx — shell, menu, page swap, tweaks
import React, { useState } from 'react'
import { NAV } from './data'
import { useTweaks, TweaksPanel, TweakSection, TweakRadio } from './tweaks-panel'
import { Home, Portfolio, Blog, Manifesto, About, Contact, BEL } from './pages'
import ontoLogo from '../assets/onto-logo.png'
import iconOutline from '../assets/Icon-Outline-Black.png'

const TWEAK_DEFAULTS = {
  typeScale: 'default',
  logoTreatment: 'inline',
  trigger: 'hover',
  showProducts: true,
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)
  const [active, setActive] = useState('home')
  const [prev, setPrev] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const collapsed = active !== 'home' && !menuOpen

  const go = (id) => {
    const item = NAV.find(n => n.id === id)
    if (item && item.external) {
      window.open(item.external, '_blank', 'noopener')
      return
    }
    if (id === active) { setMenuOpen(false); return }
    setPrev(active)
    setActive(id)
    setMenuOpen(false)
    setTimeout(() => setPrev(null), 600)
  }

  const renderPage = (id) => {
    switch (id) {
      case 'home':      return <Home tweaks={t} />
      case 'bel':       return <BEL />
      case 'portfolio': return <Portfolio />
      case 'blog':      return <Blog />
      case 'manifesto': return <Manifesto />
      case 'about':     return <About />
      case 'contact':   return <Contact />
      default:          return null
    }
  }

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <nav
        className="menu"
        onMouseEnter={() => active !== 'home' && setMenuOpen(true)}
        onMouseLeave={() => active !== 'home' && setMenuOpen(false)}
      >
        {/* Collapsed strip — shown on inner pages when menu is closed */}
        <div className="collapsed-stack" role="button" aria-label="Open menu">
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <img src={iconOutline} alt="menu icon" style={{width:50,height:'auto',display:'block',marginBottom:4}} />
            <span className="lbl">Menu</span>
          </div>
        </div>

        {/* Full nav list */}
        <ol>
          {NAV.map(n => {
            const isLogo = n.id === 'home'
            return (
              <li key={n.id}>
                <button
                  className={`nav-item ${isLogo ? 'nav-logo' : ''} ${active === n.id ? 'active' : ''}`}
                  onClick={() => go(n.id)}
                  title={n.label}
                >
                  {isLogo
                    ? <img src={ontoLogo} alt="onto" />
                    : <span className="name">{n.label.toUpperCase()}</span>}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="foot">
          <div className="socials">
            <a href="https://www.linkedin.com/company/onto-fi/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.34 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.56V8z"/>
              </svg>
            </a>
            {/* 
            <a href="https://github.com/Archival-AI" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.07c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.75.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.35.78 1.05.78 2.13v3.16c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
              </svg>
            </a>*/}
          </div>
          <div className="copy">© 2026 Dasein AI Oy</div>
        </div>
      </nav>

      <main className="stage">
        {prev && prev !== active && (
          <div className="page-slot out" key={`prev-${prev}`}>
            {renderPage(prev)}
          </div>
        )}
        <div className="page-slot in" key={`cur-${active}`}>
          {renderPage(active)}
        </div>
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Home — typography" />
        <TweakRadio label="Type scale" value={t.typeScale}
          options={['quiet', 'default', 'monumental']}
          onChange={v => setTweak('typeScale', v)} />
        <TweakSection label="Home — logo treatment" />
        <TweakRadio label="Layout" value={t.logoTreatment}
          options={['inline', 'stacked', 'mark']}
          onChange={v => setTweak('logoTreatment', v)} />
        <TweakSection label="Word morph" />
        <TweakRadio label="Trigger" value={t.trigger}
          options={['hover', 'auto', 'click']}
          onChange={v => setTweak('trigger', v)} />
      </TweaksPanel>
    </div>
  )
}
