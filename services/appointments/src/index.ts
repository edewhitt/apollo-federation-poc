import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { parse } from 'graphql';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = parse(`
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0",
        import: ["@key"])

extend type Query {
  getAppointment(id: ID!): Appointment
  getAppointments: [Appointment]
}

type Appointment @key(fields: "id") {
    id: ID!
    appointmentDate: String!
    patient: User!
    provider: User!
}

type User @key(fields: "id") {
  id: ID!
}

union _Entity = Appointment | User
`);


const testData = require('./appointments.json');
const fetchAppointmentById = (id) => testData.find(x => x.id === id);

async function main() {
  const schema = buildSubgraphSchema({ typeDefs, resolvers: {
    Query: {
      getAppointments: () => testData,
      getAppointment: (_, { id }) => fetchAppointmentById(id),
    },
    Appointments: {
      __resolveReference(user) {
        return fetchAppointmentById(user.id);
      }
    }
  } })

  createServer(
    createYoga({ schema })
  ).listen(2121, () => {
    console.log('Appointments Federation Server ready at http://localhost:2121/graphql');
  });
}

main().catch(error => console.error(error))
