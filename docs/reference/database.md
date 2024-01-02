# Database

Interaqt automatically generates database table structures for you based on your entity and relationship data. Interaqt currently supports three types of databases:

- PostgreSQL
- SQLite
- MySQL
When creating a System, we can specify the type of database, as shown in the example below:

```typescript
import {MonoSystem, Controller, startServer, PostgreSQLDB} from 'interaqt/runtime'
// Initialize your database here. Replace with your database information.
const db = new PostgreSQLDB('myapp', {
    host:'localhost',
    port:5432,
    user: 'YOUR_USER_NAME',
    password: 'YOUR_PASSWORD'
})
// Pass it as the first argument to System
const system = new MonoSystem(db)
const controller = new Controller(system, [], [], [], [], [])
startServer(controller,  {
    port: 8082,
    parseUserId: async (headers) => {
        // ...
    }
})
```

# PostgreSQL

The type definition for PostgreSQL is as follows:

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

The type definition for SQLite is as follows:

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

The type definition for MySQL is as follows:

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