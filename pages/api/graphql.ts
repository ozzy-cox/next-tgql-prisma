
import "reflect-metadata";
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { buildSchemaSync } from 'type-graphql';
import prisma from '../../lib/prisma';
import { CustomUserResolver } from '../../modules/user/Resolver';
import { resolvers } from "../../prisma/generated/type-graphql";
import NextCors from "nextjs-cors";
import { NextApiHandler } from "next";

export const schema = buildSchemaSync({
  resolvers: [
    ...resolvers,
    CustomUserResolver
  ],
  // authChecker: customAuthChecker,
  authMode: "null",
  // This is necessary for latest class validator version
  validate: { forbidUnknownValues: false },
  emitSchemaFile: "schema.gql",
  // Need this because somehow the response doesnt show validation error specifics
  globalMiddlewares: [
    async ({ context, info }, next) => {
      try {
        return await next();
      } catch (err) {
        // write error to file log
        console.log(err);

        // rethrow the error
        throw err;
      }
    }
  ]
})

const server = new ApolloServer({
  schema,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async () => ({ prisma, }),
});

const graphql: NextApiHandler = async (req, res) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
  });

  await handler(req, res);
};

export default graphql;
