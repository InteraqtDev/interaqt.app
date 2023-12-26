# Entity and Relation

## Entity

Entities and relationships are the fundamental organizational forms of data in Interaqt.
All data with "uniqueness" should be represented as entities.
For example, Product A and Product B, even if they have identical attributes, are distinct entities due to their "uniqueness".
Data lacking uniqueness, like the color of a product, should be represented as attributes.

Creating an entity is very easy:

```typescript
const UserEntity = Entity.create({
  name: 'User',
  properties: [
    Property.create({ name: 'name', type: PropertyTypes.String }),
    Property.create({ name: 'roles', type: PropertyTypes.String, collection: true }),
  ],
})
```

Note that when creating properties, you can use collection to indicate if it is a collection.

## Relation

Relations are the connections between entities, such as the hierarchical relationships between users, or the purchase relationship between a user and a product.
Relations can also have attributes to record some information about the relationship, such as the purchase time and quantity in the user-product purchase relationship.
Creating a relationship is also very easy:

```typescript
const supervisorRelation = Relation.create({
  source: UserEntity,
  sourceProperty: 'supervisor',
  target: UserEntity,
  targetProperty: 'subordinate',
  relType: 'n:1',
})
```

Here, sourceProperty and targetProperty indicate what property names we can use later to get relationship data from the source/target entity.

## Computed Data

Computed Data is a core concept in Interaqt. It describes how the entity relationships and their properties come about and how they should change.
It usually needs to be used in conjunction with the definition of Interaction. In this document, we'll quickly understand it through two examples.
For instance, many systems have a feature to "initiate some kind of request", and we need to record the relationship between the "request" and the "initiator" for later review during approval.
In traditional programming methods, we need to write the code on how to create the relationship between "request" and "initiator" in the interaction of "initiating a request".
In Interaqt, this relationship is expressed as the computed result of the corresponding Interaction, as follows:

```typescript
const requestRelation = Relation.create({
    source: UserEntity,
    sourceProperty: 'request',
    target: RequestEntity,
    targetProperty: 'from',
    relType: 'n:1',
    properties: [
        Property.create({
            name: 'createdAt',
            type: 'string'
        })
    ]
})

// Map createInteraction to the data of requestRelation
requestRelation.computedData = MapInteraction.create({
    items: [
        MapInteractionItem.create({
            interaction: sendRequestInteraction,
            map: function map(event: any) {
                return {
                    source: event.user,
                    createdAt: Date.now().toString(),
                    target: event.payload.request,
                }
            }
        }),
    ],
})
```

Thus, when sendRequestInteraction occurs, a new requestRelation data will be automatically created.

Apart from being computed based on Interaction, Computed Data can also be computed based on other states, such as based on other relations, properties, etc.
For example, a Request is only considered approved after all reviewers agree. We can define this as follows:

```typescript
// First define an approved property for Request, indicating whether it is approved
const RequestApprovedProp = Property.create({
    name: 'approved',
    type: 'boolean',
    collection: false
})

// Then define how the value of approved should change. It is essentially an Every computation based on Relation.
RequestApprovedProp.computedData = RelationBasedEvery.create({
    relation: ReviewRelation,
    match: (_, relation) => {
        return relation.approved
    }
})
```
All types of Computed Data can be found in [Computed Data](./computed-data).
You can also find more complete examples in [Quick Example](../tutorial/quick-example).
