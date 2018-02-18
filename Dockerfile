FROM node:6.9.2
EXPOSE 3010 
COPY package.json .
COPY microservice1.js .
RUN npm install
CMD node microservice1.js