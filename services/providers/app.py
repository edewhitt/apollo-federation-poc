from typing import List
from flask import Flask, request, jsonify
from flask_cors import CORS
from ariadne import (
    load_schema_from_path,
    make_executable_schema,
    graphql_sync,
    QueryType,
)
from ariadne.explorer import ExplorerGraphiQL

from provider import Provider

type_defs = load_schema_from_path("schema.graphql")
query = QueryType()

app = Flask(__name__)
CORS(app)

all_providers: List[Provider] = [
    Provider(
        id="90f0b355-64ae-42e7-91a8-cb93e33c11e0",
        practice="Firefly Station Boston",
    ),
    Provider(
        id="4f4b37e9-c3d1-44c1-827f-4768fd987c5c",
        practice="Firefly Station UT",
    ),
]


@query.field("provider")
def resolve_provider(_, __, id):
    provider = list(filter(lambda x: x.id == id, all_providers))
    return provider[0].to_dict() if provider else None


@query.field("providers")
def resolve_providers(_, __):
    return [provider.to_dict() for provider in all_providers]


# Retrieve HTML for the GraphiQL.
# If explorer implements logic dependant on current request,
# change the html(None) call to the html(request)
# and move this line to the graphql_explorer function.
explorer_html = ExplorerGraphiQL().html(None)


@app.route("/graphql", methods=["GET"])
def graphql_explorer():
    # On GET request serve the GraphQL explorer.
    # You don't have to provide the explorer if you don't want to
    # but keep on mind this will not prohibit clients from
    # exploring your API using desktop GraphQL explorer app.
    return explorer_html, 200


schema = make_executable_schema(type_defs, query)


@app.route("/graphql", methods=["POST"])
def graphql_server():
    # GraphQL queries are always sent as POST
    data = request.get_json()

    # Note: Passing the request to the context is optional.
    # In Flask, the current request is always accessible as flask.request
    success, result = graphql_sync(
        schema, data, context_value={"request": request}, debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code


if __name__ == "__main__":
    app.run(debug=True)
