# 开始

## Step1: 安装

使用 npx 创建一个新的 interaqt 应用。

```bash
npx create-interaqt-app newInteraqtApp
cd newInteraqtApp
```

进入到新创建的应用目录，你将得到如下目录结构：
```
├── app
│    └── index.ts
├── dashboard
├── data.ts
├── database.db
├── install.ts
├── package.json
├── server.ts
└── // 其他文件
```

其中
- app 目录下是你的整个应用的定义
- dashboard 是一个可选的应用管理界面
- data.ts 是你的初始化数据
- database.db 是你的 SQLite 数据库文件
- install.ts 是初始化数据库的脚本
- server.ts 是启动应用的脚本

## Step2: 使用预定义命令初始化数据库和启动项目

package.json 中已经预定好初始化数据库和启动的命令。我们可以直接使用

```bash
npm run dev  
```

你可以通过以下命令启动 dashboard 管理界面来查看所有信息

```bash
cd dashboard
npm start
```

<img src="/img/dashboard.png" style={{width:"100%",maxWidth:640}} />

<img src="/img/dashboard2.png" style={{width:"100%",maxWidth:640}} />

你可以在你项目的 `/examples` 目录中找到许多示例，将其中的内容粘贴到 `/app/index.ts` 文件中并重启项目即可进行测试。

