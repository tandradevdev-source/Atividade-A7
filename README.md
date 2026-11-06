# Aula 7 — Web Mobile: Controle Financeiro Pessoal

API REST de NestJS, Mongoose e MongoDB Atlas, criada como atividade acadêmica de Web Mobile (ADS, Mackenzie). A proposta está ligada à educação financeira e ao consumo consciente.

## Como executar

1. Instale Node.js 20.19+ e npm.
2. Execute npm install.
3. Copie o arquivo .env.example para .env e insira a string MONGODB_URI do MongoDB Atlas (não divulgue suas credenciais). Configure IP autorizado e usuário no Atlas.
4. Execute npm run start e acesse http://localhost:3000 para ver Hello World!.
5. Teste as rotas com Postman Desktop.

## Rotas

**POST /transacoes** — Cadastre uma transação com os cinco campos obrigatórios:

    {
      "descricao": "Conta de Luz",
      "valor": 125.50,
      "tipo": "despesa",
      "categoria": "Moradia",
      "consumoConsciente": true
    }

O tipo aceita apenas receita ou despesa e o valor deve ser positivo. Para despesas, consumoConsciente=false indica gasto por impulso.

**GET /transacoes** — Retorna um objeto com historico (array de transações) e metricas contendo saldoTotal (receitas - despesas), totalDespesas e totalGastoImpulso (somente despesas não conscientes).

## Verificação

- npm test: testes unitários (cálculos e service com mock de MongoDB).
- npm run test:e2e: testes das rotas HTTP com service simulado.
- npm run build: compilação.
- É preciso conectar uma conta do MongoDB Atlas para testar a persistência real.

## Entrega

Repositório: https://github.com/tandradevdev-source/Atividade-A7

O ZIP acadêmico contém as pastas src e test, package.json, tsconfig.json, nest-cli.json e github.txt. Os segredos do MongoDB ficam exclusivamente no .env local, que não é publicado.
