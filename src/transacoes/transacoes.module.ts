import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';
import { Transacao, TransacaoSchema } from './schemas/transacao.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Transacao.name, schema: TransacaoSchema }])],
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
