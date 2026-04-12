# CompraCertaAI – FrontEnd React + Vite

## 📌 Descrição Geral do Projeto

CompraCertaAI é um front-end moderno de e-commerce alimentado por React, Vite e uma API REST. O projeto fornece uma interface intuitiva para buscar produtos, gerenciar perfil de usuário e histórico de pesquisas.

**Stack Tecnológico:**
- React 19 + Vite (bundler rápido)
- React Router v7 (navegação)
- Axios (requisições HTTP)
- Context API (autenticação)
- CSS puro (variáveis globais)
- localStorage (persistência de sessão)

---

## 🎯 Funcionalidades Principais

✅ **Autenticação**
- Login com email e senha
- Cadastro de novo usuário
- Persistência de sessão com localStorage
- Interceptor Axios para injeção automática de token JWT

✅ **Recomendações e Busca**
- Página Home com recomendações de produtos
- Busca dinâmica com GET /api/products/search
- Cards responsivos com imagem, nome, descrição, loja e link

✅ **Gerenciamento de Perfil**
- Visualização de dados pessoais
- Edição de nome, email e categoria favorita
- Carregamento paralelo de perfil e categorias

✅ **Histórico de Pesquisas**
- Listagem ordenada por data (mais recente primeiro)
- Formatação de data em português
- Botão para buscar novamente

✅ **Navegação Protegida**
- Rotas públicas: /login, /cadastro
- Rotas privadas: /home, /perfil, /atualizar-perfil, /historico
- Redirecionamento automático em 401 (token expirado)
- ProtectedRoute com verificação de autenticação

---

## 🏗️ Arquitetura do Front-End

### Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Header.jsx + Header.css       # Navegação principal
│   ├── ProductCard.jsx + ProductCard.css  # Card de produto
│   ├── ProtectedRoute.jsx            # Guard de rotas privadas
│   ├── Loading.jsx                   # Spinner
│   └── EmptyState.jsx                # Mensagem vazia
├── context/              # Context API
│   ├── AuthContext.jsx               # Gerenciamento de autenticação
│   └── useAuth.js                    # Hook customizado
├── pages/                # Páginas/Telas
│   ├── Login.jsx + Login.css                # Tela de entrada
│   ├── Cadastro.jsx + Cadastro.css          # Tela de registro
│   ├── Home.jsx + Home.css                  # Recomendações e busca
│   ├── Perfil.jsx + Perfil.css              # Visualizar perfil
│   ├── AtualizarPerfil.jsx + AtualizarPerfil.css  # Editar perfil
│   └── Historico.jsx + Historico.css        # Histórico de pesquisas
├── services/             # Serviços de API
│   ├── api.js            # Cliente Axios + interceptors
│   ├── authService.js    # Login
│   ├── usuarioService.js # CRUD usuário, perfil
│   ├── categoriaService.js # Categorias
│   ├── produtoService.js # Busca, recomendações
│   └── historicoService.js # Histórico
├── styles/               # Estilos globais
│   └── global.css        # Reset, variáveis CSS, estilo base
├── App.jsx               # Roteamento principal
├── main.jsx              # Entry point
└── vite.config.js        # Configuração Vite
.env                      # Variáveis de ambiente
.gitignore
package.json
package-lock.json
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- API back-end rodando em `http://localhost:5139`

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/RodrigoPCamilo/CompraCerta-AI-Front-end.git
   cd CompraCertaAI-Front-end
   ```

2. **Instale dependências:**
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente:**
   ```bash
   # Copie o .env.example para .env (já está configurado)
   cp .env.example .env
   ```
   Edite `.env` se necessário (padrão: `http://localhost:5139`):
   ```
   VITE_API_URL=http://localhost:5139
   ```

4. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:5173

5. **Build para produção:**
   ```bash
   npm run build
   ```

6. **Preview do build:**
   ```bash
   npm run preview
   ```

---

## 📋 Fluxo de Navegação

```
/login ──────→ /cadastro ──────→ /login (após cadastro)
  ↓                              ↓
  └────────────→ /home ←────────┘
                 ├─→ /perfil
                 │    └─→ /atualizar-perfil
                 └─→ /historico
```

### Comportamentos

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Entrada com email/senha |
| `/cadastro` | Público | Registro de novo usuário |
| `/home` | Privado | Recomendações e busca de produtos |
| `/perfil` | Privado | Visualização de dados do usuário |
| `/atualizar-perfil` | Privado | Edição de perfil |
| `/historico` | Privado | Histórico de buscas |

- **Rotas privadas** redirecionam para `/login` se não houver token
- **Token expirado (401)**: localStorage é limpo, redireciona para `/login`

---

## 🔌 Integração com API

### BaseURL
- **URL:** `http://localhost:5139`
- **Autenticação:** Bearer Token (JWT)
- **CORS:** Liberado para `http://localhost:5173`

### Headers Automáticos
O cliente Axios injeta automaticamente:
```
Authorization: Bearer {token}
```

### Endpoints Utilizados

#### Autenticação
- `POST /api/auth/login` – Login (email, senha)

#### Usuário
- `POST /api/usuario` – Criar usuário (nome, email, senha, categoriaIds)
- `GET /api/usuario/perfil` – Obter perfil atual
- `PUT /api/usuario/{id}` – Atualizar perfil

#### Categorias
- `GET /api/usuario/categorias/disponiveis` – Lista de categorias

#### Produtos
- `GET /api/products/recommendations` – Recomendações (até 10)
- `GET /api/products/search?query={texto}` – Busca de produtos

#### Histórico
- `GET /api/historico-pesquisa` – Lista de pesquisas do usuário

---

## 📦 Componentes Reutilizáveis

### `<Header />`
Navegação principal com links para Home, Perfil, Histórico e botão Logout.
```jsx
<Header />
```

### `<ProductCard />`
Card de produto com imagem, nome, descrição, loja, categoria e link.
```jsx
<ProductCard
  imagemUrl={produto.imagemUrl}
  nomeProduto={produto.nomeProduto}
  descricao={produto.descricao}
  loja={produto.loja}
  categoriaNome={produto.categoriaNome}
  linkProduto={produto.linkProduto}
/>
```

### `<ProtectedRoute />`
Guarda rotas privadas e redireciona para `/login` se não autenticado.
```jsx
<Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
```

### `<Loading />`
Spinner com mensagem de carregamento.
```jsx
<Loading />
```

### `<EmptyState />`
Mensagem quando não há resultados.
```jsx
<EmptyState message="Nenhum produto encontrado" />
```

---

## 🎨 Estilos

### Variáveis CSS Globais
Definidas em `src/styles/global.css`:
- Cores: `--primary-color`, `--text-dark`, `--bg-light`, etc.
- Espaçamento: `--spacing-xs` a `--spacing-2xl`
- Border radius: `--radius-sm` a `--radius-xl`
- Sombras: `--shadow-sm` a `--shadow-lg`

### Responsividade
- **Desktop:** 3-4 colunas de produtos
- **Tablet:** 2 colunas
- **Mobile:** 1 coluna (100%)
- Breakpoints: 768px, 480px

---

## 🔐 Autenticação

### Login
1. Usuário digita email e senha
2. `authService.login()` faz POST para `/api/auth/login`
3. API retorna `{ token, expiraEm, email, id }`
4. Context salva em localStorage
5. Redireciona para `/home`

### Persistência
- Token é carregado de localStorage ao iniciar
- Hook `useAuth()` fornece acesso global ao contexto
- `ProtectedRoute` verifica se há token antes de renderizar

### Expiração
- Interceptor Axios detecta 401 (token expirado)
- localStorage é limpo automaticamente
- Redireciona para `/login`

---

## 📝 Lint e Build

```bash
# Rodar eslint
npm run lint

# Build
npm run build

# Preview
npm run preview

# Desenvolvimento
npm run dev
```

---

## 🛠️ Tecnologias & Dependências

- **React:** 19.2.0
- **React Router:** 7.12.0
- **Axios:** 1.13.3
- **React Markdown:** 10.1.0 (para exibir respostas formatadas)
- **Vite:** 7.2.4
- **ESLint:** 9.39.1

---

## 📂 Arquivos Importantes

- `.env` – Variáveis de ambiente (VITE_API_URL)
- `.env.example` – Modelo de .env
- `src/context/AuthContext.jsx` – Gerenciamento global de autenticação
- `src/services/api.js` – Cliente Axios com interceptors
- `src/styles/global.css` – Estilos globais e variáveis CSS

---

## ⚠️ Troubleshooting

### Erro CORS
Se receber erro de CORS:
1. Verificar se a API está rodando em `http://localhost:5139`
2. Confirmar que CORS está liberado no backend para `http://localhost:5173`
3. Se necessário, adicionar proxy em `vite.config.js`:
   ```js
   proxy: {
     '/api': 'http://localhost:5139'
   }
   ```

### Token expirado
- User será redirecionado para `/login` automaticamente
- localStorage será limpo
- Fazer login novamente

### Produto sem imagem
- ProductCard exibe placeholder automático: `https://via.placeholder.com/200?text=Produto`

---

## 🚀 Deploy

Para deployar em produção (ex: Vercel, Netlify):

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** para seu hosting

3. **Configure variáveis de ambiente** no painel do hosting:
   ```
   VITE_API_URL=https://seu-backend.com
   ```

4. **Redireione 404s para `index.html`** (modo SPA)

---

## 📞 Contato & Suporte

Para dúvidas ou problemas, consulte a documentação da API ou abra uma issue no repositório.

---

## 📄 Licença

Este projeto está sob licença MIT.

. Implementação do Atualizar Perfil

. Botão para limpar Histórico do Perfil

. Filtro de pesquisa no Historico do Perfil

## 📚 Referências

. Documentação do React

. Documentação do Vite

. Documentação do Axios

## 👨‍💻 Autor:

Desenvolvido por Rodrigo Prado Camilo.

___
