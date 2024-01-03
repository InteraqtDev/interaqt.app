# Storage

Storage 被广泛地应用在了 Condition/Attributive/SideEffect 中，当然你也可以在 Custom API 中直接使用它。
捏可以先把它简单的理解成为一个强大的 ORM 工具。
我们先看它提供的 API。

## find

| argument       | type               |required| description     |
|----------------|--------------------|---|-----------------|
| entity         | string             |true| 要查询的 record 的名字 |
| match          | BoolExp            |false| 查询条件            |
| modifier       | ModifierData       |false| 排序/分页条件         |
| attributeQuery | AttributeQueryData |false| 要查询的属性          |



### ModifierData

类型定义

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

类型定义

```typescript
export type AttributeQueryData = AttributeQueryDataItem[]

export type AttributeQueryDataRecordItem = [string, RecordQueryData, boolean?]
export type AttributeQueryDataItem = string | AttributeQueryDataRecordItem
export type RecordQueryData = {
    matchExpression?: MatchExpressionData,
    attributeQuery?: AttributeQueryData,
    modifier?: ModifierData,
    label?: string,
    goto?: string
    exit? : (data:RecursiveContext) => Promise<any>
}
```

注意，在 attributeQuery 中可以利用 `label` 和 `goto` 以及 `exit` 来构建树形数据结构的查询。


示例:
```typescript
const exit = async (context: RecursiveContext) => {
    // 退出递归地条件
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

findOne 只是 find 的一个特殊情况，它只会返回一个 record，而不是一个 record 数组。
它的参数和 find 一致，但会自动在 modifier 中添加 limit: 1。

## create

| argument       | type               | required | description     |
|----------------|--------------------|----------|-----------------|
| entity         | string             | true     | 要创建的 entity 的名字 |
| rawData        | Object             | true     | 新 entity 的数据    |

示例:
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
| entity        | string             | true     | 要更新的 entity 的名字 |
| match         | BoolExp            |false| 更新的匹配条件         |
| newRecordData | Object             | true     | 要更新的 entity 的数据 |

示例:
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
| entity        | string             | true     | 要删除的 entity 的名字 |
| match         | BoolExp            |false| 删除的匹配条件         |

示例:
```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
})
await storage.delete('User', match)
```

## getRelationName

通过 entity name 和 attribute name 来获取 relation name。

示例:
我们有一个 ownerRelation，定义如下
```typescript
const ownerRelation = Relation.create({
    sourceEntity: 'User',
    sourceProperty: 'posts',
    targetEntity: 'Post',
    targetProperty: 'owner',
    relType: '1:n',
})
```
我们可以通过 `User.posts` 或者 `Post.owner` 来获取 relation name。
示例:
```typescript
const relationName = storage.getRelationName('User', 'supervisor')
```

## findRelationByName
通过 relation name 来查询 relation。

| argument   | type               |required| description       |
|------------|--------------------|---|-------------------|
| relation   | string             |true| 要查询的 relation 的名字 |
| match      | BoolExp            |false| 查询条件              |
| modifier   | ModifierData       |false| 排序/分页条件           |
| attributeQuery | AttributeQueryData |false| 要查询的属性            |

## findOneRelationByName

findRelationByName 的特殊情况，只返回一个 relation。
它在内部调用了 findRelationByName，并在 modifier 中添加了 limit: 1。

## updateRelationByName


| argument      | type               | required | description       |
|---------------|--------------------|----------|-------------------|
| relation      | string             | true     | 要更新的 relation 的名字 |
| match         | BoolExp            |false| 更新的匹配条件           |
| newRecordData | Object             | true     | 要更新的 relation 的数据 |

## removeRelationByName

| argument | type               | required | description       |
|----------|--------------------|----------|-------------------|
| relation | string             | true     | 要删除的 relation 的名字 |
| match    | BoolExp            |false| 删除的匹配条件           |


## addRelationByNameById

| argument   | type   | required | description                 |
|------------|--------|----------|-----------------------------|
| relation   | string | true     | 要创建的 relation 的名字           |
| sourceId   | string | true     | relation source entity 的 id |
| targetId   | string | true     | relation target entity 的 id |
| properties | Object | true     | relation 上的属性数据             |

注意 ，如果 relation 的 relType 是 1:n|1:1|n:1，并且已经存在 relation，
那么在创建新的 relation 是会先自动删除冲突的 relation，保证数据始终符合 relType 定义。