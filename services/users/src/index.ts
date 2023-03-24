import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';

const typeDefs = parse(`
extend type Query {
  users: [User]
  user(id: ID!): User
}

type User @key(fields: "id") {
  id: ID!
  name: String!
}
`);

const testData = require('./users.json');

async function main() {
  const schema = buildSubgraphSchema({ typeDefs, resolvers: {
    Query: {
      users: () => testData,
      user: (_, { id }) => {
        return testData.find(x => x.id === id);
      },
    }
  } })

  createServer(
    createYoga({ schema })
  ).listen(2123, () => {
    console.log('User Federation Server ready at http://localhost:2123/graphql');
  });
}

main().catch(error => console.error(error))
