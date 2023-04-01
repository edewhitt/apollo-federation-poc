from pathlib import Path

from ariadne import ObjectType, load_schema_from_path
from ariadne.contrib.federation import FederatedObjectType, make_federated_schema
from typing import List

from api.models.provider import all_providers

HERE = Path(__file__).parent

query = ObjectType("Query")

user = FederatedObjectType("User")

@user.reference_resolver
def resolve_provider(_, _info, representation: dict):
    print("resolving provider reference")
    print(representation)
    provider = list(filter(lambda x: x.id == representation.get('id'), all_providers))
    return provider[0].to_dict() if provider else None


@query.field("providers")
def resolve_providers(_, __):
    return [provider.to_dict() for provider in all_providers]


type_defs = load_schema_from_path(str(HERE / "schema.graphql"))
schema = make_federated_schema(type_defs, query, user)
