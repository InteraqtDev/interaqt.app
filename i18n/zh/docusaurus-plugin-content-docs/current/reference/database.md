# Database

Interaqt 会根据你的实体、关系等数据信息为你自动生成数据库表结构。
Interaqt 目前支持三种数据库：
- PostgreSQL
- SQLite
- MySQL

我们在创建 System 的时候可以指定数据库类型，例如：

```typescript
import {MonoSystem, Controller, startServer, PostgreSQLDB} from 'interaqt/runtime'
// 在这里初始化数据库。在这里替换成你的数据库信息
const db = new PostgreSQLDB('myapp', {
    host:'localhost',
    port:5432,
    user: 'YOUR_USER_NAME',
    password: 'YOUR_PASSWORD'
})
// 作为第一个参数传入 System
const system = new MonoSystem(db)
const controller = new Controller(system, [], [], [], [], [])
startServer(controller,  {
    port: 8082,
    parseUserId: async (headers) => {
        // 鉴权
    }
})
```

# PostgreSQL

PostgreSQL 的类型定义如下

```typescript
export class PostgreSQLDB implements Database{
    constructor(
        public database: string,
        public config: Config
    ) {}
}

interface Config {
    user: string | undefined;
    password: string | (() => string | Promise<string>) | undefined;
    port: number | undefined;
    host: string | undefined;
    connectionString?: string | undefined;
    keepAlive?: boolean | undefined;
    statement_timeout?: false | number | undefined;
    ssl?: boolean | ConnectionOptions | undefined;
    query_timeout?: number | undefined;
}
```

# SQLite

SQLite 的类型定义如下

```typescript
export class SQLiteDB implements Database{
    constructor(
        public database: string,
        public config: Config
    ) {}
}

interface Config {
    timeout?: number | undefined;
}
```

# MySQL

MySQL 的类型定义如下

```typescript
export class MySQLDB implements Database{
    constructor(
        public database: string,
        public config: Config
    ) {}
}

interface Config {
    user: string | undefined;
    password: string;
    port: number | undefined;
    host: string | undefined;
    connectTimeout?: number;
}
```