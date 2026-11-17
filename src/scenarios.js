export const LINK_COTACAO = 'azos.com.br/hub/cotar'

const GERENTES = {
  'Rafael Mendes': { regiao: 'Sudeste SP', saudacao: 'do seu Gerente Comercial,' },
  'Camila Torres': { regiao: 'Sul', saudacao: 'da sua Gerente Comercial,' },
  'Bruno Albuquerque': { regiao: 'Nordeste', saudacao: 'do seu Gerente Comercial,' },
  'Juliana Prado': { regiao: 'Centro-Oeste e Norte', saudacao: 'da sua Gerente Comercial,' },
}

export const BROKERS = [
  { codigo: 'HUB-1001', nome: 'Fernanda Ribeiro', tipo: 'G1', gerente: 'Rafael Mendes', regiao: 'Sudeste SP', cidade: 'Campinas', wa: '7712', entrada: '03/11/2026', vendas: '0', ultima: 'nenhuma', ligacao: '1', regua: 'semana 2 de 4', obs: 'Corretora multimarcas, base de clientes de auto e residencial.' },
  { codigo: 'HUB-1002', nome: 'Thiago Nascimento', tipo: 'G1', gerente: 'Bruno Albuquerque', regiao: 'Nordeste', cidade: 'Recife', wa: '3398', entrada: '28/10/2026', vendas: '0', ultima: 'nenhuma', ligacao: '2', regua: 'semana 3 de 4', obs: 'Na ligação 1 disse que não era bom momento e recebeu o link; ainda não cotou.' },
  { codigo: 'HUB-1003', nome: 'Patrícia Lopes', tipo: 'G1', gerente: 'Juliana Prado', regiao: 'Centro-Oeste e Norte', cidade: 'Goiânia', wa: '5120', entrada: '06/11/2026', vendas: '0', ultima: 'nenhuma', ligacao: '1', regua: 'semana 1 de 4', obs: 'Foco em planos de saúde PME.' },
  { codigo: 'HUB-2001', nome: 'Ricardo Moraes', tipo: 'G2', gerente: 'Camila Torres', regiao: 'Sul', cidade: 'Curitiba', wa: '4467', entrada: '15/09/2026', vendas: '3', ultima: 'maio de 2026', ligacao: '1', regua: 'semana 2 de 4', obs: 'Vendeu seguro de vida para clientes empresários; sem cotações há 5 meses.' },
  { codigo: 'HUB-2002', nome: 'Aline Carvalho', tipo: 'G2', gerente: 'Rafael Mendes', regiao: 'Sudeste SP', cidade: 'São Paulo', wa: '9031', entrada: '02/09/2026', vendas: '1', ultima: 'março de 2026', ligacao: '2', regua: 'semana 3 de 4', obs: 'Na ligação 1 aceitou o link mas não cotou; pode ter travado em algo.' },
  { codigo: 'HUB-2003', nome: 'Marcos Vieira', tipo: 'G2', gerente: 'Bruno Albuquerque', regiao: 'Nordeste', cidade: 'Salvador', wa: '2285', entrada: '20/08/2026', vendas: '5', ultima: 'julho de 2026', ligacao: '1', regua: 'semana 1 de 4', obs: 'Corretor experiente, carteira grande de clientes PF.' },
  { codigo: 'HUB-3001', nome: 'Juliana Santos', tipo: 'G3', gerente: 'Camila Torres', regiao: 'Sul', cidade: 'Porto Alegre', wa: '6654', entrada: '10/08/2026', vendas: '0', ultima: 'nenhuma', ligacao: '1', regua: 'semana 2 de 4', obs: 'Nunca vendeu seguro de vida; trabalha principalmente com consórcio.' },
  { codigo: 'HUB-3002', nome: 'Eduardo Pires', tipo: 'G3', gerente: 'Juliana Prado', regiao: 'Centro-Oeste e Norte', cidade: 'Brasília', wa: '1809', entrada: '25/07/2026', vendas: '0', ultima: 'nenhuma', ligacao: '2', regua: 'semana 4 de 4', obs: 'Na ligação 1 não atendeu (caixa postal).' },
  { codigo: 'HUB-3003', nome: 'Larissa Gomes', tipo: 'G3', gerente: 'Rafael Mendes', regiao: 'Sudeste SP', cidade: 'Santos', wa: '4073', entrada: '18/09/2026', vendas: '0', ultima: 'nenhuma', ligacao: '1', regua: 'semana 2 de 4', obs: 'Corretora iniciante, base pequena de clientes próximos.' },
]

export const SCENARIOS = [
  {
    id: 'g1',
    code: 'G1',
    name: 'Recém-chegado',
    tab: 'Cenário 1',
    cadence: ['2 por semana (8 no mês)', '1 por semana (4)'],
    focus: 'Acolhimento, primeiro passo prático, prova social, convite direto e próximo passo',
    line: '“O(a) gerente vai te acompanhar aqui pelo Hub, e um bom primeiro passo é olhar clientes que já confiam em você.”',
  },
  {
    id: 'g2',
    code: 'G2',
    name: 'Já vendeu',
    tab: 'Cenário 2',
    cadence: ['2 por semana (8)', '1 por semana (4)'],
    focus: 'Memória de venda, 5 contatos da base, curiosidade sobre campanhas e convite direto',
    line: '“Você já vendeu Azos antes, então sabe como funciona quando a conversa encaixa. Olhar a base com outro critério costuma reabrir oportunidades.”',
  },
  {
    id: 'g3',
    code: 'G3',
    name: 'Nunca vendeu',
    tab: 'Cenário 3',
    cadence: ['1 por semana (4)', '1 por semana (4)'],
    focus: 'Normaliza nunca ter vendido, “o primeiro passo não é vender” e convite seguro ao gerente',
    line: '“Muita gente começa sem nunca ter vendido, e o primeiro passo nem é vender, é só ver quem faria sentido abordar.”',
  },
]

export function scenarioFromHash(hash = '') {
  const id = String(hash).replace(/^#/, '')
  return SCENARIOS.find((item) => item.id === id) ?? null
}

export function brokersOf(scenario) {
  return BROKERS.filter((item) => item.tipo === scenario.code)
}

export function firstName(nome) {
  return String(nome ?? '').trim().split(/\s+/)[0] ?? ''
}

export function dynamicVariables(broker) {
  const gerente = GERENTES[broker.gerente] ?? { saudacao: 'do(a) seu(sua) Gerente Comercial,' }
  return {
    codigo_corretor: broker.codigo,
    nome_corretor: firstName(broker.nome),
    nome_gerente: broker.gerente,
    saudacao_gerente: gerente.saudacao,
    macro_regiao: broker.regiao,
    tipo_corretor: broker.tipo,
    numero_ligacao: broker.ligacao,
    whatsapp_final: broker.wa,
    link_cotacao: LINK_COTACAO,
  }
}

export function scriptSteps(scenario, broker) {
  const values = dynamicVariables(broker)
  if (broker.ligacao === '1') {
    return [
      `Saudação: “Oi, ${values.nome_corretor}… Estou falando em nome ${values.saudacao_gerente} ${broker.gerente}.”`,
      `“Legal! É rapidinho:” + trecho do ${scenario.code}: ${scenario.line}`,
      'Convite: fazer uma cotação agora e receber o link por WhatsApp',
      `Confirmar WhatsApp com final ${broker.wa} ou avisar ${broker.gerente}`,
    ]
  }
  return [
    `Saudação em nome de ${broker.gerente}`,
    'Retomar: “Te liguei semana passada sobre fazer uma cotação…”',
    'Perguntar se algo travou e oferecer reenviar o link',
    `Oferecer passar para ${broker.gerente}; não prometer nova ligação`,
  ]
}
