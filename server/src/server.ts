import express, { type Request, type Response } from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import routes from './routes/index.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { getUserFromToken } from './services/auth.js';

const __dirname = path.resolve();
const PORT = process.env.PORT || 3001;

// ✅ Apollo v4 Setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const startApolloServer = async () => {
  await server.start();

  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // ✅ GraphQL Middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        const user = getUserFromToken(req);
        return { user };
      },
    })
  );

  // ✅ API Routes
  app.use(routes);

  // ✅ Serve Frontend AFTER all other routes
  if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(__dirname, 'client', 'dist');
    app.use(express.static(clientPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running at http://localhost:${PORT}`);
      console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
