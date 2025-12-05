# 安装和使用指南

## 快速开始

### 1. 解压文件
将提供的所有文件解压到你的项目目录中。

### 2. 安装依赖
在项目根目录运行:
```bash
npm install
```

这将安装以下依赖:
- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.20.0
- Vite 5.0.8
- @vitejs/plugin-react 4.2.1

### 3. 启动开发服务器
```bash
npm run dev
```

然后在浏览器中打开显示的本地地址(通常是 http://localhost:5173)

### 4. 构建生产版本
```bash
npm run build
```

## 项目特性

### ✅ 已完成的功能

#### 1. Dashboard (仪表板)
- 显示"Choose your option from the navbar."提示
- 显示需要赢得的游戏数量(从API获取)
- Reset按钮重置分数
- 分数达到0时显示祝贺弹窗
- 使用localStorage持久化数据

#### 2. Guess The Number (猜数字游戏)
- **三个难度级别:**
  - Easy: 1-10, 20秒
  - Medium: 1-50, 30秒  
  - Hard: 1-100, 60秒
- 实时倒计时
- 输入验证(范围检查)
- 提示信息(太高/太低)
- 赢得游戏后减少总分数
- 完整的统计追踪

#### 3. Tic Tac Toe (井字棋)
- 双人对战(Player 1 vs Player 2)
- 完整的游戏逻辑(检测胜利和平局)
- 实时显示当前玩家
- 赢得游戏后减少总分数
- 完整的统计追踪

#### 4. Navigation Bar (导航栏)
- 固定在页面底部
- 包含Logo和4个游戏链接
- **响应式设计:**
  - 屏幕宽度 < 1400px: 文字缩短,高度80px
  - 屏幕宽度 < 800px: 文字保持缩短,高度60px
- 正确的样式(背景色#333,文字色#fff)

#### 5. Stats Panel (统计面板)
- 右上角固定的"Stats"按钮
- 显示所有游戏的详细统计:
  - **Guess The Number:** 每个难度的最佳分数和胜率
  - **Tic Tac Toe:** 每个玩家的胜场数和胜率
  - **Seal The Box:** 最佳分数
  - **通用统计:** 每个游戏的游玩次数和平均时间

### ⏳ 待完成

- **Game 3 - Seal The Box:** 目前是占位符,显示"Coming Soon..."

## 技术细节

### 数据持久化
所有游戏数据使用 `localStorage` 存储:
- `gamesScore` - 当前需要赢得的游戏数
- `initialScore` - 从API获取的初始分数
- `guessStats` - 猜数字游戏的统计
- `tictactoeStats` - 井字棋游戏的统计
- `allGameStats` - 所有游戏的通用统计(次数和时间)

### 响应式测试尺寸
- Desktop: 1800px × 800px
- Tablet: 1200px × 500px
- Mobile: 600px × 500px

### 路由
- `/` 或 `/dashboard` - 仪表板
- `/game/guessthenumber` - 猜数字游戏
- `/game/tictactoe` - 井字棋游戏
- `/game/sealthebox` - Seal The Box (占位符)
- `/statspanel` - 统计面板

## 开发说明

### 文件结构
```
project/
├── index.html
├── package.json
├── vite.config.js
├── PROJECT_README.md
└── src/
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    └── components/
        ├── Dashboard.jsx
        ├── Dashboard.css
        ├── GuessTheNumber.jsx
        ├── GuessTheNumber.css
        ├── TicTacToe.jsx
        ├── TicTacToe.css
        ├── SealTheBox.jsx
        ├── SealTheBox.css
        ├── StatsPanel.jsx
        └── StatsPanel.css
```

### 修改建议
1. 如需修改初始分数API,编辑 `Dashboard.jsx` 中的fetch URL
2. 如需调整游戏难度,修改 `GuessTheNumber.jsx` 中的 `difficulties` 对象
3. 如需自定义样式,修改对应的CSS文件

## 注意事项

- 确保使用最新版本的 Google Chrome 测试
- 所有游戏状态会在页面刷新后保持
- 清除浏览器localStorage会重置所有统计数据
- Stats按钮在所有页面都可见

## 问题排查

**问题: npm install 失败**
- 确保安装了 Node.js 16+ 和 npm

**问题: 页面空白**
- 检查浏览器控制台是否有错误
- 确保所有文件路径正确

**问题: 路由不工作**
- 确保使用 `npm run dev` 启动开发服务器
- 不要直接打开 index.html 文件
