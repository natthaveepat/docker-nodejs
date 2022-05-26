FROM node:16
WORKDIR /usr/src/app
COPY package.json .
# RUN npm install --only=production
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ];\
        then npm install;\
        else npm install --only=production;\
        fi
COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
