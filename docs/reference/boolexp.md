# BoolExp

BoolExp provides a series of convenient APIs for logical operations like AND, OR, and NOT. It is commonly used in the following scenarios:

- In Interactions, to link multiple Conditions and Attributives, and then transform them into Condition and Attributive using `boolExpToConditions` and `boolExpToAttributives`. For more details, please refer to [guide/interaction](../guide/interaction).
- In Storage's find/update/delete operations to construct complex logical query conditions. For specific information, please refer to [reference/storage](../reference/storage).

## Static Method: BoolExp.atom

Constructs a basic query condition. The `atom` method accepts an AtomData object. Its type definition is as follows:

```typescript
type AtomData = {
    key: string,
    value: [string, any],
}
```

Example of constructing a query condition:

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
})
```

## Static Method: BoolExp.and

Accepts a set of query condition objects, returning a new set of query conditions with AND logic.

```typescript
const match = BoolExp.and(
    {
        key: 'age',
        value: ['>', 18]
    },
    {
        key: 'name',
        value: ['=', 'A']
    },
    {
        key: 'isStudent',
        value: ['=', true]
    },
)
```

## Static Method: BoolExp.or

Accepts a set of query condition objects, returning a new set of query conditions with OR logic.

```typescript
const match = BoolExp.or(
    {
        key: 'age',
        value: ['>', 18]
    },
    {
        key: 'name',
        value: ['=', 'A']
    },
    {
        key: 'isStudent',
        value: ['=', true]
    },
)
```

## boolExp.and

Method on the BoolExp instance, accepts a new query condition object, returning a new BoolExp object with AND logic.

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
}).and({
    key: 'age',
    value: ['>', 18]
})
```

## boolExp.or

Method on the BoolExp instance, accepts a new query condition object, returning a new BoolExp object with OR logic.

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
}).or({
    key: 'age',
    value: ['>', 18]
})
```

## boolExp.not

Method on the BoolExp instance, returns a new BoolExp object with NOT logic.

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
}).not()
```