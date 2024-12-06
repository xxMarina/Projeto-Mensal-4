# **Task Board - Laboratório de HTTP com JavaScript**

Este projeto é uma aplicação simples de Task Board que desenvolvi para praticar e consolidar conceitos sobre o protocolo HTTP, além de aplicar técnicas de manipulação de dados utilizando JavaScript. A aplicação permite a criação, leitura, atualização e exclusão de tarefas de forma dinâmica, simulando um sistema funcional de gerenciamento de tarefas.

## **Objetivo do Projeto**

Meu principal objetivo ao desenvolver este Task Board foi:

- Compreender o funcionamento das requisições HTTP.
- Aplicar os métodos HTTP padrão — **GET**, **POST**, **PUT** e **DELETE** — em um ambiente prático.
- Criar uma interface visual funcional utilizando **HTML** e **CSS**, permitindo a interação com os dados.
- Aprender a manipular tarefas de forma dinâmica em colunas, simulando um quadro de organização (como o Trello).
- Integrar estilizações dinâmicas baseadas em temas (light/dark) e personalizar a aparência do board.

## **Funcionalidades Implementadas**

Durante o desenvolvimento, implementei diversas funcionalidades:

### **1. Interface Interativa**

- Utilizei **HTML** e **CSS** para criar um layout intuitivo e organizado.
- As tarefas estão dispostas em colunas com cabeçalhos estilizados e um corpo onde as tarefas aparecem.

### **2. Criação de Tarefas**

- Adicionei a funcionalidade de criar novas tarefas dinamicamente.
- As tarefas são adicionadas ao board utilizando a interação com o backend simulado via o método HTTP **POST**.
- Foi implementada validação básica para garantir que apenas dados válidos sejam enviados.

### **3. Alteração de Tarefas**

- As tarefas podem ser editadas diretamente na interface.
- Utilizei o método HTTP **PUT** para enviar as atualizações ao servidor, refletindo as alterações no board.

### **4. Exclusão de Tarefas**

- É possível deletar tarefas utilizando botões de ação nas mesmas.
- O método HTTP **DELETE** foi aplicado para essa operação.

### **5. Leitura de Dados**

- Ao carregar a página, as tarefas existentes são obtidas do servidor por meio do método HTTP **GET**.
- Os dados retornados são renderizados no board em tempo real.

### **6. Temas Dinâmicos**

- Adicionei a funcionalidade de alternar entre temas **light** e **dark**, com estilizações específicas para cada modo.
- As colunas, tarefas e botões se ajustam visualmente ao tema escolhido pelo usuário, proporcionando uma experiência imersiva e personalizada.

## **Como Executei o Projeto**

### **Tecnologias Utilizadas**

- **HTML5**: Estrutura básica da aplicação.
- **CSS3**: Design responsivo e estilização dinâmica para os temas.
- **JavaScript**: Manipulação do DOM, interações dinâmicas e comunicação com o backend.
- **Postman**: Para simular as respostas de um servidor.

### **Passos do Desenvolvimento**

1. **Criação da Estrutura do HTML**: Organizei as colunas e tarefas em elementos como `<div>` e classes específicas.
2. **Estilização Inicial**: Utilizei CSS para criar um visual limpo e responsivo, implementando transições e bordas arredondadas.
3. **Integração com HTTP**:
   - Implementei requisições usando os métodos HTTP mencionados, manipulando dados simulados.
   - Configurei mensagens de erro para feedback em caso de falhas.
4. **Estilização por Tema**: Criei dois estilos — **light** e **dark** — que podem ser alternados dinamicamente via JavaScript.

## **Aprendizados e Desafios**

- Aprendi a implementar requisições HTTP no front-end de forma dinâmica e prática.
- Entendi como estruturar um layout funcional e estilizado para uma aplicação de tarefas.
- O maior desafio foi garantir que as alterações nas tarefas fossem refletidas corretamente no board, especialmente ao usar os métodos PUT e DELETE.
