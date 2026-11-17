import { Topbar } from './Topbar.jsx'
import { SCENARIOS } from './scenarios.js'

export function Home({ onOpen, onSignOut }) {
  return (
    <div className="site">
      <a className="skip-link" href="#cenarios">
        Ir para os cenários
      </a>
      <Topbar current={null} onNavigate={onOpen} onSignOut={onSignOut} />
      <section className="hero">
        <div className="hero-in">
          <h1>Teste o agente de voz dos corretores</h1>
          <p>Escolha um perfil de corretor. Cada cenário carrega dados de exemplo e você conversa com o agente como se fosse aquele corretor.</p>
          <ul>
            <li>Dados fictícios</li>
            <li>Transcrição ao vivo</li>
            <li>Troque de cenário a qualquer momento</li>
          </ul>
        </div>
      </section>
      <section className="scenarios" id="cenarios">
        {SCENARIOS.map((item) => (
          <button key={item.id} type="button" className="sc" onClick={() => onOpen(item.id)}>
            <div className="sc-code">{item.code}</div>
            <h2>{item.name}</h2>
            <div className="cad">
              {item.cadence.map((chip) => (
                <span className="chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
            <p>{item.focus}</p>
            <span className="go">Testar {item.tab.toLowerCase()}</span>
          </button>
        ))}
      </section>
      <p className="howto">
        <strong>Como testar:</strong> abra um cenário, clique em Iniciar conversa e permita o uso do microfone. Fale como o corretor descrito à esquerda. A transcrição aparece no centro e, ao encerrar, os dados da conversa ficam na tela.
      </p>
    </div>
  )
}
