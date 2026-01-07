# Configuração da API no Railway

## ⚠️ Importante

O link `api-rest_vagas.railway.internal` é uma **URL interna** do Railway que só funciona dentro da rede interna do Railway. Para o frontend acessar a API, você precisa usar a **URL pública**.

## 🔍 Como encontrar a URL pública do Railway

1. Acesse o [Railway Dashboard](https://railway.app/dashboard)
2. Selecione seu projeto `API-Rest_Vagas`
3. Vá para a aba **Settings** ou **Deployments**
4. Procure por **Public Domain** ou **Custom Domain**
5. A URL pública geralmente tem o formato:
   - `https://[nome-do-projeto].railway.app`
   - ou `https://[nome-personalizado].railway.app`

## 📝 Configuração

1. O arquivo `.env` já está criado e configurado com a URL de produção:
   ```env
   VITE_API_URL=https://api-restvagas-production.up.railway.app/api
   ```

   **Importante:** 
   - A URL já está configurada corretamente
   - Para desenvolvimento local, altere para: `VITE_API_URL=http://localhost:8080/api`
   - Não use a URL `.railway.internal` (ela é apenas para comunicação interna)

3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🧪 Testando a conexão

Após configurar, você pode testar se a API está acessível:

1. Abra o navegador e acesse: `https://api-restvagas-production.up.railway.app/api/curriculos/1` (substitua pelo ID de um currículo existente)
2. Se retornar dados JSON, a API está funcionando
3. Se retornar erro de CORS, você precisa configurar CORS no backend

## 🔒 CORS (Cross-Origin Resource Sharing)

Se você receber erros de CORS ao tentar acessar a API do frontend, você precisa configurar CORS no backend Spring Boot para permitir requisições do seu frontend.

No backend, adicione no `application.properties` ou `application.yml`:

```properties
# Permitir CORS do frontend
spring.web.cors.allowed-origins=http://localhost:5173,https://seu-frontend.railway.app
```

Ou configure no código Java:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173", "https://seu-frontend.railway.app", "https://seu-frontend.vercel.app")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
            }
        };
    }
}
```

## 📌 Exemplo completo

A URL pública do Railway configurada é: `https://api-restvagas-production.up.railway.app`

No `.env` está configurado:
```env
VITE_API_URL=https://api-restvagas-production.up.railway.app/api
```

