import { useEffect } from 'react'
import { AzosLogo } from './AzosLogo.jsx'
import { SCENARIOS } from './scenarios.js'

export function Topbar({ current = null, onNavigate, onSignOut, mode, onSwitchMode }) {
  useEffect(() => {
    const tab = document.querySelector('.tabs [aria-current="page"]')
    const scroller = tab?.parentElement
    if (!tab || !scroller) return
    const start = tab.offsetLeft
    const end = start + tab.offsetWidth
    if (start < scroller.scrollLeft) scroller.scrollLeft = start
    else if (end > scroller.scrollLeft + scroller.clientWidth) {
      scroller.scrollLeft = end - scroller.clientWidth
    }
  }, [current, mode])
  const logo = (
    <>
      <AzosLogo className="brand-logo" />
      <span>Laboratório do agente de corretores</span>
    </>
  )

  return (
    <header className="topbar">
      <div className="topbar-in">
        {onNavigate ? (
          <button type="button" className="logo" onClick={() => onNavigate(null)}>
            {logo}
          </button>
        ) : (
          <div className="logo">{logo}</div>
        )}
        {onNavigate ? (
          <nav className="tabs" aria-label="Cenários">
            <button
              type="button"
              className="home-link"
              aria-current={current ? undefined : 'page'}
              onClick={() => onNavigate(null)}
            >
              Início
            </button>
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={current === item.id ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
              >
                {item.tab} · {item.name}
              </button>
            ))}
          </nav>
        ) : null}
        {onSwitchMode ? (
          <button type="button" className="top-switch" onClick={onSwitchMode}>
            {mode === 'voice' ? 'Conversar por texto' : 'Falar por voz'}
          </button>
        ) : null}
        {onSignOut ? (
          <button type="button" className="top-exit" onClick={onSignOut}>
            Sair
          </button>
        ) : null}
      </div>
    </header>
  )
}
