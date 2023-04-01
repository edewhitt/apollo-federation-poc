# apollo-federation-poc

This is an example setup for a distributed system using Apollo Federation V2.

## Running the Application

Each of the services can be run, introspected, and queried independently. I have included a `start.sh` script to make it easier to start and manage.

NOTE: You will need to install the (Apollo Router)[https://www.apollographql.com/docs/router/quickstart] to run the router and query all services at once.

The script includes the following options:
- **Start Router**: starts the Apollo Router for running dynamic queries against all services
- **Build Supergraph**: reaches out to all running services and composes the full supergraph schema
- **Start All Services**: starts the Appointments, Providers, and Users services in separate terminal instances
- **Start Appointments**: install required packages and starts the Appointments service in a new terminal instance
- **Start Providers**: install required packages in a new virtual environment and starts the Providers service in a new terminal instance
- **Start Users**: install required packages and starts the Users service in a new terminal instance

## Example Query

Each of the services can be directly queries against. The libraries used intentionally provided graphql landing pages. Here is an example multi-service query to be run against the router:

```
query {
  getAppointments {
    id
    appointmentDate
    patient {
      id
      name
    }
    provider {
      id
      name
      practice
    }
  }
}

```

## Resources

- [Federation 2 Quickstart](https://www.apollographql.com/docs/federation/quickstart/setup)
- [The Apollo Router](https://www.apollographql.com/docs/router)
- [The Rover CLI](https://www.apollographql.com/docs/rover)
- [Pyenv for Python Virtual Environments](https://github.com/pyenv/pyenv)
- [Ariadne GraphQL](https://ariadnegraphql.org/)