---
sidebar_position: 1
---

# Use With ChatGPT!

## 0. Preliminary Steps
1. You need access to GPT-4.
2. Ensure the latest version of [Node.js](https://nodejs.org) is installed.


It's recommended to take a quick two-minute overview of Interaqt's [core concepts](../concepts), which will aid in your subsequent usage.

## 1. Creating a Project with npx

```bash
npx create-interaqt-app myapp // myapp is your project name
cd myapp  // After successful installation, enter the project directory
```

## 2. Feed in prompts

Due to the length limit of ChatGTP Prompts, inputting a Prompt requires two steps.

### 2.1 Upload index.d.ts and Prompt-1
- Download [index.d.ts](https://raw.githubusercontent.com/InteraqtDev/interaqt/main/packages/runtime/docs/en/prompt/index.d.ts) and upload the file as an attachment.
- Paste the contents of [Prompt-1](https://raw.githubusercontent.com/InteraqtDev/interaqt/main/packages/runtime/docs/en/prompt/PROMPT.md) . 

<video width="100%" src="/use-with-gpt-1-compressed.mp4" autoplay playsinline muted controls></video>

### 2.2. Input Prompt-2
- Paste the contents of [Prompt-2](https://raw.githubusercontent.com/InteraqtDev/interaqt/main/packages/runtime/docs/en/prompt/PROMPT-2.md).

Once it completes learning, you can request ChatGPT to produce code for any system. You can use textual descriptions or upload activity diagrams.
<video width="100%" src="/use-with-gpt-2-compressed.mp4" autoplay playsinline muted controls></video>


## 3. Checking the Code Returned by ChatGPT

Sometimes ChatGPT may be lazy when returning code. At this point, you need to check whether the code it returned includes the key interactions and key data definitions you want:

- Check the "Interaction" objects created using `Interaction.create` to ensure they contain all the interactive actions you desire.
- Check the `computedData` property of key entities, relationships, and global states. `computedData` is used to express how data should change when an interaction occurs and is a core part of the system.

If anything is missing, you can directly ask for it to be supplemented.

## 4. Using ChatGPT's Code and Starting the Project

Paste the code returned by ChatGPT directly into `app/index.ts`.
Sometimes the code may have minor issues, such as:

- Missing. import of variables. Just add import statements on the top of the code.
- Use of the wrong computedData definition.

You can ask ChatGPT to fix the issues. Once all issues are fixed, your application is ready to use. You can create data and simulate interactive actions through the dashboard.

Execute the following in the myapp directory:
```bash
npm run dev
```

Start the dashboard. Open a new console and enter the myapp directory.
```bash
cd dashboard
npm start
```

In the dashboard, you can see all entities and relationships data, and create them manually. You can also simulate user interaction actions in Interaction.

Interaqt is still rapidly iterating. For any issues, feel free to create an [issue](https://github.com/InteraqtDev/interaqt/issues) on GitHub.
You are also welcome to join us.

