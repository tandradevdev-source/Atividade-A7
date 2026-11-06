import { criarTransacao } from './api.js';

const formulario = document.getElementById('formTransacao');
const botao = document.getElementById('salvar');
const feedback = document.getElementById('feedback');

function exibirMensagem(texto, erro = false) {
  feedback.hidden = false;
  feedback.textContent = texto;
  feedback.classList.toggle('feedback-erro', erro);
  feedback.classList.toggle('feedback-sucesso', !erro);
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (!formulario.reportValidity()) return;
  const campos = new FormData(formulario);
  const tipo = campos.get('tipo');
  const consciente = campos.get('consumoConsciente');
  const valor = Number(campos.get('valor'));
  if (!Number.isFinite(valor) || valor <= 0 || !['receita', 'despesa'].includes(tipo) ||
      !['true', 'false'].includes(consciente)) {
    exibirMensagem('Verifique o valor, o tipo e a classificação da transação.', true);
    return;
  }
  const dados = {
    descricao: String(campos.get('descricao')).trim(),
    valor,
    tipo,
    categoria: String(campos.get('categoria')).trim(),
    consumoConsciente: consciente === 'true',
  };
  if (!dados.descricao || !dados.categoria) {
    exibirMensagem('Informe a descrição e a categoria.', true);
    return;
  }
  botao.disabled = true;
  botao.textContent = 'Salvando...';
  try {
    await criarTransacao(dados);
    exibirMensagem('Transação salva com sucesso. Você já pode conferir o resultado no painel.');
    formulario.reset();
    document.getElementById('descricao').focus();
  } catch (erro) {
    exibirMensagem(erro.message || 'Ocorreu um erro ao salvar.', true);
  } finally {
    botao.disabled = false;
    botao.textContent = 'Salvar transação ↗';
  }
});
