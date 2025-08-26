import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { OPENROUTER_CONFIG, SYSTEM_PROMPT, INTENT_CONFIG } from './config.js'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', content: '你好！我是你的AI助手，有什么可以帮助你的吗？' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 意图识别函数
  const detectIntent = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // 使用配置文件中的导航关键词
    for (const [keyword, page] of Object.entries(INTENT_CONFIG.navigationKeywords)) {
      if (lowerMessage.includes(keyword)) {
        return { type: 'navigation', page }
      }
    }

    return { type: 'chat', page: null }
  }

  // 处理导航意图
  const handleNavigationIntent = (page) => {
    setCurrentPage(page)
    
    // 使用配置文件中的页面确认消息
    return INTENT_CONFIG.pageMessages[page] || '页面已切换。'
  }

  const callOpenRouterAPI = async (userMessage) => {
    try {
      const response = await axios.post(
        `${OPENROUTER_CONFIG.BASE_URL}/chat/completions`,
        {
          model: OPENROUTER_CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: OPENROUTER_CONFIG.MAX_TOKENS,
          temperature: OPENROUTER_CONFIG.TEMPERATURE
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'My AI Assistant App'
          }
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('OpenRouter API调用失败:', error)
      if (error.response?.status === 401) {
        return 'API密钥无效，请检查你的OpenRouter API密钥配置。'
      } else if (error.response?.status === 429) {
        return '请求过于频繁，请稍后再试。'
      } else {
        return '抱歉，我暂时无法回答，请稍后再试。'
      }
    }
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = inputMessage.trim()
      
      // 添加用户消息
      const newUserMessage = {
        id: messages.length + 1,
        type: 'user',
        content: userMessage
      }
      setMessages(prev => [...prev, newUserMessage])
      setInputMessage('')
      setIsLoading(true)

      try {
        // 首先进行意图识别
        const intent = detectIntent(userMessage)
        
        let assistantResponse = ''
        
        if (intent.type === 'navigation') {
          // 如果是导航意图，直接处理页面切换
          assistantResponse = handleNavigationIntent(intent.page)
        } else {
          // 如果是普通对话，调用LLM
          assistantResponse = await callOpenRouterAPI(userMessage)
        }
        
        // 添加助手回复
        const newAssistantMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: assistantResponse
        }
        setMessages(prev => [...prev, newAssistantMessage])
      } catch {
        // 添加错误消息
        const errorMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: '抱歉，发生了错误，请稍后再试。'
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="page-content">
            <h2>欢迎来到主页</h2>
            <p>这是一个现代化的应用界面，包含左侧导航和右侧AI助手。</p>
            <div className="feature-grid">
              <div className="feature-card">
                <h3>📋 列表管理</h3>
                <p>查看和管理你的数据列表</p>
              </div>
              <div className="feature-card">
                <h3>📄 详情查看</h3>
                <p>查看详细信息和数据</p>
              </div>
              <div className="feature-card">
                <h3>🤖 AI助手</h3>
                <p>与智能助手对话获取帮助</p>
              </div>
            </div>
          </div>
        )
      case 'list':
        return (
          <div className="page-content">
            <h2>数据列表</h2>
            <div className="list-container">
              {[1, 2, 3, 4, 5].map(item => (
                <div key={item} className="list-item">
                  <div className="item-header">
                    <h3>项目 {item}</h3>
                    <span className="status">活跃</span>
                  </div>
                  <p>这是第 {item} 个列表项目的描述信息。</p>
                  <div className="item-actions">
                    <button className="btn-secondary">查看详情</button>
                    <button className="btn-primary">编辑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'detail':
        return (
          <div className="page-content">
            <h2>详情页面</h2>
            <div className="detail-container">
              <div className="detail-section">
                <h3>基本信息</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>名称：</label>
                    <span>示例项目</span>
                  </div>
                  <div className="info-item">
                    <label>状态：</label>
                    <span className="status-badge">进行中</span>
                  </div>
                  <div className="info-item">
                    <label>创建时间：</label>
                    <span>2024-01-15</span>
                  </div>
                  <div className="info-item">
                    <label>负责人：</label>
                    <span>张三</span>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h3>详细描述</h3>
                <p>这是一个示例项目的详细描述。这里可以包含项目的详细信息、目标、进度等内容。</p>
              </div>
              <div className="detail-section">
                <h3>相关文件</h3>
                <div className="file-list">
                  <div className="file-item">
                    <span className="file-icon">📄</span>
                    <span>项目文档.pdf</span>
                  </div>
                  <div className="file-item">
                    <span className="file-icon">📊</span>
                    <span>数据报告.xlsx</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <div>页面不存在</div>
    }
  }

  return (
    <div className="app">
      {/* 左侧导航 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>我的应用</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            <span className="nav-icon">🏠</span>
            主页
          </button>
          <button 
            className={`nav-item ${currentPage === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentPage('list')}
          >
            <span className="nav-icon">📋</span>
            列表
          </button>
          <button 
            className={`nav-item ${currentPage === 'detail' ? 'active' : ''}`}
            onClick={() => setCurrentPage('detail')}
          >
            <span className="nav-icon">📄</span>
            详情页
          </button>
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="main-content">
        {renderPageContent()}
      </div>

      {/* 右侧助手对话框 */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h3>🤖 AI助手</h3>
          <div className="chat-actions">
            <button 
              className="clear-btn"
              onClick={() => setMessages([{ id: 1, type: 'assistant', content: '你好！我是你的AI助手，有什么可以帮助你的吗？' }])}
            >
              清空
            </button>
          </div>
        </div>
        
        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题或说'打开列表页'..."
            rows="3"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
