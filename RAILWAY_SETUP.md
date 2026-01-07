# Configuração do Deploy no Railway

## 🌐 Domínios Configurados

- **Frontend:** `https://raphaelvagas.com`
- **Backend API:** `https://api-vagasraphael.com/api`
- **Banco de Dados:** `postgres-production-e12e.up.railway.app` (mainline.proxy.rlwy.net:11981)

## 🚀 Deploy do Frontend no Railway

### 1. Conectar Repositório

1. Acesse o [Railway Dashboard](https://railway.app/dashboard)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `Front-Vagas`
5. Railway detectará automaticamente que é um projeto Node.js/Vite

### 2. Configurar Variáveis de Ambiente

No Railway, vá em **Settings → Variables** e adicione:

```
VITE_API_URL=https://api-vagasraphael.com/api
NODE_ENV=production
```

**⚠️ IMPORTANTE:** 
- As variáveis que começam com `VITE_` precisam estar configuradas no Railway ANTES do build
- Sem essas variáveis, o build não incluirá a URL correta da API

### 3. Configurar Build e Deploy

O arquivo `railway.json` já está configurado, mas você pode verificar em **Settings → Build**:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`

### 4. Configurar Domínio Personalizado

1. No Railway, vá em **Settings → Domains**
2. Clique em **"Custom Domain"**
3. Digite: `raphaelvagas.com`
4. Siga as instruções para configurar DNS:
   - Adicione um registro **CNAME** apontando para o domínio do Railway fornecido
   - Ou use os registros **A** fornecidos pelo Railway
5. Aguarde a propagação do DNS (pode levar até 24 horas)
6. O SSL será ativado automaticamente pelo Railway

### 5. Verificar Deploy

Após configurar:
1. Railway fará o build automaticamente
2. Verifique os logs em **Deployments**
3. Teste o domínio após o deploy completar: `https://raphaelvagas.com`

## 🔧 Configuração da API Backend

### URL da API

A API está configurada para rodar em: `https://api-vagasraphael.com`

### Configuração CORS no Backend

No backend Spring Boot, configure CORS para permitir requisições do frontend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5173", 
                        "https://raphaelvagas.com", 
                        "https://www.raphaelvagas.com"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

Ou no `application.properties`:

```properties
# Permitir CORS do frontend
spring.web.cors.allowed-origins=http://localhost:5173,https://raphaelvagas.com,https://www.raphaelvagas.com
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

## 🗄️ Configuração do Banco de Dados

O banco de dados PostgreSQL está configurado em:
- **Host:** `postgres-production-e12e.up.railway.app`
- **Proxy:** `mainline.proxy.rlwy.net:11981`

Configure essas variáveis no backend:
- `DATABASE_URL` ou variáveis individuais de conexão
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

## 📝 Configuração Local

Para desenvolvimento local, crie um arquivo `.env`:

```env
# Desenvolvimento local
VITE_API_URL=http://localhost:8080/api
```

## 🧪 Testando a Conexão

### Testar API

1. Abra o navegador e acesse: `https://api-vagasraphael.com/api/curriculos/1` (substitua pelo ID de um currículo existente)
2. Se retornar dados JSON, a API está funcionando
3. Se retornar erro de CORS, verifique a configuração CORS no backend

### Testar Frontend

1. Acesse: `https://raphaelvagas.com`
2. Abra o Console do navegador (F12)
3. Verifique se há erros de conexão com a API
4. Teste criar um currículo para verificar a integração completa

## ❌ Problemas Comuns

### 1. Build falha no Railway

**Solução:**
- Verifique se `VITE_API_URL` está configurada nas variáveis de ambiente
- Verifique os logs do build em **Deployments**
- Certifique-se de que `serve` está nas dependências do `package.json`

### 2. Site não carrega (erro 404)

**Solução:**
- Verifique se o domínio está configurado corretamente no Railway
- Aguarde a propagação do DNS (pode levar até 24h)
- Verifique se o SSL está ativo (Railway ativa automaticamente)
- Verifique se o build gerou a pasta `dist` corretamente

### 3. Erro 404 em rotas (SPA)

**Solução:**
- O `serve -s` já está configurado para SPA (Single Page Application)
- Se persistir, verifique se o script `start` está correto: `serve -s dist -l $PORT`

### 4. Erro de CORS

**Solução:**
- Verifique se o backend está configurado para aceitar requisições de `https://raphaelvagas.com`
- Verifique se `allowCredentials` está configurado corretamente
- Verifique se os métodos HTTP estão permitidos (GET, POST, PUT, DELETE, OPTIONS)

### 5. API não responde

**Solução:**
- Verifique se a API está rodando e acessível em `https://api-vagasraphael.com`
- Verifique se o domínio da API está configurado corretamente no Railway
- Verifique os logs da API no Railway

## 📌 Checklist de Deploy

- [ ] Repositório conectado ao Railway
- [ ] Variável `VITE_API_URL` configurada no Railway
- [ ] Variável `NODE_ENV=production` configurada
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm start`
- [ ] Domínio `raphaelvagas.com` configurado no Railway
- [ ] DNS configurado corretamente
- [ ] SSL ativo (automático no Railway)
- [ ] CORS configurado no backend para aceitar `raphaelvagas.com`
- [ ] Teste de acesso ao frontend funcionando
- [ ] Teste de integração com API funcionando

## 🔗 Links Úteis

- [Railway Dashboard](https://railway.app/dashboard)
- [Documentação Railway](https://docs.railway.app/)
- Frontend: https://raphaelvagas.com
- Backend API: https://api-vagasraphael.com/api
