# Onda Finance 2.0

Aplicação web que evolui o desafio original da Onda Finance para um contexto mais próximo de produto: pagamentos globais com moedas fiduciárias e trilhos cripto simulados, mantendo a base do projeto inicial intacta.

Projeto desenvolvido por Tiago Melo Silva como evolução prática do desafio técnico para vaga de Dev Front-End.

---

## Objetivo

Esta versão 2.0 preserva o escopo original do desafio e adiciona uma camada de produto alinhada ao contexto da empresa:

- fluxo bancário simples
- transferências mockadas
- organização de código
- UX consistente
- tipagem forte
- evolução incremental sem quebrar a base existente

O objetivo não é criar backend real, e sim simular um ambiente mais convincente de fintech global.

---

## Stack

Stack mantida conforme o desafio original:

- React + TypeScript
- Vite
- Tailwind CSS + CVA
- shadcn/ui + Radix UI
- React Router
- React Query (@tanstack/react-query)
- Zustand
- React Hook Form + Zod
- Axios
- Vitest + Testing Library

---

## O Que Continua Funcionando

A base original não foi removida nem simplificada:

- login mock
- persistência de sessão
- rotas protegidas
- dashboard com saldo e histórico
- transferência validada
- atualização imediata do estado
- modal de detalhe da transação
- download local de PDF
- teste automatizado do fluxo principal

O fluxo original BRL → BRL continua disponível como caso padrão.

---

## Novidades Da Versão 2.0

### Multi-moeda

Suporte a:

- BRL
- USD
- EUR

O usuário pode:

- visualizar saldo por moeda
- alternar a moeda de visualização no dashboard
- acompanhar consolidado convertido

### Câmbio Mockado

Foi adicionada uma camada de exchange mock:

- conversão entre BRL, USD e EUR
- cotação simulada entre moeda de origem e destino
- abstração isolada da UI

### Transferência Internacional

O fluxo de transferência foi enriquecido com:

- moeda de origem
- moeda de destino
- preview de conversão
- taxa cambial simulada
- valor bruto convertido
- valor final recebido

### Crypto Mode

Foi adicionada uma modalidade simulada de liquidação via cripto:

- taxa operacional diferente
- tempo de processamento diferente
- badge visual no histórico
- status de processamento coerente com rede simulada

### Histórico Evoluído

As transações agora carregam mais contexto:

- moeda de origem
- moeda de destino
- taxa de câmbio
- taxa operacional
- escopo da operação: local, internacional ou crypto
- tipo de liquidação: fiat ou crypto

### Dashboard Evoluído

Sem remover o layout base, o dashboard agora mostra:

- saldo por moeda
- seletor de moeda
- total consolidado na moeda selecionada
- origem das transações
- leitura mais próxima de operação global

---

## Arquitetura

O padrão do projeto foi mantido:

- Zustand para estado global
- React Query para leitura/escrita mockadas
- organização por domínio
- separação entre UI, estado, mocks e utilitários

Novas extensões adicionadas:

- `src/types/currency.ts`
- `src/lib/exchange.ts`

Esses arquivos concentram:

- tipagem de moedas
- tipagem de trilhos de liquidação
- cálculo de câmbio mockado
- cálculo de taxas simuladas
- consolidação de saldos

---

## Estrutura

```text
src/
  app/
  components/
  features/
    auth/
    dashboard/
    transfer/
  lib/
    exchange.ts
    formatters.ts
  mocks/
  stores/
  tests/
  types/
    currency.ts
    transaction.ts
```

---

## Fluxo Da Aplicação

1. Usuário acessa `/login`
2. Faz autenticação mockada
3. Sessão é persistida com Zustand
4. Usuário entra em `/dashboard`
5. Dashboard mostra saldos por moeda e histórico enriquecido
6. Usuário acessa `/transfer`
7. Escolhe:
   - moeda de origem
   - moeda de destino
   - trilho fiat ou crypto
8. O sistema calcula preview da conversão
9. Ao confirmar:
   - valida saldo da moeda de origem
   - aplica quote mockada
   - atualiza saldo
   - adiciona transação ao histórico
   - mantém feedback visual com toast

---

## Como Rodar

Instalar dependências:

```bash
npm install
```

Rodar ambiente local:

```bash
npm run dev
```

Rodar build:

```bash
npm run build
```

Rodar testes:

```bash
npm run test
```

---

## Testes

O projeto mantém teste automatizado do fluxo principal de transferência, cobrindo:

- submissão do formulário
- atualização de saldo
- atualização de histórico
- feedback visual

Além disso, a configuração do Vitest foi ajustada para considerar apenas os testes do projeto atual.

---

## Segurança

### Engenharia reversa

Front-end sempre pode ser inspecionado. A mitigação aqui é estrutural:

- separação de responsabilidades
- nenhuma credencial sensível no client
- lógica crítica real dependeria de backend
- build pronta para minificação

### Vazamento de dados

Neste projeto:

- não há dados sensíveis reais
- estado é controlado localmente
- autenticação continua mockada
- nenhuma API externa é usada

### O que exigiria backend real

- autenticação verdadeira
- controle de sessão seguro
- regras antifraude
- saldo real
- liquidação real entre moedas
- integrações com parceiros financeiros ou blockchain

---

## Decisões Técnicas

- preservação do desafio original como base estável
- evolução incremental em vez de refatoração total
- modelagem multi-moeda com tipagem explícita
- lógica de câmbio isolada em `lib/exchange`
- store enriquecida sem remover compatibilidade com o saldo BRL existente
- dashboard e histórico expandidos sem quebrar o fluxo anterior

---

## Melhorias Futuras

Se fosse evoluir para produção real:

- integração com API de FX real
- cotação em tempo real
- suporte a mais moedas
- trilhos cripto com múltiplas redes
- fee breakdown mais detalhado
- filtros por moeda e tipo de liquidação
- paginação de histórico
- observabilidade e auditoria

---

## Autoria

Projeto desenvolvido por:

Tiago Melo Silva

Responsável por:

- arquitetura
- UI/UX
- modelagem de estado
- fluxo transacional
- extensão 2.0 orientada a produto
- testes

---

## Consideração Final

Esta versão 2.0 foi pensada para mostrar não apenas execução do desafio, mas capacidade de evolução de produto:

- sem quebrar a base existente
- sem inflar a complexidade sem necessidade
- com domínio financeiro mais próximo do contexto real da empresa

O foco foi demonstrar visão incremental, clareza técnica e capacidade de transformar um teste inicial em uma fundação mais madura de produto.
