# MaqExpress
Versão atual: v0.0903
## Materiais para a equipe
#### Frontend:
 - [JavaScript](https://developer.mozilla.org/pt-BR/docs/Learn/Getting_started_with_the_web/JavaScript_basics)
 - [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
 - [React](https://react.dev/learn)
 - [Styled-components💅](https://styled-components.com/docs/basics#getting-started)
#### Backend:
- [Rust-book](https://rust-br.github.io/rust-book-pt-br/)
- [Rust-by-example](https://doc.rust-lang.org/stable/rust-by-example/) 
- [Rustlings](https://github.com/rust-lang/rustlings)
#### Banco de dados:
 - [PostgreSQL + pgAdmin](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
 - AWS
 #### Versionamento:
  - [Git](https://git-scm.com/downloads)
  - [GitHub/Repositório](https://github.com/HadsonRamalho/Integrador)
 #### IDE:
  - [Visual Studio Code](https://code.visualstudio.com/)
   #### Extensões para a IDE:
   [(Backend) Rust-Analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

 ## Guia de desenvolvimento/teste do sistema
  Siga os passos abaixo para instalar todos as ferramentas necessárias para desenvolver o projeto:
 ### 1 - Instale o Visual Studio Code
  [Visual Studio Code](https://code.visualstudio.com/)
 ### 2 - Instale o Node.js
  [Node.js](https://nodejs.org/en/download/prebuilt-installer)
 ### 3 - Instale o Git

  [Git](https://git-scm.com/downloads)
  
Após a instalação, faça login na sua conta do GitHub.
 ### 4 - Instale o Rust

  [Rust](https://rustup.rs/)
  
Será instalado o Visual Studio Community, isso deve levar algum tempo, seja paciente.

### 5 - Instale o OpenSSL
  [OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)

### 6 - Clone o repositório

Primeiro, abra um terminal e navegue até a pasta `/Documents` ou `/Documentos`.
  Em seguida, execute o código abaixo para clonar o repositório:
  `git clone https://github.com/HadsonRamalho/Integrador.git`
  Após isso, acesse a pasta do projeto usando `cd Integrador`, e execute o código abaixo para entrar na branch de desenvolvimento:

  `git checkout dev`
 
 Para confirmar que você está na branch correta, execute `git branch`.

# Documentação e informações do sistema
## Requisitos funcionais (RF) e não funcionais (RNF)
- RF 001: Listar todas as máquinas disponíveis para aluguel
- RF 002: CRUD de usuário base
- RF 003: CRUD de usuário locatário (que aluga as máquinas)
- RF 004: CRUD de usuário locador (o proprietário das máquinas)
- RF 005: Permitir que um usuário, independente do seu tipo, alugue uma máquina
- RF 006: CRUD de máquinas
- RF 007: CRUD de endereços
- RF 008: Permitir a criação e atualização de solicitações de contratos
- RF 009: Permitir que um contrato seja exportado para PDF
- RF 010: Permitir que um locador veja as solicitações de contratos que recebeu
- RF 011: Permitir que um locatário veja as solicitações de contratos que emitiu

- RNF 001: Permitir que o usuário alterne entre tema claro / escuro
- RNF 002: Criar testes unitários para testar as funcionalidades da API
- RNF 003: Facilitar o uso e entendimento do sistema
- RNF 004: Disponibilizar um guia simples para uso do sistema
- RNF 005: Permitir que o usuário pesquise por máquinas
- RNF 006: Permitir que o usuário filtre  máquinas por categoria

## Casos de Uso
### Caso 1 - Cadastro de Usuário
- Ator: Usuário
- Objetivo: Cadastrar uma nova conta no sistema
- Pré-Condição:
- Fluxo Principal:
 1. - O usuário acessa a página "Criar Conta'
 2. - Preenche todos os campos
 3. - Confirma o cadastro
 4. - O sistema valida e armazena as informações
 5. - O usuário é redirecionado para a página 'Login'
- Fluxo Alternativo:
  1. - O usuário acessa a página 'Login'
  2. - Clica em 'Entrar com o Google'
  3. - É redirecionado para a página de login do Google
  4. - Faz login em sua conta Google e permite a autenticação
  5. - É redirecionado de volta para o sistema
  6. - O sistema valida o login e o usuário é redirecionado para a página 'Minhas Informações'
     
 ### Caso 2 - Login de Usuário
- Ator: Usuário
- Objetivo: Entrar em uma conta já registrada no sistema
- Pré-Condição: Possuir uma conta cadastrada
- Fluxo Principal:
 1. - O usuário acessa a página 'Login'
 2. - Preenche os campos de e-mail e senha
 3. - Clica no botão 'Entrar'
 4. - O usuário é redirecionado para a página 'Minhas Informações'
- Fluxo Alternativo:
  1. - O usuário acessa a página 'Login'
  2. - Clica em 'Entrar com o Google'
  3. - É redirecionado para a página de login do Google
  4. - Faz login em sua conta Google e permite a autenticação
  5. - É redirecionado de volta para o sistema
  6. - O sistema valida o login e o usuário é redirecionado para a página 'Minhas Informações'

### Caso 3 - Recuperação de Senha
- Ator: Usuário
- Objetivo: Recuperar e redefinir a senha de uma conta registrada no sistema
- Pré-Condição: Possuir uma conta cadastrada pelo sistema (que não tenha utilizado o login via Google)
- Fluxo Principal:
 1. - O usuário acessa a página 'Login'
 2. - Clica no botão 'Esqueci a senha'
 3. - É redirecionado para a página 'Recuperação de Senha'
 4. - Preenche o campo com o e-mail da conta
 5. - Clica no botão 'Enviar código'
 6. - O sistema verifica se o e-mail pertence a alguma conta e envia um código de recuperação para o usuário
 7. - O usuário preenche o código recebido por e-mail
 8. - Clica em 'Verificar código'
 9. - O sistema verifica se o código é válido
 10. - Preenche os campos com a nova senha
 11. - Clica no botão 'Alterar senha'
 12. - A senha é alterada e o usuário é redirecionado para a página 'Login'

 ### Caso 4 - Atualização de Dados do Usuário
- Ator: Usuário
- Objetivo: Atualizar informações (Nome e Documento) da conta de um usuário
- Pré-Condição: Estar logado em uma conta
- Fluxo Principal:
 1. - O usuário acessa a página 'Minhas Informações'
 2. - Altera os campos Nome ou Documento
 3. - Preenche o campo Senha
 4. - Clica no botão 'Atualizar perfil'
 5. - O sistema valida a senha, atualizando os dados caso seja válida
 6. - A interface é atualizada com as novas informações do usuário

 ### Caso 5 - Cadastro de Endereço do Usuário
- Ator: Usuário
- Objetivo: Cadastrar o endereço de um usuário
- Pré-Condição: Estar logado em uma conta
- Fluxo Principal:
 1. - O usuário acessa a página 'Minhas Informações'
 2. - O sistema exibe um card com campos a serem preenchidos
 3. - O usuário preenche o CEP
 4. - Se o CEP for válido, o sistema preenche os campos restantes
 5. - O usuário corrige os campos necessários
 6. - Clica no botão 'Cadastrar'
 7. - O sistema faz o cadastro do endereço
- Fluxo Alternativo:
  1. - O usuário acessa a página 'Minhas Informações'
  2. - O sistema exibe um card com campos a serem preenchidos
  3. - Clica no botão 'Vou fazer isso depois'
  4. - O usuário é redirecionado para a página 'Home'

### Caso 6 - Listar Máquinas Disponíveis
- Ator: Usuário
- Objetivo: Ver quais máquinas estão disponíveis para aluguel
- Pré-Condição: O sistema deve ter ao menos uma máquina disponível
- Fluxo Principal:
 1. - Através da barra de navegação, o usuário acessa a página 'Máquinas Disponíveis' 
 2. - O sistema exibe a lista de máquinas disponíveis, com cada máquina disposta num card único
     
 ### Ajuda
  
Se tiver problemas com qualquer um dos tópicos acima, não hesite em nos procurar!
