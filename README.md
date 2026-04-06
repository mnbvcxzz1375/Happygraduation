# 毕业祝福互动页

这是一个基于 `Vue 3 + TypeScript + Vite` 的毕业祝福 H5/网页项目。页面以“放飞纸飞机”的形式串联多个回忆场景，最后落到毕业寄语卡片，适合做毕业纪念页、同学录网页、班级祝福页或个人作品展示。

## 项目特点

- 开场动画 + 纸飞机飞行转场
- 多个毕业回忆站点卡片
- 点击后展开照片墙
- 结尾毕业寄语卡片
- 支持快速替换文案、图片和主题色
- 支持部署到 Netlify

## 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本

## 安装与启动

在项目目录下执行：

```bash
npm install
npm run dev
```

启动后，按终端里显示的本地地址打开即可，通常是：

```bash
http://localhost:5173
```

## 打包构建

```bash
npm run build
```

构建完成后，产物会输出到 `dist` 目录。

如果想本地预览打包结果：

```bash
npm run preview
```

## 项目结构

```text
graduation-blessing/
├─ public/                 静态资源，适合放可直接通过路径访问的图片
├─ src/
│  ├─ assets/              源码资源
│  ├─ components/          页面组件
│  ├─ data/
│  │  └─ config.ts         核心文案和图片配置
│  ├─ App.vue              页面主入口
│  ├─ main.ts              应用入口
│  └─ style.css            全局样式
├─ netlify.toml            Netlify 部署配置
├─ package.json
└─ README.md
```

## 怎么修改文字内容

主要修改文件：

```text
src/data/config.ts
```

里面最重要的两个部分是：

1. `stops`
2. `finalCard`

### `stops` 是什么

`stops` 代表纸飞机途经的每一个回忆站点，每个对象大致结构如下：

```ts
{
  id: 1,
  name: "教室",
  headline: "最后一节课",
  caption: "黑板上的倒计时，终于变成了零。",
  image: "/images/classroom-cover.jpg",
  images: [
    "/images/classroom-1.jpg",
    "/images/classroom-2.jpg",
    "/images/classroom-3.jpg"
  ],
  ambientColor: "#ff9a9e"
}
```

各字段含义：

- `name`：站点名称
- `headline`：卡片主标题
- `caption`：卡片描述文字
- `image`：站点卡片大图
- `images`：点击“继续飞行”前弹出的照片墙图片列表
- `ambientColor`：当前站点背景氛围色

### `finalCard` 是什么

结尾祝福卡片内容：

```ts
finalCard: {
  headline: "毕业快乐",
  message: [
    "第一段祝福",
    "第二段祝福",
    "第三段祝福"
  ],
  footer: "2026届 毕业生"
}
```

你可以自由修改标题、寄语和落款。

## 怎么修改图片

这个项目当前支持两种方式放图：

1. 直接使用网络图片地址
2. 使用本地图片路径

### 方式一：使用网络图片

直接把 `image` 或 `images` 中的值改成图片链接即可，例如：

```ts
image: "https://example.com/cover.jpg"
```

### 方式二：使用本地图片

更推荐把图片放到：

```text
public/images/
```

例如新增：

```text
public/images/classroom-cover.jpg
public/images/classroom-1.jpg
public/images/classroom-2.jpg
public/images/classroom-3.jpg
```

然后在 `src/data/config.ts` 里这样写：

```ts
image: "/images/classroom-cover.jpg",
images: [
  "/images/classroom-1.jpg",
  "/images/classroom-2.jpg",
  "/images/classroom-3.jpg"
]
```

这样写的好处是最简单，不需要额外 `import`。

## 怎么增加图片

如果你只是想给某一个场景多加几张照片，只需要给对应站点的 `images` 数组继续追加路径：

```ts
images: [
  "/images/classroom-1.jpg",
  "/images/classroom-2.jpg",
  "/images/classroom-3.jpg",
  "/images/classroom-4.jpg",
  "/images/classroom-5.jpg"
]
```

照片墙会自动读取这些图片。

## 怎么增加新的场景

如果你想从 5 个场景改成 6 个、7 个或更多，只需要在 `src/data/config.ts` 的 `stops` 数组里继续新增对象，例如：

```ts
{
  id: 6,
  name: "操场看台",
  headline: "最后一次晚自习后散步",
  caption: "风从看台吹过，也把青春吹成了回忆。",
  image: "/images/stand-cover.jpg",
  images: [
    "/images/stand-1.jpg",
    "/images/stand-2.jpg",
    "/images/stand-3.jpg"
  ],
  ambientColor: "#b5ead7"
}
```

注意：

- `id` 不要重复
- `image` 最好准备一张横向封面图
- `images` 至少放 1 张，照片墙效果会更完整

## 怎么替换站点主图

每个场景卡片顶部的大图由 `image` 控制。

例如把“教室”场景主图换掉：

```ts
image: "/images/new-classroom-cover.jpg"
```

## 怎么改背景氛围色

每个站点切换时的背景色由 `ambientColor` 决定，例如：

```ts
ambientColor: "#a1c4fd"
```

你可以换成自己喜欢的颜色值。

## 部署到 Netlify

本项目已经提供 `netlify.toml`，默认配置如下：

- 构建命令：`npm run build`
- 发布目录：`dist`

### 方式一：通过 Netlify 控制台部署

1. 把代码推送到 GitHub
2. 打开 Netlify
3. 选择 `Add new project`
4. 导入 GitHub 仓库
5. 选择仓库 `Happygraduation`
6. 构建命令填写 `npm run build`
7. 发布目录填写 `dist`
8. 点击部署

### 方式二：通过 Netlify CLI 部署

先安装依赖并构建：

```bash
npm install
npm run build
```

如果本机未登录 Netlify，先登录：

```bash
npx netlify login
```

然后部署：

```bash
npx netlify deploy --prod
```

## 常见修改建议

- 想改标题和寄语：修改 `src/data/config.ts`
- 想替换照片：把图片放到 `public/images/` 后更新路径
- 想增加照片墙内容：继续往 `images` 数组追加图片
- 想增加回忆站点：给 `stops` 新增对象
- 想改整体视觉：调整组件样式和 `ambientColor`

## 许可说明

如需商用或公开发布，请确认你使用的图片、文案和音乐素材具备对应授权。
