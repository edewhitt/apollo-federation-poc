const { ApolloGateway } = require('@apollo/gateway');
const { ApolloServer } = require('apollo-server-express');
const { readFileSync } = require('fs');
const { join } = require('node:path');
const { startStandaloneServer } = require('@apollo/server/standalone');

const supergraphSdl = readFileSync(join(__dirname, 'supergraph.graphql')).toString();

function buildGateway() {
  return new ApolloGateway({
    debug: true,
    supergraphSdl,
  });
}

(async () => {
  const gateway = buildGateway();
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
  });

  console.log(server);

  const { url } = startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
})();