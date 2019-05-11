FROM node:10-alpine
RUN mkdir -p /home/Service
WORKDIR /home/Service   
COPY . /home/Service 
RUN npm install --no-bin-links && npm i egg-scripts --save -g
EXPOSE 7001
CMD ["npm", "start"]
