import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configurarArquivosEstaticos } from '../src/static-assets';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';

describe('Controle financeiro pessoal (HTTP)', () => {
  let app: NestExpressApplication;
  const service = {
    criar: jest.fn(),
    listar: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, TransacoesController],
      providers: [{ provide: TransacoesService, useValue: service }],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    configurarArquivosEstaticos(app);
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, forbidNonWhitelisted: true, transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  it('GET / exibe o Olá Mundo', async () => {
    await request(app.getHttpServer()).get('/').expect(200, 'Hello World!');
  });

  it('POST /transacoes cadastra uma despesa válida', async () => {
    const dados = {
      descricao: 'Conta de Luz', valor: 120.50, tipo: 'despesa',
      categoria: 'Moradia', consumoConsciente: true,
    };
    service.criar.mockResolvedValue({ _id: 'exemplo', ...dados });
    const resposta = await request(app.getHttpServer())
      .post('/transacoes').send(dados).expect(201);
    expect(resposta.body).toMatchObject(dados);
    expect(service.criar).toHaveBeenCalledWith(dados);
  });

  it('POST /transacoes rejeita tipo inválido', async () => {
    await request(app.getHttpServer()).post('/transacoes').send({
      descricao: 'Luz', valor: 100, tipo: 'investimento',
      categoria: 'Moradia', consumoConsciente: true,
    }).expect(400);
    expect(service.criar).not.toHaveBeenCalled();
  });

  it('POST /transacoes exige os campos obrigatórios', async () => {
    await request(app.getHttpServer()).post('/transacoes').send({
      descricao: 'Luz', tipo: 'despesa',
    }).expect(400);
    expect(service.criar).not.toHaveBeenCalled();
  });

  it('GET /transacoes retorna histórico e as três métricas', async () => {
    const resultado = {
      historico: [],
      metricas: { saldoTotal: 0, totalDespesas: 0, totalGastoImpulso: 0 },
    };
    service.listar.mockResolvedValue(resultado);
    const resposta = await request(app.getHttpServer()).get('/transacoes').expect(200);
    expect(resposta.body).toEqual(resultado);
  });
});
