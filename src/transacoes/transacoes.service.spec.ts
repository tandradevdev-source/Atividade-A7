import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Transacao } from './schemas/transacao.schema';
import { TransacoesService } from './transacoes.service';
const lancamento = { descricao: 'Salário', valor: 2500, tipo: 'receita' as const, categoria: 'Trabalho', consumoConsciente: true };
describe('TransacoesService', () => {
  let service: TransacoesService;
  const modelMock = { create: jest.fn(), find: jest.fn() };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransacoesService, { provide: getModelToken(Transacao.name), useValue: modelMock }],
    }).compile();
    service = module.get(TransacoesService);
  });
  it('cadastra uma transação no banco', async () => {
    modelMock.create.mockResolvedValue({ _id: 'id1', ...lancamento });
    await expect(service.criar(lancamento)).resolves.toMatchObject(lancamento);
    expect(modelMock.create).toHaveBeenCalledWith(lancamento);
  });
  it('retorna histórico e métricas processadas', async () => {
    const historico = [
      lancamento,
      { descricao: 'Mercado', valor: 200, tipo: 'despesa', categoria: 'Alimentação', consumoConsciente: true },
      { descricao: 'Lanche', valor: 50, tipo: 'despesa', categoria: 'Lazer', consumoConsciente: false },
    ];
    const exec = jest.fn().mockResolvedValue(historico);
    const lean = jest.fn().mockReturnValue({ exec });
    const sort = jest.fn().mockReturnValue({ lean });
    modelMock.find.mockReturnValue({ sort });
    await expect(service.listar()).resolves.toEqual({
      historico, metricas: { saldoTotal: 2250, totalDespesas: 250, totalGastoImpulso: 50 },
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
  });
});
