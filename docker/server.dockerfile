FROM node:latest 

RUN apt update && apt install -y telnet dnsutils vim

COPY ../package*.json ./
COPY ../ ./

RUN npm install 
RUN npm install --save-dev @types/node
RUN npm run build 

CMD ["npm", "run", "start:dev"] 

# docker build -t server -f docker/server.dockerfile . 
# docker run -p 3000:3000 -t server 
