# COMP6080 Final Exam - Game Application

## 项目结构

这是一个基于 React 和 Vite 的单页应用,包含三个游戏和一个仪表板。

### 已完成的功能:

1. **Dashboard (仪表板)** ✅
   - 显示需要赢得的游戏数量
   - 从API获取初始分数
   - 使用localStorage持久化数据
   - Reset按钮可重置分数
   - 当分数为0时显示祝贺消息

2. **Game 1 - Guess The Number (猜数字)** ✅
   - 三个难度级别:Easy, Medium, Hard
   - 倒计时功能
   - 输入验证
   - 提示信息(太高/太低)
   - 游戏统计追踪
   - 赢得游戏后减少总分数

3. **Game 2 - Tic Tac Toe (井字棋)** ✅
   - 双人游戏
   - 胜利检测
   - 平局检测
   - 游戏统计追踪
   - 赢得游戏后减少总分数

4. **Navigation Bar (导航栏)** ✅
   - 固定在页面底部
   - 响应式设计(适配不同屏幕宽度)
   - Logo和游戏链接

5. **Stats Panel (统计面板)** ✅
   - 显示所有游戏的统计数据
   - Guess The Number的最佳分数和胜率
   - Tic Tac Toe的胜场和胜率
   - 每个游戏的游玩次数和平均时间

### 待完成:

- Game 3 - Seal The Box (目前是占位符)

## 安装和运行

1. 将所有文件放入 `src` 目录
2. 运行 `npm install` 安装依赖
3. 运行 `npm run dev` 启动开发服务器

## 文件说明

### 主要文件:
- `App.jsx` - 主应用组件,包含路由和导航
- `App.css` - 主应用样式
- `main.jsx` - React入口文件
- `index.html` - HTML模板

### 组件文件:
- `components/Dashboard.jsx` - 仪表板组件
- `components/GuessTheNumber.jsx` - 猜数字游戏
- `components/TicTacToe.jsx` - 井字棋游戏
- `components/SealTheBox.jsx` - Seal The Box占位符
- `components/StatsPanel.jsx` - 统计面板

### 样式文件:
每个组件都有对应的CSS文件

## 数据存储

使用 localStorage 存储以下数据:
- `gamesScore` - 需要赢得的游戏数量
- `initialScore` - 初始分数
- `guessStats` - Guess The Number统计
- `tictactoeStats` - Tic Tac Toe统计
- `sealStats` - Seal The Box统计
- `allGameStats` - 所有游戏的通用统计

## 响应式设计

- Desktop: 1800px x 800px
- Tablet: 1200px x 500px
- Mobile: 600px x 500px

导航栏会根据屏幕宽度自动调整:
- < 1400px: 缩短文字,高度80px
- < 800px: 保持缩短文字,高度60px
