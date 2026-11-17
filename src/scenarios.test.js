import assert from 'node:assert/strict'
import test from 'node:test'
import { SCENARIOS, brokersOf, dynamicVariables, scenarioFromHash, scriptSteps } from './scenarios.js'

test('cada cenário tem três corretores e as nove variáveis do agente', () => {
  assert.equal(SCENARIOS.length, 3)
  for (const scenario of SCENARIOS) {
    const brokers = brokersOf(scenario)
    assert.equal(brokers.length, 3)
    for (const broker of brokers) {
      const values = dynamicVariables(broker)
      assert.deepEqual(Object.keys(values), [
        'codigo_corretor',
        'nome_corretor',
        'nome_gerente',
        'saudacao_gerente',
        'macro_regiao',
        'tipo_corretor',
        'numero_ligacao',
        'whatsapp_final',
        'link_cotacao',
      ])
      assert.equal(values.tipo_corretor, scenario.code)
      assert.equal(values.nome_corretor, broker.nome.split(' ')[0])
      assert.equal(values.link_cotacao, 'azos.com.br/hub/cotar')
      assert.equal(scriptSteps(scenario, broker).length, 4)
    }
  }
})

test('a saudação acompanha o gênero do gerente', () => {
  const g2 = SCENARIOS.find((item) => item.id === 'g2')
  const ricardo = brokersOf(g2).find((item) => item.codigo === 'HUB-2001')
  assert.equal(dynamicVariables(ricardo).saudacao_gerente, 'da sua Gerente Comercial,')
  assert.equal(dynamicVariables(ricardo).nome_gerente, 'Camila Torres')
})

test('o hash só abre um cenário conhecido', () => {
  assert.equal(scenarioFromHash('#g1')?.code, 'G1')
  assert.equal(scenarioFromHash('#inicio'), null)
  assert.equal(scenarioFromHash('#token-secreto'), null)
})
