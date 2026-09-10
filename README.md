# 学术个人主页部署测试

使用独立的 HTML、CSS 和 JavaScript 文件测试 GitHub Pages，无需安装依赖或构建。

- `index.html`：测试页面
- `style.css`：响应式样式
- `script.js`：资源加载状态与点击计数
- `.nojekyll`：直接发布静态文件

## 开启 GitHub Pages

在仓库 Settings → Pages → Build and deployment 中设置：

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

保存后，等待 Actions 中的 Pages 部署成功。

网站地址：https://j3z2y9.github.io/zhenyanjia/

页面应显示三项加载状态；点击“测试交互”应更新点击次数。
后续提交到 main 会自动更新网站。
