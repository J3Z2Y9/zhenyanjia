# 贾振言 · Zhenyan Jia

北京理工大学个人学术主页。原生 HTML、CSS 和 ES Modules，无需构建或安装依赖，无外部字体或脚本请求，直接部署到 GitHub Pages。

网址：https://j3z2y9.github.io/

## 功能

- 完整中英双语切换，记住语言偏好。
- 明暗主题：初次跟随系统，手动选择后记住偏好。
- Canvas 三维点图：适配像素密度，离开视口或切换标签页暂停，尊重减少动态效果设置。
- 响应式布局、移动导航、键盘焦点、跳转正文及打印样式。
- 原始 PDF 在线预览、新窗口打开及下载，预览时才加载 PDF。
- 论文、项目、研究方向及经历由资料文件驱动。

## 修改资料

编辑 **profile.js**。双语字段使用 { zh: '中文', en: 'English' }；数组为空时显示明确的占位状态。界面文案在 translations.js 中维护。

研究方向示例：

```js
research: [
  {
    title: { zh: '你的研究方向', en: 'Your research area' },
    description: { zh: '介绍研究问题与方法。', en: 'Describe research questions and methods.' },
  },
],
```

论文示例：

```js
publications: [
  {
    year: '2026',
    title: { zh: '论文标题', en: 'Paper title' },
    authors: 'Author One, Zhenyan Jia, Author Three',
    venue: { zh: '会议或期刊名称', en: 'Conference or journal' },
    links: [
      { label: { zh: '论文', en: 'Paper' }, url: 'https://example.com/paper' },
      { label: { zh: '代码', en: 'Code' }, url: 'https://github.com/your-name/your-project' },
    ],
  },
],
```

项目示例：

```js
projects: [
  {
    title: { zh: '项目标题', en: 'Project title' },
    description: { zh: '项目简介与个人贡献。', en: 'Project overview and your contribution.' },
    tags: ['Python', 'PyTorch'],
    links: [{ label: { zh: '代码', en: 'Code' }, url: 'https://github.com/your-name/your-project' }],
  },
],
```

experience 的字段为 period、institution、description，均支持双语。联系方式写入 contacts，邮箱示例：

```js
{ label: { zh: '邮箱', en: 'Email' }, detail: 'you@example.com', url: 'mailto:you@example.com' }
```

资料文本按纯文本渲染，外部链接只接受 HTTP(S)，联系方式另支持 mailto。没有填写链接的内容不会显示虚假按钮。

## 更新简历

原文件“简历-北理工计算机学院-贾振言.pdf”保持不变。覆盖同名 PDF 即可更新。
如果改名，同步修改 profile.js 的 cv 字段，以及 index.html 中 .cv-link 的回退地址。

## 本地预览

模块脚本需要通过 HTTP 打开，不要直接双击 HTML。在项目目录执行：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

打开 http://127.0.0.1:8000 。停止服务按 Ctrl+C。

## 发布

保持 Settings → Pages 为 **Deploy from a branch → main → / (root)**。
.nojekyll 保留，不需要额外构建工作流。

```powershell
git add index.html style.css script.js profile.js translations.js network.js favicon.svg README.md .nojekyll
git add -- '*.pdf'
git commit -m "Update academic homepage"
git push origin main
```

## 文件说明

| 文件 | 用途 |
| --- | --- |
| index.html | 语义结构、基础内容与 PDF 回退链接 |
| style.css | 主题、排版、响应式和打印样式 |
| profile.js | 个人资料，日常更新入口 |
| translations.js | 界面中英文文案 |
| script.js | 内容渲染、语言、主题、导航与简历预览 |
| network.js | 装饰性三维点图 |
| favicon.svg | 网站图标 |

当前只确认姓名和学校，其他资料按要求保留占位。未从简历自动抽取或扩充个人资料。
