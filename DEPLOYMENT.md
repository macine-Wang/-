# 🚀 Vercel部署指南

## 快速部署步骤

### 1. 准备工作
确保你的代码已经推送到GitHub仓库。

### 2. 注册Vercel账号
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign up" 
3. 选择 "Continue with GitHub" 使用GitHub账号登录

### 3. 导入项目
1. 登录后点击 "New Project"
2. 选择你的GitHub仓库 `marc.github.io-main`
3. 点击 "Import"

### 4. 配置部署设置
Vercel会自动检测到这是一个Vite项目，使用默认配置即可：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. 部署
点击 "Deploy" 按钮，等待2-3分钟部署完成。

## 🎉 部署完成

部署成功后，你会得到：
- **免费域名**: `https://your-project-name.vercel.app`
- **自动HTTPS**: 免费SSL证书
- **全球CDN**: 快速访问
- **自动部署**: 每次推送代码自动更新

## 📱 访问方式

部署完成后，任何人都可以通过以下方式访问：
- 电脑浏览器
- 手机浏览器  
- 平板设备
- 全球任何地点

## 🔧 自定义域名（可选）

如果你有自己的域名：
1. 在Vercel项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置DNS记录

## 🛠 常见问题

**Q: 部署失败怎么办？**
A: 检查构建日志，通常是依赖安装问题，确保 `package.json` 正确。

**Q: 页面刷新404？**
A: 已配置 `vercel.json` 解决SPA路由问题。

**Q: 如何更新网站？**
A: 直接推送代码到GitHub，Vercel会自动重新部署。

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看Vercel部署日志
2. 检查浏览器控制台错误
3. 联系技术支持

---

🎊 **恭喜！你的智能薪酬管理工具现在可以全球访问了！**
