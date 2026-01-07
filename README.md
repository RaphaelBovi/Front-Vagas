# Empregar - Frontend

Frontend React.js desenvolvido com Vite para consumir a API REST de Vagas.

## 🚀 Como executar

### Pré-requisitos

- Node.js 16+ e npm
- API Backend rodando (veja [API-Rest_Vagas](https://github.com/RaphaelBovi/API-Rest_Vagas))

### Instalação

```bash
npm install
```

### Configuração

1. Copie o arquivo `env.example` para `.env`:
```bash
cp env.example .env
```

2. Configure a URL da API no arquivo `.env`:
   - **Para desenvolvimento local:** `VITE_API_URL=http://localhost:8080/api`
   - **Para produção (Domínio personalizado):** `VITE_API_URL=https://api-vagasraphael.com/api`
   
   ⚠️ **Importante:** O arquivo `.env` já está configurado com a URL de produção. Para desenvolvimento local, altere para `http://localhost:8080/api`

### Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Preview da build

```bash
npm run preview
```

## 📁 Estrutura do projeto

```
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── Header.jsx   # Cabeçalho da aplicação
│   │   └── CurriculoForm.jsx  # Formulário de currículo
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home.jsx     # Página inicial (buscar currículo)
│   │   ├── CriarCurriculo.jsx
│   │   ├── EditarCurriculo.jsx
│   │   ├── VisualizarCurriculo.jsx
│   │   └── Vagas.jsx    # Página de vagas recomendadas
│   ├── services/        # Serviços de API
│   │   └── api.js       # Cliente HTTP e serviços
│   ├── App.jsx          # Componente principal com rotas
│   ├── main.jsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── index.html           # HTML principal
└── vite.config.js       # Configuração do Vite
```

## 🎯 Funcionalidades

- ✅ Criar currículo completo
- ✅ Buscar currículo por ID
- ✅ Editar currículo existente
- ✅ Deletar currículo
- ✅ Visualizar detalhes do currículo
- ✅ Buscar vagas recomendadas baseadas no currículo
- ✅ Validação de formulários
- ✅ Interface responsiva e moderna

## 🔌 Integração com API

O frontend consome os seguintes endpoints da API:

- `POST /api/curriculos` - Criar currículo
- `GET /api/curriculos/{id}` - Buscar currículo
- `PUT /api/curriculos/{id}` - Atualizar currículo
- `DELETE /api/curriculos/{id}` - Deletar currículo
- `GET /api/curriculos/{id}/vagas` - Buscar vagas

## 🛠️ Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **ESLint** - Linter de código

## 📝 Modelo de Dados

O currículo inclui:
- Dados pessoais (nome, residência, data de nascimento, escolaridade)
- Skills (obrigatório, mínimo 1)
- Cursos complementares (opcional, máximo 15)
- Idiomas (opcional)

## 🎨 Interface

A interface foi desenvolvida com:
- Design moderno e responsivo
- Gradientes e sombras para profundidade
- Feedback visual em ações do usuário
- Mensagens de erro e sucesso
- Validação em tempo real

## 🌐 Deploy em Produção

O projeto está hospedado no Railway:

- **Frontend:** https://raphaelvagas.com
- **Backend API:** https://api-vagasraphael.com/api
- **Banco de Dados:** PostgreSQL no Railway

Para mais informações sobre o deploy, consulte o arquivo [RAILWAY_SETUP.md](./RAILWAY_SETUP.md).

## 📄 Licença

Este projeto está sob a licença MIT.

