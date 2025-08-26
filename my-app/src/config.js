// OpenRouter API配置
export const OPENROUTER_CONFIG = {
  // 请在这里替换为你的实际OpenRouter API密钥
  API_KEY: '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',
  
  // 使用的模型，可以根据需要更换
  MODEL: 'anthropic/claude-3.5-sonnet',
  
  // API端点
  BASE_URL: 'https://openrouter.ai/api/v1',
  
  // 请求配置
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7
}

// 系统提示词
export const SYSTEM_PROMPT = `你是一个有用的AI助手，请用中文回答用户的问题。

你可以帮助用户：
1. 回答各种问题
2. 提供建议和帮助
3. 解释概念和知识

如果用户想要导航到特定页面，请告诉他们可以使用以下命令：
- "打开列表页" 或 "查看列表" - 打开列表页面
- "打开主页" 或 "回到主页" - 打开主页
- "打开详情页" 或 "查看详情" - 打开详情页面

回答要简洁、准确、有帮助。`

// 意图识别配置
export const INTENT_CONFIG = {
  // 导航意图关键词
  navigationKeywords: {
    '列表': 'list',
    '列表页': 'list',
    '打开列表': 'list',
    '打开列表页': 'list',
    '查看列表': 'list',
    '显示列表': 'list',
    '列表页面': 'list',
    '主页': 'home',
    '首页': 'home',
    '打开主页': 'home',
    '回到主页': 'home',
    '返回主页': 'home',
    '主页面': 'home',
    '详情': 'detail',
    '详情页': 'detail',
    '打开详情': 'detail',
    '查看详情': 'detail',
    '详情页面': 'detail'
  },
  
  // 页面确认消息
  pageMessages: {
    'home': '好的，我已经为你打开了主页。',
    'list': '好的，我已经为你打开了列表页面。',
    'detail': '好的，我已经为你打开了详情页面。'
  }
} 