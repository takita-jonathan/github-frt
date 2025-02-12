# GithubFrt

Projeto desenvolvido para integrar-se à API do GitHub e exibir informações relevantes.

## Tecnologias Utilizadas

- Angular 19
- Node.js 20
- Cypress
- Jasmine
- Karma
- PouchDB

## Como Executar o Projeto

Para rodar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/takita-jonathan/github-frt.git
   ```
2. **Acesse o diretório do projeto:**
   ```bash
   cd github-frt
   ```
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

Com o servidor em execução, acesse [localhost:4200](http://localhost:4200/).

Caso não queira rodar o projeto localmente, você pode acessá-lo diretamente na seguinte URL:

[Github FRT](http://github-frt.s3-website-sa-east-1.amazonaws.com/)

## Executando Testes

### Testes Unitários

Para rodar os testes unitários, execute:

```bash
npm test
```

### Testes End-to-End (E2E)

Para executar os testes E2E com Cypress, utilize:

```bash
npm run cypress:run
```

