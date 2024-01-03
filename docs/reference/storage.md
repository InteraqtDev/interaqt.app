# Storage

Storage is widely used in Condition, Attributive, and SideEffect contexts, and can also be directly utilized in Custom APIs. 
It can be initially understood as a powerful ORM (Object-Relational Mapping) tool. 
Here is an overview of the APIs it offers.

## find

| argument       | type                                                 |required| description                      |
|----------------|------------------------------------------------------|---|----------------------------------|
| entity         | string                                               |true| Name of the entity to be queried |
| match          | <a href="#class-boolexp">BoolExp</a>                 |false| Query conditions                             |
| modifier       | <a href="#modifierdata">ModifierData</a>             |false| Sorting and pagination conditions                          |
| attributeQuery | <a href="#attributequerydata">AttributeQueryData</a> |false| Attributes to query                           |



### ModifierData

Type Definition:

```typescript
type ModifierData = {
    limit?: number
    offset?: number
    orderBy?: {
        [k: string]: 'ASC'|'DESC'
    },
}
```

### AttributeQueryData

Type Definition

```typescript
type AttributeQueryData = AttributeQueryDataItem[]

type AttributeQueryDataRecordItem = [string, RecordQueryData, boolean?]
type AttributeQueryDataItem = string | AttributeQueryDataRecordItem
type RecordQueryData = {
    matchExpression?: MatchExpressionData,
    attributeQuery?: AttributeQueryData,
    modifier?: ModifierData,
    label?: string,
    goto?: string
    exit? : (data:RecursiveContext) => Promise<any>
}
type MatchExpressionData = BoolExp<MatchAtom>
```

Note that within the attributeQuery, you can use `label`, `goto`, and `exit` to construct queries for tree-like data structures.

Example:
```typescript
const exit = async (context: RecursiveContext) => {
    // exit condition
}

const departmentWithChildDepts = (await storage.find('Department',
    BoolExp.atom({key: 'name', value: ['=', 'dept1']}),
    undefined,
    ['*', ['children', {
        label: 'childDept',
        attributeQuery: ['*', ['children', { goto: 'childDept', exit}]]
    }]],
))
```

## findOne

`findOne` is a special case of find. It returns only one record, instead of an array of records. 
Its parameters are consistent with `find`, but it automatically adds `limit: 1` to the modifier.

## create

| argument       | type   | required | description     |
|----------------|--------|----------|-----------------|
| entity         | string | true     | Name of the entity to create |
| rawData        | object | true     | Data for the new entity    |

Example:
```typescript
const rawData = {
    name: 'A',
    age: 18,
    isStudent: true,
}

const newUser = await storage.create('User', rawData)
```

## update

| argument      | type               | required | description     |
|---------------|--------------------|----------|-----------------|
| entity        | string             | true     | Name of the entity to update |
| match         | <a href="#class-boolexp">BoolExp</a>            |false| Match conditions for update         |
| newRecordData | object             | true     | Data for the updated entity |

Example:
```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
})
const newRecordData = {
    name: 'B',
    age: 19,
    isStudent: false,
}
const newUser = await storage.update('User', match, newRecordData)
```

## delete
| argument      | type               | required | description     |
|---------------|--------------------|----------|-----------------|
| entity        | string             | true     | Name of the entity to delete |
| match         | <a href="#class-boolexp">BoolExp</a>            |false| Match conditions for deletion        |

Example:
```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
})
await storage.delete('User', match)
```

## getRelationName

Retrieve the relation name using the entity name and attribute name.

Suppose we have an ownerRelation defined as follows:
```typescript
const ownerRelation = Relation.create({
    sourceEntity: 'User',
    sourceProperty: 'posts',
    targetEntity: 'Post',
    targetProperty: 'owner',
    relType: '1:n',
})
```
We can obtain the relation name through User.posts or Post.owner.
Example:
```typescript
const relationName = storage.getRelationName('User', 'supervisor')
```

## findRelationByName
Query a relation by its name.

| argument   | type                                 |required| description                       |
|------------|--------------------------------------|---|-----------------------------------|
| relation   | string                               |true| Name of the relation to query     |
| match      | <a href="#class=boolexp">BoolExp</a> |false| Query conditions                  |
| modifier   | <a href="#modifierdata">ModifierData</a>                         |false| Sorting and pagination conditions |
| attributeQuery | <a href="#attributequerydata">AttributeQueryData</a>                   |false| Attributes to query                            |

## findOneRelationByName

A special case of `findRelationByName`, returning only one relation. Internally, it calls `findRelationByName` and adds `limit: 1` to the modifier.

## updateRelationByName


| argument      | type               | required | description       |
|---------------|--------------------|----------|-------------------|
| relation      | string             | true     | Name of the relation to update|
| match         | <a href="#class-boolexp">BoolExp</a>            |false| Match conditions for update           |
| newRecordData | object             | true     | Data for the updated relation |

## removeRelationByName

| argument | type               | required | description       |
|----------|--------------------|----------|-------------------|
| relation | string             | true     | Name of the relation to delete |
| match    | <a href="#class-boolexp">BoolExp</a>            |false| Match conditions for deletion          |


## addRelationByNameById

| argument   | type   | required | description                       |
|------------|--------|----------|-----------------------------------|
| relation   | string | true     | Name of the relation to create    |
| sourceId   | string | true     | ID of the relation source entity  |
| targetId   | string | true     | ID of the relation target entity     |
| properties | object | true     | Attribute data on the relation              |

Note: If the relation’s `relType` is `1:n`, `1:1`, or `n:1`, and a relation already exists, 
creating a new relation will automatically delete the conflicting relation, 
ensuring the data always conforms to the `relType` definition.