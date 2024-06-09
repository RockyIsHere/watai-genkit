FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ENV GOOGLE_GENAI_API_KEY=AIzaSyBN-oe9IOeb7sgcrzNDGsvjT4zApGmIzbE

EXPOSE 3000

CMD [ "node", "lib/index.js" ]