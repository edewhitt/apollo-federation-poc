import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';

const typeDefs = parse(`
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0",
        import: ["@key"])

extend type Query {
  users: [User]
  user(id: ID!): User
}

type User @key(fields: "id") {
  id: ID!
  name: String
}
`);

const PORT = 2123;
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
  ).listen(PORT, () => {
    console.log(`User Federation Server ready at http://localhost:${PORT}/graphql`);
  });
}

main().catch(error => console.error(error))
