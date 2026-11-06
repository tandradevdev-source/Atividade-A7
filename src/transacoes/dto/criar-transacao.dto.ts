import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
export class CriarTransacaoDto {
  @IsString() @IsNotEmpty() @MaxLength(150)
  descricao!: string;
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 }) @Min(0.01)
  valor!: number;
  @IsIn(['receita', 'despesa'])
  tipo!: 'receita' | 'despesa';
  @IsString() @IsNotEmpty() @MaxLength(80)
  categoria!: string;
  @IsBoolean()
  consumoConsciente!: boolean;
}
