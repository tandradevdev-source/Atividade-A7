// Quando o front-end roda no próprio NestJS, usa a mesma origem.
// Se for aberto no Live Server local, chama a API NestJS em localhost:3000.
const hostLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const frontSeparado = window.location.protocol === 'file:' || (hostLocal && window.location.port !== '3000');
const origemApi = frontSeparado ? 'http://localhost:3000' : '';

async function requisitar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${origemApi}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o NestJS e o MongoDB estão em execução.');
  }
  let dados;
  try {
    dados = await resposta.json();
  } catch {
    throw new Error('A resposta do servidor não está no formato esperado.');
  }
  if (!resposta.ok) {
    const mensagem = Array.isArray(dados?.message) ? dados.message.join('; ') : dados?.message;
    throw new Error(typeof mensagem === 'string' ? mensagem : 'Não foi possível concluir a operação.');
  }
  return dados;
}

export function consultarTransacoes() { return requisitar('/transacoes'); }
export function criarTransacao(transacao) {
  return requisitar('/transacoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transacao),
  });
}
export function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor));
}
export function formatarData(valor) {
  if (!valor) return 'Data não informada';
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? 'Data não informada' :
    new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(data);
}
