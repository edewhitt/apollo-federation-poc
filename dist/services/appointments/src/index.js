import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import { parse } from 'graphql';
import { buildSubgraphSchema } from '@apollo/subgraph';
const typeDefs = parse(`
extend type Query {
  appointment(id: ID!): Appointment
  appointments: [Appointment]
}

type Appointment @key(fields: "id") {
    id: ID!
    appointmentDate: String!
    patient: User!
    provider: User!
}

type User @extends @key(fields: "id") {
  id: ID! @external
}
`);
const testData = require('./appointments.json');
async function main() {
    const schema = buildSubgraphSchema({ typeDefs, resolvers: {
            Query: {
                users: () => testData,
                user: (_, { id }) => {
                    return testData.find(x => x.id === id);
                },
            }
        } });
    createServer(createYoga({ schema })).listen(2121, () => {
        console.log('Appointments Federation Server ready at http://localhost:2121/graphql');
    });
}
main().catch(error => console.error(error));
