const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const raiz = join(__dirname, '..');
const ler = (arquivo) => readFileSync(join(raiz, 'src', 'public', arquivo), 'utf8');

function iniciarApi(porta = '3000') {
  global.window = { location: { hostname: 'localhost', protocol: 'http:', port: porta } };
  return import(`${pathToFileURL(join(raiz, 'src/public/assets/js/api.js')).href}?porta=${porta}`);
}

test('dashboard possui campos para as 3 métricas e histórico', () => {
  const html = ler('index.html');
  for (const id of ['saldoTotal', 'totalDespesas', 'totalGastoImpulso', 'listaTransacoes']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /dashboard\.js/);
});

test('formulário contém os 5 campos obrigatórios', () => {
  const html = ler('nova-transacao.html');
  for (const campo of ['descricao', 'valor', 'tipo', 'categoria', 'consumoConsciente']) {
    assert.match(html, new RegExp(`name="${campo}"`));
  }
  assert.match(html, /nova-transacao\.js/);
});

test('GET /transacoes obtém valores sem calcular métricas no navegador', async () => {
  const api = await iniciarApi();
  const recebido = { historico: [], metricas: { saldoTotal: 125.1, totalDespesas: 30, totalGastoImpulso: 5 } };
  let alvo;
  global.fetch = async (url) => { alvo = url; return { ok: true, json: async () => recebido }; };
  assert.deepEqual(await api.consultarTransacoes(), recebido);
  assert.equal(alvo, '/transacoes');
  assert.match(api.formatarValor(12.5), /12,50/);
  const dashboard = ler('assets/js/dashboard.js');
  for (const campo of ['saldoTotal', 'totalDespesas', 'totalGastoImpulso']) {
    assert.match(dashboard, new RegExp(`dados\\.metricas\\.${campo}`));
  }
});

test('POST /transacoes envia os campos como JSON', async () => {
  const api = await iniciarApi();
  const lancamento = { descricao: 'Mercado', valor: 99.5, tipo: 'despesa', categoria: 'Alimentação', consumoConsciente: false };
  let destino, opcoes;
  global.fetch = async (url, init) => { destino = url; opcoes = init; return { ok: true, json: async () => ({ _id: 'x', ...lancamento }) }; };
  assert.equal((await api.criarTransacao(lancamento)).descricao, 'Mercado');
  assert.equal(destino, '/transacoes');
  assert.equal(opcoes.method, 'POST');
  assert.equal(opcoes.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(opcoes.body), lancamento);
});

test('Live Server separado chama o NestJS em localhost:3000', async () => {
  const api = await iniciarApi('5500');
  let destino;
  global.fetch = async (url) => { destino = url; return { ok: true, json: async () => ({ historico: [], metricas: {} }) }; };
  await api.consultarTransacoes();
  assert.equal(destino, 'http://localhost:3000/transacoes');
});

test('falha HTTP é comunicada corretamente', async () => {
  const api = await iniciarApi();
  global.fetch = async () => ({ ok: false, json: async () => ({ message: ['tipo inválido', 'valor inválido'] }) });
  await assert.rejects(api.consultarTransacoes(), /tipo inválido; valor inválido/);
});
