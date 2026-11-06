import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';

/** Disponibiliza o front-end pelo próprio servidor NestJS. */
export function configurarArquivosEstaticos(app: NestExpressApplication): void {
  const pastaOrigem = join(process.cwd(), 'src', 'public');
  const pastaCompilada = join(__dirname, 'public');
  const pasta = existsSync(pastaOrigem) ? pastaOrigem : pastaCompilada;
  app.useStaticAssets(pasta, { index: 'index.html' });
}
