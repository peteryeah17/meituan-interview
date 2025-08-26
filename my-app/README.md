# AI助手应用

一个现代化的Web应用，包含左侧导航、主内容区域和右侧AI助手对话框，支持智能意图识别和页面导航。

## 功能特性

- 🎨 现代化UI设计
- 📱 响应式布局
- 🤖 集成OpenRouter AI助手
- 🧠 智能意图识别
- 📋 列表和详情页面
- 💬 实时聊天功能
- 🎯 语音导航支持

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置OpenRouter API密钥：
   - 打开 `src/config.js` 文件
   - 将 `API_KEY` 替换为你的实际OpenRouter API密钥
   - 可以从 [OpenRouter](https://openrouter.ai/) 获取API密钥

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中访问 `http://localhost:5173`

## 智能意图识别

应用支持通过自然语言进行页面导航，你可以直接对AI助手说：

### 🎯 导航命令
- **"打开列表页"** - 自动切换到列表页面
- **"查看列表"** - 打开列表页面
- **"打开主页"** - 返回主页
- **"回到主页"** - 返回主页
- **"打开详情页"** - 切换到详情页面
- **"查看详情"** - 打开详情页面

### 💬 普通对话
- 除了导航命令，你还可以与AI助手进行正常对话
- 询问问题、寻求建议、获取帮助等

## API配置

在 `src/config.js` 文件中配置以下设置：

```javascript
export const OPENROUTER_CONFIG = {
  // 你的OpenRouter API密钥
  API_KEY: 'your_openrouter_api_key_here',
  
  // 使用的AI模型
  MODEL: 'anthropic/claude-3.5-sonnet',
  
  // API端点
  BASE_URL: 'https://openrouter.ai/api/v1',
  
  // 请求配置
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
}

// 意图识别配置
export const INTENT_CONFIG = {
  // 导航意图关键词
  navigationKeywords: {
    '列表': 'list',
    '列表页': 'list',
    '打开列表': 'list',
    // ... 更多关键词
  },
  
  // 页面确认消息
  pageMessages: {
    'home': '好的，我已经为你打开了主页。',
    'list': '好的，我已经为你打开了列表页面。',
    'detail': '好的，我已经为你打开了详情页面。'
  }
}
```

## 支持的模型

OpenRouter支持多种AI模型，你可以根据需要更换：

- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `openai/gpt-4o` - GPT-4o
- `google/gemini-2.0-flash-exp` - Gemini 2.0 Flash
- `meta-llama/llama-3.1-70b-instruct` - Llama 3.1 70B

## 项目结构

```
src/
├── App.jsx          # 主应用组件
├── App.css          # 样式文件
├── config.js        # API和意图识别配置
└── main.jsx         # 应用入口
```

## 技术栈

- React 19
- Vite
- Axios
- OpenRouter API
- 智能意图识别

## 使用示例

1. **页面导航**：
   - 用户输入："打开列表页"
   - 系统识别意图并自动切换到列表页面
   - AI助手回复："好的，我已经为你打开了列表页面。"

2. **普通对话**：
   - 用户输入："今天天气怎么样？"
   - 系统调用OpenRouter API获取回答
   - AI助手提供相关回答

## 注意事项

- 请确保你的OpenRouter API密钥有效且有足够的余额
- API密钥仅存储在本地配置文件中，不会上传到版本控制系统
- 建议在生产环境中使用环境变量来存储API密钥
- 意图识别功能支持多种表达方式，可以根据需要在配置文件中添加更多关键词
