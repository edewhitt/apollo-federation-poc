import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { createServer } from 'http'
import { join } from 'node:path';
import { createYoga } from 'graphql-yoga'


const testData = require('./users.json');

async function main() {
  // Load schema from the file
  const schema = await loadSchema(join(__dirname, './schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
  });

  // Write some resolvers
  const resolvers = {
    Query: {
      users: () => testData,
      user: (_, { id }) => {
        return testData.find(x => x.id === id);
      },
    }
  };

  // Add resolvers to the schema
  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

  const server = createServer(createYoga({
    schema: schemaWithResolvers,
  }))

  server.listen(2122, () => {
    console.log('User Federation Server ready at http://localhost:2122/graphql');
  });
}

main().catch(error => console.error(error))
