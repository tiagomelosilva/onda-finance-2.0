# Onda Finance

Aplicação web que simula um fluxo bancário simples, com foco em organização de código, experiência do usuário e base preparada para evolução real.

Projeto desenvolvido por Tiago Melo Silva, como parte do desafio técnico para vaga a de Dev Front-End.


---

## 🎯 Objetivo do desafio

Construir uma aplicação simulando um app bancário simples, seguindo requisitos de:

- organização
- UX
- boas práticas
- tipagem
- estrutura escalável

Stack e requisitos definidos pelo desafio foram respeitados integralmente.

---

## 🧱 Stack utilizada (obrigatória pelo desafio proposto pelo Hugo)

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

## ⚙️ Funcionalidades implementadas

### 🔐 Login (mock)

- Tela de login simples
- Validação de formulário
- Persistência de sessão via Zustand
- Controle de acesso a rotas protegidas

---

### 📊 Dashboard

- Exibição de saldo consolidado
- Indicadores de entradas e saídas (com modal descritivo e recurso para baixar o comprovante de movimentação em PDF, implementado por minha própria iniciativa)
- Listagem de transações mockadas
- Atualização automática após novas transferências

---

### 💸 Transferência

- Formulário com validação (React Hook Form + Zod)
- Bloqueio de envio inválido
- Atualização imediata do saldo
- Inserção da transação no topo do histórico
- Feedback visual com toast

---

### 🧾 Detalhamento de transações

- Modal completo com:
  - nome
  - e-mail
  - tipo
  - status
  - valor
  - data e hora
  - descrição

---

### 📄 Geração de PDF (implementação extra)

Por iniciativa própria, implementei um recurso que não foi solicitado no desafio:

- Geração de relatório da transação em PDF
- Layout baseado no próprio modal (não texto simplificado)
- Header com identidade "Onda Finance"
- Estrutura visual organizada
- Download direto no navegador

Esse ponto foi pensado como simulação de funcionalidade real de produto.

---

### 🧪 Testes

- Teste automatizado do fluxo principal de transferência
- Validação de:
  - envio de dados
  - atualização de saldo
  - inserção no histórico
  - feedback visual

---

## 🚀 O que foi além do desafio

Não fiquei só no mínimo necessário.

Implementei melhorias pensando como produto real:

- Sincronização entre saldo e histórico (single source of truth)
- Estado global centralizado com Zustand
- Separação clara por domínio (features)
- UX com feedbacks reais (toasts, bloqueios, estados)
- Responsividade funcional (mobile e desktop de verdade)
- Sidebar colapsável + menu mobile
- Modal de detalhes completo
- Exportação de dados em PDF
- Organização de código preparada para escalar

---

## 📁 Estrutura do projeto

Organização orientada por domínio:

src/
  features/
    auth/
    dashboard/
    transfer/

Separação clara entre:
- UI
- estado
- lógica
- dados mockados
- utilitários

---

## 🔄 Fluxo da aplicação

1. Usuário acessa /login
2. Autenticação mockada é validada
3. Sessão é persistida
4. Redirecionamento para /dashboard
5. Dashboard exibe saldo + transações
6. Usuário realiza transferência
7. Sistema:
   - valida dados
   - atualiza saldo
   - adiciona transação
   - exibe feedback
8. Usuário pode abrir detalhes da transação
9. Pode gerar e baixar PDF do relatório

---

## ⚙️ Como rodar o projeto

Instalar dependências:

npm install

Rodar ambiente de desenvolvimento:

npm run dev

Rodar testes:

npm run test

---

## 🔐 Segurança
### Como evitar engenharia reversa

Front-end sempre pode ser inspecionado. O objetivo não é impedir, mas reduzir exposição.

Aplicado:

- Separação de responsabilidades
- Nenhuma regra crítica no client
- Sem exposição de dados sensíveis
- Código preparado para minificação em build

---

### Vazamento de dados

- Nenhum dado sensível persistido
- Uso controlado de estado
- Sanitização de dados exibidos
- Estrutura pronta para integração segura com back-end

---

### O que depende de back-end

- autenticação real
- controle de sessão
- validação de saldo
- antifraude
- criptografia

O front aqui está preparado para essa integração, mas não substitui back-end.

---

## 🧠 Decisões técnicas

- Zustand como SSOT
- React Query simulando comportamento de API real
- Axios preparado para futura integração
- Validação com Zod (tipagem forte)
- Componentização baseada em shadcn/ui
- Organização por domínio para escalabilidade
- Separação entre UI, estado e dados

---

## 📈 Melhorias futuras

Se fosse evoluir isso para produção:

- Autenticação real (JWT + refresh token)
- Integração com API real
- Paginação de histórico
- Filtros por período
- CI/CD com pipeline automatizado
- Logs e observabilidade
- Testes mais abrangentes (edge e cases)

---

## 👤 Autoria

Projeto desenvolvido por mim:

Tiago Melo Silva

- arquitetura
- UI/UX
- estado
- lógica
- testes
- melhorias extras por iniciativa própria

---

## 💬 Consideração final

Ao cumprir o desafio técnico implementando a estrutura exigida pra o desafio e recursos não solicitados (por minha própria iniciativa), mostro como penso na estrutura, experiência do usuário e evolução de produto.

Com isso espero mostrar minha expertise lidando com tarefas propostas dos mais diversos tipos.

Agradeço ao Hugo e à empresa pela oportunidade de mostrar um pouco do meu conhecimento técnico com este teste.