# Tagarela - API de Fofocas

Backend para o aplicativo Tagarela, uma plataforma de compartilhamento de fofocas.

## Descrição

Tagarela é uma API RESTful que permite:
- Criar e gerenciar usuários
- Publicar "fofocas" (posts) com autor e vítima
- Consultar rankings e estatísticas

## Estrutura do Projeto

```
faminas/backend/Tagarela/
├── src/
│   ├── controllers/    # Controladores que processam requisições HTTP
│   ├── models/         # Interfaces e tipos
│   ├── routes/         # Definição de rotas
│   ├── services/       # Lógica de negócio
│   └── index.ts        # Ponto de entrada da aplicação
├── package.json        # Dependências do projeto
└── tsconfig.json       # Configuração do TypeScript
```

## Como Executar

1. Instale as dependências:
   ```
   npm install
   ```

2. Execute em modo de desenvolvimento:
   ```
   npm run dev
   ```

3. Para compilar para produção:
   ```
   npm run build
   ```

4. Para executar em produção:
   ```
   npm start
   ```

## Endpoints da API

### Usuários
- `POST /user` - Criar um novo usuário
- `GET /user` - Listar todos os usuários
- `GET /user/:id` - Buscar usuário por ID
- `DELETE /user/:id` - Excluir um usuário (somente se não tiver posts)
- `GET /user/:id/victim-posts` - Listar posts onde o usuário é vítima
- `GET /user/top-authors` - Listar os 5 usuários com mais posts criados

### Posts
- `POST /post` - Criar um novo post/fofoca
- `GET /post` - Listar todos os posts

## Regras de Negócio

1. Um usuário só pode ser excluído se não estiver envolvido em nenhum post (como autor ou vítima)
2. Um post deve ter um autor e uma vítima diferentes
3. Tanto o autor quanto a vítima devem ser usuários existentes

## Correções Implementadas

1. **Correção de template string**:
   - Corrigido o template string na mensagem de inicialização do servidor

2. **Modelo Post**:
   - Adicionado o campo `createdAt` à interface `Post`
   - Atualizado o array de posts de exemplo com datas
   - Modificada a função `createPost` para definir o timestamp de criação

3. **Rotas**:
   - Adicionadas as rotas para os endpoints pendentes:
     - `DELETE /user/:id`
     - `GET /user/:id/victim-posts`
     - `GET /user/top-authors`

4. **Validação de entradas**:
   - Adicionada validação para assegurar que IDs sejam números inteiros positivos em `getUserByIdController`

5. **Dependência circular**:
   - Resolvido o problema de dependência circular entre `userService` e `postService` usando injeção de dependência opcional

6. **Documentação**:
   - Padronizado o tipo de ID como `number` em toda a documentação JSDoc
   - Completada a documentação de todos os controladores
   - Removidos comentários obsoletos

## Próximos Passos

- Implementar persistência em banco de dados
- Adicionar autenticação de usuários
- Implementar testes automatizados 