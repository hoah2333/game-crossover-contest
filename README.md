本仓库为 SCP 基金会中文分部[「2026 电子游戏竞赛」](https://scp-wiki-cn.wikidot.com/2026-cn-game-crossover-contest-hub)的展示站，使用 Next.js 构建。

## 启动开发服务器

```bash
pnpm install
pnpm dev
```

随后在浏览器中打开 [http://localhost:3000](http://localhost:3000)，查看网站预览。

## 添加翻译

所有界面文案均位于 `translation/` 目录，由 next-intl 加载。若需添加语言，请在此文件夹下创建新文件。文件名应遵守 [BCP 47 语言标签](https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag)标准。下面以添加英语 `en` 为例进行说明：

### 1. 添加文案文件

将 `translation/zh-CN.json` 拷贝一份，修改文件名为 `translation/en.json`，并对其内容进行翻译。注意形如 `{count}` 的为占位内容，请勿翻译，但可以任意调整其在句子中的顺序。

### 2. 注册语言

> 若无法理解下方的操作，亦可以仅进行文案文件的添加，后续操作由仓库维护者代劳。

在 `app/lib/i18n/routing.ts` 的 `locales` 中加入新语言。

```diff
- export const routing = defineRouting({ locales: ["zh-CN"], defaultLocale: "zh-CN" });
+ export const routing = defineRouting({ locales: ["zh-CN", "en"], defaultLocale: "zh-CN" });
```

### 3. 加载文案

在 `app/lib/i18n/request.ts` 中导入新文件，并在 `match` 中增加对应分支。

```diff
+ import en from "@/translation/en.json";
  import zhCN from "@/translation/zh-CN.json";

  const messages = match(paramValue)
    .with("zh-CN", () => zhCN)
+   .with("en", () => en)
    .otherwise(() => zhCN);
```

所有操作完成后，应可以在开发服务器的 [http://localhost:3000/en](http://localhost:3000/en) 预览你的翻译文本。
