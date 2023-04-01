from ariadne.asgi import GraphQL
from api.schema import schema
import uvicorn

application = GraphQL(schema)

if __name__ == "__main__":
    uvicorn.run(application, host="0.0.0.0", port=2122)