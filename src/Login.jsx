import { useEffect, useState } from 'react'
import { Topbar } from './Topbar.jsx'

export function Login({ error, loading, onSubmit }) {
  const [token, setToken] = useState('')
  const [localError, setLocalError] = useState('')
  const [unlockField, setUnlockField] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    const known = !hash || hash === 'inicio' || hash === 'g1' || hash === 'g2' || hash === 'g3'
    if (window.location.search || !known) {
      window.history.replaceState({}, '', `${window.location.pathname}${known && hash ? `#${hash}` : ''}`)
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const next = token.trim()
    if (!next) {
      setLocalError('Cole o token de acesso.')
      return
    }
    setLocalError('')
    onSubmit(next)
  }

  const message = localError || error

  return (
    <div className="site">
      <a className="skip-link" href="#entrar">
        Ir para o acesso
      </a>
      <Topbar />
      <section className="hero">
        <div className="hero-in">
          <h1>Entre para testar o agente dos corretores</h1>
          <p>Use o mesmo token da bancada de cobrança. Depois você escolhe um perfil e conversa com a Liz por voz.</p>
          <ul>
            <li>Dados fictícios</li>
            <li>Transcrição ao vivo</li>
            <li>Resultado ao final da conversa</li>
          </ul>
        </div>
      </section>
      <section className="login-wrap">
        <form id="entrar" className="login-card" autoComplete="off" onSubmit={handleSubmit}>
          <div className="login-autofill-trap" aria-hidden="true">
            <input type="text" tabIndex={-1} autoComplete="username" />
          </div>
          <label className="field">
            <span>Token de acesso</span>
            <input
              type="password"
              name="ex_access"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Cole o token recebido"
              value={token}
                readOnly={!unlockField}
                data-1p-ignore="true"
                data-lpignore="true"
                data-form-type="other"
                onPointerDown={() => setUnlockField(true)}
                onFocus={() => setUnlockField(true)}
                onChange={(event) => setToken(event.target.value)}
            />
          </label>
          <button type="submit" className="go-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
          {message ? (
            <p className="form-error" role="alert">
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  )
}
