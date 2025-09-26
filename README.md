# MARC - My AI Renumeration Consultant

🚀 **智能薪酬分析平台** - 基于海量招聘数据的AI薪酬咨询服务

[![Deploy to GitHub Pages](https://github.com/leoyyang/marc.github.io/workflows/Deploy%20MARC%20to%20GitHub%20Pages/badge.svg)](https://github.com/leoyyang/marc.github.io/actions)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](https://leoyyang.github.io/marc.github.io/)

## 🎯 项目简介

MARC是一个现代化的薪酬分析平台，为求职者和HR提供精准的薪酬洞察服务。基于海量真实招聘数据，通过AI算法提供个性化的薪酬分析和优化建议。

### ✨ 核心功能

#### 👤 求职者功能
- **薪酬范围查询** - 根据职位、地点、经验等条件查询薪酬水平
- **市场趋势分析** - 实时薪酬趋势和发展预测
- **职业发展建议** - 基于数据的职业规划建议

#### 🏢 HR功能
- **智能招聘助手** - 薪酬推荐和多平台发布模拟
- **薪酬体系评估** - 导入工资单数据进行市场对标
- **优化方案生成** - 个性化的员工调薪建议

## 🛠️ 技术栈

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router DOM
- **Charts**: Chart.js + React Chart.js 2
- **State**: Zustand
- **Icons**: Heroicons + Lucide React
- **Deployment**: GitHub Pages + GitHub Actions

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 8+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/leoyyang/marc.github.io.git
cd marc.github.io

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 构建部署

```bash
# 类型检查 + 构建
npm run build:prod

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
marc-salary-consultant/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── charts/         # 图表组件
│   │   ├── insights/       # 洞察面板
│   │   └── layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── hr/            # HR模块页面
│   │   ├── HomePage.tsx    # 首页
│   │   ├── QueryPage.tsx   # 查询页面
│   │   └── ResultsPage.tsx # 结果页面
│   ├── stores/             # 状态管理
│   ├── data/              # 数据生成器
│   ├── styles/            # 样式文件
│   └── App.tsx            # 应用入口
├── public/                # 静态资源
├── .github/workflows/     # GitHub Actions
└── dist/                 # 构建输出
```

## 🎨 设计系统

### 颜色规范
```css
/* DSP品牌色 */
--dsp-red: #dc2626;
--dsp-dark: #1f2937;
--dsp-gray: #6b7280;

/* 功能色 */
--blue: #2563eb;    /* 求职者主题 */
--green: #059669;   /* 成功状态 */
--orange: #ea580c;  /* 警告状态 */
--purple: #7c3aed;  /* 特殊功能 */
```

### 组件规范
- **卡片**: `rounded-3xl` + `border-2` + `shadow-lg`
- **按钮**: `rounded-xl` + 悬停效果 + 图标组合
- **输入框**: `rounded-xl` + focus ring + 图标标识

## 🔧 部署配置

### GitHub Pages 自动部署

项目配置了GitHub Actions自动部署，推送到`main`分支时自动触发：

1. **类型检查** - TypeScript编译检查
2. **构建项目** - Vite生产构建
3. **部署到Pages** - 自动发布到GitHub Pages

### 环境变量
```bash
# Vite配置
VITE_BASE_URL=/marc.github.io/
```

## 📊 性能优化

- **代码分割**: 按路由和功能模块分割
- **资源优化**: 图片压缩、字体优化
- **缓存策略**: 静态资源长期缓存
- **懒加载**: 组件和路由懒加载

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Digital Science Platform](https://www.digitalscienceplatform.com/) - 设计规范支持
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Chart.js](https://www.chartjs.org/) - 图表库

---

⭐ 如果这个项目对您有帮助，请给它一个星标！