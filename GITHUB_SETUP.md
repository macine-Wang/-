# 🚀 GitHub仓库设置指南

## 步骤1：创建GitHub仓库

1. **登录GitHub**
   - 访问 [github.com](https://github.com)
   - 登录你的GitHub账号

2. **创建新仓库**
   - 点击右上角的 "+" 号
   - 选择 "New repository"
   - 仓库名称：`marc-salary-consultant` 或 `智能薪酬管理工具`
   - 设置为 **Public**（Vercel免费版需要公开仓库）
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

## 步骤2：连接本地仓库到GitHub

复制GitHub给出的命令，或者使用以下命令：

```bash
# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/marc-salary-consultant.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 步骤3：验证推送成功

- 刷新GitHub仓库页面
- 确认所有文件都已上传
- 特别检查 `vercel.json` 和 `DEPLOYMENT.md` 文件是否存在

## 🎯 下一步：Vercel部署

仓库创建成功后，就可以进行Vercel部署了！

---

**需要帮助？**
如果遇到问题，可以：
1. 检查GitHub用户名是否正确
2. 确认网络连接正常
3. 验证Git配置是否正确
