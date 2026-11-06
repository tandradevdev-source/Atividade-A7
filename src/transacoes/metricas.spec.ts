import { calcularMetricas } from './metricas';
describe('calcularMetricas', () => {
  it('retorna zeros quando não há transações', () => {
    expect(calcularMetricas([])).toEqual({ saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 });
  });
  it('calcula o saldo, despesas e gastos por impulso', () => {
    expect(calcularMetricas([
      { tipo: 'receita', valor: 2000, consumoConsciente: false },
      { tipo: 'despesa', valor: 600, consumoConsciente: true },
      { tipo: 'despesa', valor: 159.9, consumoConsciente: false },
    ])).toEqual({ saldoTotal: 1240.1, totalDespesas: 759.9, totalGastoImpulso: 159.9 });
  });
  it('mantém duas casas decimais nos resultados monetários', () => {
    expect(calcularMetricas([
      { tipo: 'receita', valor: 0.3, consumoConsciente: true },
      { tipo: 'despesa', valor: 0.1, consumoConsciente: false },
      { tipo: 'despesa', valor: 0.2, consumoConsciente: true },
    ])).toEqual({ saldoTotal: 0, totalDespesas: 0.3, totalGastoImpulso: 0.1 });
  });
});
