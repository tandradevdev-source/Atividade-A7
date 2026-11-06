# A8 – Web Mobile | Controle Financeiro Pessoal

Projeto da Aula 8: interface Mobile First (HTML, CSS e JavaScript) integrada ao back-end NestJS/MongoDB desenvolvido na Aula 7.

## Requisitos de execução

- Node.js 20.19+ e npm
- MongoDB Atlas ativo, usuário de banco e IP autorizado

## Instalação e execução

1. Extraia o ZIP. Abra a pasta extraída no VS Code.
2. No terminal, execute `npm install`.
3. Crie um arquivo `.env` **na raiz do projeto**, com sua conexão pessoal (não compartilhe a senha):

   `MONGODB_URI=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/controle_financeiro?retryWrites=true&w=majority`

4. Execute `npm run start` (ou `npm run start:dev`).
5. Abra `http://localhost:3000` para usar o dashboard. O formulário está em `http://localhost:3000/nova-transacao.html`.
6. Se preferir rodar o front-end pelo Live Server, abra `src/public/index.html` com o Live Server e mantenha o NestJS na porta 3000. A interface detecta a separação de portas e envia os dados para a API.

## Funcionalidades

- Registrar receitas e despesas com descrição, valor, tipo, categoria e classificação do gasto como consciente/essencial ou por impulso.
- `POST /transacoes` registra os dados no MongoDB.
- `GET /transacoes` devolve o `historico` e as `metricas` (`saldoTotal`, `totalDespesas`, `totalGastoImpulso`), calculadas exclusivamente no service do back-end.
- Dashboard responsivo em `src/public/index.html` exibe as três métricas e os lançamentos recentes. Gastos por impulso aparecem destacados em vermelho.
- Formulário acessível e responsivo em `src/public/nova-transacao.html`.

## Testes

- `npm run build`: compila o NestJS.
- `npm test`: testes unitários da API.
- `npm run test:e2e`: testes HTTP da API e da distribuição dos arquivos estáticos usando mocks (não exigem MongoDB real).
- `npm run test:frontend`: testes da estrutura da interface e das requisições JavaScript via Node.js.

**Atenção:** a persistência real exige uma conexão válida com o MongoDB Atlas. Os testes mockados não substituem um teste final com banco configurado.

## Entrega

De acordo com o PDF da Aula 8, o ZIP contém **somente** `src/`, `test/`, `package.json`, `tsconfig.json` e `nest-cli.json`. Os dados de acesso do banco não devem ser incluídos ou publicados.
