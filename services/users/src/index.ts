import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';

const typeDefs = parse(`
type Query {
  getUsers: [User]
  getUser(id: ID!): User
}

type User @key(fields: "id") {
  id: ID!
  name: String
}
`);

const PORT = 2123;
const testData = require('./users.json');

const fetchUserById = (id) => testData.find(x => x.id === id);

async function main() {
  const schema = buildSubgraphSchema({ typeDefs, resolvers: {
    Query: {
      getUsers: () => testData,
      getUser: (_, { id }) => fetchUserById(id),
    },
    User: {
      __resolveReference(user) {
        return fetchUserById(user.id);
      }
    }
  } })

  createServer(
    createYoga({ schema })
  ).listen(PORT, () => {
    console.log(`User Federation Server ready at http://localhost:${PORT}/graphql`);
  });
}

main().catch(error => console.error(error))
