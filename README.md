# Diário do Fuguete - Livro Digital

Este projeto é um livro digital interativo que reúne as memórias do blog "Diário do Fuguete" (2006).

## 🚀 Como Executar Localmente

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

3.  **Acesse no navegador:**
    `http://localhost:3000`

## 📦 Como Publicar no GitHub / Netlify

### No GitHub
1.  Crie um novo repositório no GitHub.
2.  Inicie um repositório git localmente:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
3.  Conecte ao seu repositório remoto e faça o push.

### No Netlify
1.  Conecte sua conta do GitHub ao Netlify.
2.  Selecione o repositório `diario-do-fuguete`.
3.  Use as seguintes configurações:
    *   **Build Command:** `npm run build`
    *   **Publish directory:** `dist`
4.  O arquivo `netlify.toml` já está configurado para lidar com o build automaticamente.

## Estética
O projeto utiliza:
-   **React + Vite** para a estrutura.
-   **Tailwind CSS** para o estilo vintage.
-   **Motion** para as animações de virada de página.
