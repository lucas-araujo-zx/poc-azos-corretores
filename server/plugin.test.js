import assert from 'node:assert/strict'
import test from 'node:test'
import { VOICE_AGENT, tokensMatch } from './agents.js'
import { dispatchApi } from './plugin.js'

const env = {
  loginToken: 'token-da-bancada',
  apiKey: 'chave',
  voiceAgentId: VOICE_AGENT.id,
}

const agentBody = {
  name: 'Azos – Hub de Oportunidades – Ativação de Corretores Frios',
  conversation_config: {
    agent: {
      dynamic_variables: {
        dynamic_variable_placeholders: {
          codigo_corretor: 'HUB-2001',
          nome_corretor: 'Ricardo',
          nome_gerente: 'Camila Torres',
          macro_regiao: 'Sul',
          tipo_corretor: 'G2',
          numero_ligacao: '1',
          whatsapp_final: '4467',
          link_cotacao: 'azos.com.br/hub/cotar',
        },
      },
      prompt: { prompt: 'Olá {{nome_corretor}}' },
      first_message: 'Oi, {{nome_corretor}}. Estou falando em nome {{saudacao_gerente}} {{nome_gerente}}.',
    },
  },
}

function call(method, pathname, token, search = '', body) {
  return dispatchApi(
    { method, pathname, searchParams: new URLSearchParams(search), token, body },
    env,
  )
}

test('o token da bancada entra e outro token não', async () => {
  assert.equal(tokensMatch(env.loginToken, env.loginToken), true)
  assert.equal(tokensMatch('outro', env.loginToken), false)
  const denied = await call('POST', '/api/login', '', '', { token: 'errado' })
  assert.equal(denied.status, 401)
  const ok = await call('POST', '/api/login', '', '', { token: env.loginToken })
  assert.equal(ok.payload.ok, true)
})

test('o catálogo inclui a saudação lida da primeira mensagem', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async (url) => {
    const href = String(url)
    if (href.includes('/agents/')) return new Response(JSON.stringify(agentBody), { status: 200 })
    return new Response('no', { status: 500 })
  }
  try {
    const catalog = await call('GET', '/api/catalog', env.loginToken)
    assert.equal(catalog.status, 200)
    assert.equal(catalog.payload.agent.name, agentBody.name)
    const names = catalog.payload.variables.map((item) => item.name)
    assert.ok(names.includes('nome_corretor'))
    assert.ok(names.includes('saudacao_gerente'))
    const blocked = await call('POST', '/api/session', env.loginToken, '', { variables: {} })
    assert.equal(blocked.status, 400)
    assert.ok(blocked.payload.missing.includes('saudacao_gerente'))
  } finally {
    globalThis.fetch = original
  }
})

test('a sessão só abre com as variáveis preenchidas', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async (url) => {
    const href = String(url)
    if (href.includes('get-signed-url')) {
      return new Response(JSON.stringify({ signed_url: 'wss://sessao' }), { status: 200 })
    }
    if (href.includes('/agents/')) return new Response(JSON.stringify(agentBody), { status: 200 })
    return new Response('no', { status: 500 })
  }
  try {
    const session = await call('POST', '/api/session', env.loginToken, '', {
      variables: {
        codigo_corretor: 'HUB-2001',
        nome_corretor: 'Ricardo',
        nome_gerente: 'Camila Torres',
        saudacao_gerente: 'da sua Gerente Comercial,',
        macro_regiao: 'Sul',
        tipo_corretor: 'G2',
        numero_ligacao: '1',
        whatsapp_final: '4467',
        link_cotacao: 'azos.com.br/hub/cotar',
      },
    })
    assert.equal(session.status, 200)
    assert.equal(session.payload.signedUrl, 'wss://sessao')
    assert.equal(session.payload.dynamicVariables.nome_corretor, 'Ricardo')
    assert.equal(session.payload.dynamicVariables.saudacao_gerente, 'da sua Gerente Comercial,')
  } finally {
    globalThis.fetch = original
  }
})

test('conversa de outro agente fica de fora', async () => {
  const original = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        conversation_id: 'conv_4801m64ptqcke33aq74hz968qm1m',
        agent_id: 'agent_de_outro_lugar_xxxx',
        status: 'done',
      }),
      { status: 200 },
    )
  try {
    const result = await call(
      'GET',
      '/api/conversation',
      env.loginToken,
      'conversation_id=conv_4801m64ptqcke33aq74hz968qm1m',
    )
    assert.equal(result.status, 404)
  } finally {
    globalThis.fetch = original
  }
})
