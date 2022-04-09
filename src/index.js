import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { sign_s3 } from './aws-upload';
import mongoose from 'mongoose';
import './utils/db';
import schema from './schema';
import cors from 'cors';
dotenv.config();

const app = express();

const server = new ApolloServer({
  schema,
  cors: true,
  playground: process.env.NODE_ENV === 'development' ? true : false,
  introspection: true,
  tracing: true,
  path: '/graphql',
  context: ({ req }) => req,
});

app.use(cors());

app.use(bodyParser.json());

app.post('/sign_s3', (req, res) => {
  sign_s3(req, res);
});

app.post('/generateglft', (req, res) => {
  gltfjsx(req.url);
});

server.applyMiddleware({
  app,
  path: '/',
  cors: true,
  onHealthCheck: () =>
    // eslint-disable-next-line no-undef
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState > 0) {
        resolve();
      } else {
        reject();
      }
    }),
});

app.listen({ port: process.env.PORT }, () => {});
