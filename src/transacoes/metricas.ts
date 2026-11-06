export interface DadosTransacao {
  tipo: 'receita' | 'despesa';
  valor: number;
  consumoConsciente: boolean;
}
export interface MetricasFinanceiras {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}
// Somar em centavos reduz imprecisões de ponto flutuante.
export function calcularMetricas(transacoes: readonly DadosTransacao[]): MetricasFinanceiras {
  let saldoCentavos = 0;
  let despesaCentavos = 0;
  let impulsoCentavos = 0;
  for (const transacao of transacoes) {
    const centavos = Math.round(transacao.valor * 100);
    if (transacao.tipo === 'receita') {
      saldoCentavos += centavos;
    } else {
      saldoCentavos -= centavos;
      despesaCentavos += centavos;
      if (transacao.consumoConsciente === false) impulsoCentavos += centavos;
    }
  }
  return {
    saldoTotal: saldoCentavos / 100,
    totalDespesas: despesaCentavos / 100,
    totalGastoImpulso: impulsoCentavos / 100,
  };
}
