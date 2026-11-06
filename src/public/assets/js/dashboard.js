import { consultarTransacoes, formatarValor, formatarData } from './api.js';

const elementos = {
  saldo: document.getElementById('saldoTotal'),
  despesas: document.getElementById('totalDespesas'),
  impulso: document.getElementById('totalGastoImpulso'),
  mensagem: document.getElementById('mensagem'),
  lista: document.getElementById('listaTransacoes'),
  atualizar: document.getElementById('atualizar'),
};

function mensagem(texto, erro = false) {
  elementos.mensagem.textContent = texto;
  elementos.mensagem.classList.toggle('aviso-erro', erro);
}

function montarItem(transacao) {
  const item = document.createElement('li');
  item.className = 'historico-item';
  const tipoValido = transacao.tipo === 'receita' ? 'receita' : 'despesa';
  const icone = document.createElement('span');
  icone.className = `historico-icone ${tipoValido}`;
  icone.textContent = tipoValido === 'receita' ? '↗' : '↘';
  icone.setAttribute('aria-hidden', 'true');
  const detalhes = document.createElement('div');
  detalhes.className = 'historico-detalhes';
  const descricao = document.createElement('strong');
  descricao.textContent = transacao.descricao || 'Sem descrição';
  const meta = document.createElement('small');
  meta.textContent = `${transacao.categoria || 'Sem categoria'} · ${formatarData(transacao.createdAt)}`;
  detalhes.append(descricao, meta);
  const lado = document.createElement('div');
  lado.className = 'historico-lado';
  const valor = document.createElement('strong');
  valor.className = `historico-valor ${tipoValido}`;
  valor.textContent = `${tipoValido === 'receita' ? '+' : '−'} ${formatarValor(transacao.valor)}`;
  lado.append(valor);
  if (tipoValido === 'despesa' && transacao.consumoConsciente === false) {
    const tag = document.createElement('small');
    tag.className = 'tag-impulso';
    tag.textContent = 'Por impulso';
    lado.append(tag);
  }
  item.append(icone, detalhes, lado);
  return item;
}

async function atualizarPainel() {
  elementos.atualizar.disabled = true;
  mensagem('Atualizando informações...');
  try {
    const dados = await consultarTransacoes();
    if (!dados || !Array.isArray(dados.historico) || !dados.metricas ||
        !['saldoTotal', 'totalDespesas', 'totalGastoImpulso'].every((campo) =>
          typeof dados.metricas[campo] === 'number' && Number.isFinite(dados.metricas[campo]))) {
      throw new Error('A API retornou dados incompletos para o painel.');
    }
    // Os cálculos são feitos exclusivamente pelo Service do NestJS.
    elementos.saldo.textContent = formatarValor(dados.metricas.saldoTotal);
    elementos.despesas.textContent = formatarValor(dados.metricas.totalDespesas);
    elementos.impulso.textContent = formatarValor(dados.metricas.totalGastoImpulso);
    elementos.saldo.classList.toggle('valor-negativo', dados.metricas.saldoTotal < 0);
    elementos.lista.replaceChildren();
    if (dados.historico.length === 0) {
      const vazio = document.createElement('li');
      vazio.className = 'estado-vazio';
      vazio.textContent = 'Nenhum lançamento ainda. Registre sua primeira movimentação para começar.';
      elementos.lista.append(vazio);
    } else {
      for (const transacao of dados.historico) elementos.lista.append(montarItem(transacao));
    }
    mensagem(`${dados.historico.length} lançamento(s) registrado(s) no seu histórico.`);
  } catch (erro) {
    mensagem(erro.message || 'Não foi possível carregar o painel.', true);
    elementos.lista.replaceChildren();
    const aviso = document.createElement('li');
    aviso.className = 'estado-vazio';
    aviso.textContent = 'Não foi possível carregar o extrato. Clique em Atualizar para tentar novamente.';
    elementos.lista.append(aviso);
  } finally {
    elementos.atualizar.disabled = false;
  }
}

elementos.atualizar.addEventListener('click', atualizarPainel);
void atualizarPainel();
