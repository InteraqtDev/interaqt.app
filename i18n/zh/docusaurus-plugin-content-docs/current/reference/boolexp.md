# BoolExp

BoolExp 提供了一系列方便的 api 用来进行与或非等逻辑运算。它在以下场景中常被用到：
- 在 Interaction 中连接多个 Condition、Attributive，并使用 `boolExpToConditions` 和 `boolExpToAttributives` 转化成 Condition 和 Attributive。具体请参考 [guide/interaction](../guide/interaction)。
- 在 Storage 的 find/update/delete 中构建复杂的逻辑查询条件。具体请参考 [reference/storage](../reference/storage)。

## Static Method atom

构建一个基本的查询条件，atom 方法接受一个对象形式的查询条件。其类型定义如下:

```typescript
type AtomData = {
    key: string,
    value: [string, any],
}
```

构建一个查询条件的例子:

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
})
```

## Static Method and

接受一组查询条件对象，返回一组与逻辑的查询条件。

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

## Static Method or

接受一组查询条件对象，返回一组或逻辑的查询条件。

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

## Instance Method and

BoolExp 实例上的方法，接受一个新查询条件对象，返回一个新的与逻辑的 BoolExp 对象。

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
}).and({
    key: 'age',
    value: ['>', 18]
})
```

## Instance Method or

BoolExp 实例上的方法，接受一个新查询条件对象，返回一个新的或逻辑的 BoolExp 对象。

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
}).or({
    key: 'age',
    value: ['>', 18]
})
```

## Instance Method not

BoolExp 实例上的方法，返回一个新的非逻辑的 BoolExp 对象。

```typescript
const match = BoolExp.atom({
    key: 'id',
    value: ['=', 1]
}).not()
```