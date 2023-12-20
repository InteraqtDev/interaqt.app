---
sidebar_position: 1
---

# Use With ChatGPT!

## 0. 前置准备：
1. 你需要能使用 GPT4。 
2. 确保安装 [Node.js](https://nodejs.org) 最新版本。 


建议先两分钟快速了解 Interaqt 的[核心概念](./concepts)，这将有助于你接下来的使用。

## 1. 使用 npx 创建项目

```bash
npx create-interaqt-app myapp // myapp 是你的项目名
cd myapp  // 安装成功后, 进入项目目录
```

## 2. Feed in prompts

因为 ChatGTP Prompt 的长度限制问题，输入 Prompt 需要分两步完成。

### 2.1 上传 index.d.ts 和 Prompt-1
- 下载 [index.d.ts](https://raw.githubusercontent.com/InteraqtDev/interaqt/main/packages/runtime/docs/zh_cn/prompt/index.d.ts)，将文件作为附件上传。
- 贴入 [Prompt-1](https://raw.githubusercontent.com/InteraqtDev/interaqt/main/packages/runtime/docs/zh_cn/prompt/PROMPT.md) 的内容。

<video width="100%" src="/use-with-gpt-1-compressed.mp4" autoplay playsinline muted controls></video>


### 2.2. 上传 Prompt-2
- 贴入 [Prompt-2](https://raw.githubusercontent.com/InteraqtDev/interaqt/main/packages/runtime/docs/zh_cn/prompt/PROMPT-2.md)。

<video width="100%" src="/use-with-gpt-2-compressed.mp4" autoplay playsinline muted controls></video>
当它完成学习，你就可以要求 ChatGPT 产出任何系统的代码了。直接使用文字描述、或者上传活动图都可以。

## 3. 检查 ChatGPT 返回给你的代码

ChatGPT 有时候在返回代码的时候会变懒。这时候你需要检查一下它返回给你的代码是否包含了
你想要的关键交互和关键的数据定义：

- 检查使用 Interaction.create 创建的“交互”对象，是否包含了你所有想要的交互动作。
- 检查关键实体、关系、全局状态的 computedData。computedData 是用来表达数据在交互发生时应该如何变化的，也是系统的核心部分。

如果发现缺失了，你可以直接叫他补充。

## 4. 使用 ChatGPT 的代码并启动项目

将 ChatGPT 返回给你的代码直接贴入 `app/index.ts` 中。
有时候代码可能有些小问题，例如：

- 未正确 import 变量。
- 使用了错误的 computedData 定义

当问题都修复之后，你的应用已经可以使用。可以通过 dashboard 来创建数据、模拟交互动作。

在 myapp 目录下执行
```bash
npm run dev
```

启动 dashboard。打开一个新的控制台，进入 `myapp`目录。
```bash
cd dashboard
npm start
```

在 dashboard 中，你可以看到所有实体、关系的数据，可以手动创建。也可以在 `Interaction` 中模拟执行用户的交互动作。

Interaqt 仍在高速迭代中，有任何问题欢迎随时在 github 上创建 [issue](https://github.com/InteraqtDev/interaqt/issues)。
也欢迎加入我们。

