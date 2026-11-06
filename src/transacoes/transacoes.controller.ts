import { Body, Controller, Get, Post } from '@nestjs/common';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { TransacoesService } from './transacoes.service';
@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}
  @Post()
  cadastrar(@Body() dados: CriarTransacaoDto) {
    return this.transacoesService.criar(dados);
  }
  @Get()
  consultar() { return this.transacoesService.listar(); }
}
