import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { calcularMetricas } from './metricas';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';
@Injectable()
export class TransacoesService {
  constructor(@InjectModel(Transacao.name) private readonly transacaoModel: Model<Transacao>) {}
  async criar(dados: CriarTransacaoDto): Promise<TransacaoDocument> {
    return this.transacaoModel.create(dados);
  }
  async listar(): Promise<{ historico: Transacao[]; metricas: ReturnType<typeof calcularMetricas> }> {
    const historico = await this.transacaoModel.find().sort({ createdAt: -1 }).lean().exec();
    return { historico, metricas: calcularMetricas(historico) };
  }
}
