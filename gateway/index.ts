import { ApolloGateway } from '@apollo/gateway';
import { readFileSync } from 'fs';
import { join } from 'node:path';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from '@apollo/server';

const supergraphSdl = readFileSync('supergraph.graphql').toString();

const gateway = new ApolloGateway({
    debug: true,
    supergraphSdl,
});

const server = new ApolloServer({
  gateway,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);