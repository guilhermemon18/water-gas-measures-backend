# Use a imagem Node.js oficial
FROM node:18-alpine

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o código-fonte para o contêiner
COPY . .

# Compila o projeto TypeScript para JavaScript
RUN npm run build

# Expõe a porta que o aplicativo irá usar
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
