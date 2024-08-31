
# REST API com  NodeJS, Express e SQlite

Este projeto é uma API que realiza medições sobre consumo de água e gás, passando uma imagem do hidrômetro como parãmetro, faz a integração com o google Gemini e fornece o número identificado na leitura.


## Como utilizar

Criar a `.env` usando `.env.example` a seguir, onde :

```sh
PORT=3000
GEMINI_API_KEY=${<SUA-GEMINI_API_KEY>}

```

## Instalar dependências

```sh
npm install

```

## Rodar em desenvolvimento

```sh
npm run dev

```

## Build para produção

```sh
npm run build

```
## Rodar em produção

```sh
npm start

```

## Docker-Compose

```sh
docker-compose up
```




