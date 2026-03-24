import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Wand2, Play, Users, Image, Package,
  ArrowRight
} from 'lucide-react'
import './App.css'

// Types (简化版)
interface Character {
  id: string
  name: string
  role: string
  avatar: string
  description: string
}

interface Scene {
  id: string
  name: string
  type: 'interior' | 'exterior'
  timeOfDay: string
  mood: string
  thumbnail: string
}

interface Prop {
  id: string
  name: string
  description: string
  thumbnail: string
}

// Sample Data (从备份中提取)
const sampleCharacters: Character[] = [
  { id: '1', name: '林婉儿', role: 'protagonist', avatar: '/images/林婉儿.jpg', description: '女主，28岁，干练女强人' },
  { id: '2', name: '陆霆琛', role: 'protagonist', avatar: '/images/陆霆琛.jpg', description: '男主，30岁，霸道总裁' },
  { id: '3', name: '苏晴', role: 'supporting', avatar: 'https://picsum.photos/seed/char3/200/200', description: '女二，富家千金' },
  { id: '4', name: '赵明', role: 'antagonist', avatar: '/images/赵明.jpg', description: '反派，商业竞争对手' },
]

const sampleScenes: Scene[] = [
  { id: '1', name: '总裁办公室', type: 'interior', timeOfDay: 'night', mood: '紧张', thumbnail: 'https://picsum.photos/seed/scene1/400/300' },
  { id: '2', name: '豪华公寓', type: 'interior', timeOfDay: 'day', mood: '温馨', thumbnail: 'https://picsum.photos/seed/scene2/400/300' },
  { id: '3', name: '公司年会', type: 'interior', timeOfDay: 'night', mood: '热闹', thumbnail: 'https://picsum.photos/seed/scene3/400/300' },
  { id: '4', name: '海边的黄昏', type: 'exterior', timeOfDay: 'dusk', mood: '浪漫', thumbnail: 'https://picsum.photos/seed/scene4/400/300' },
]

const sampleProps: Prop[] = [
  { id: '1', name: '豪华钻戒', description: '求婚用钻戒', thumbnail: 'https://picsum.photos/seed/prop1/200/200' },
  { id: '2', name: '红酒杯', description: '年会场景', thumbnail: 'https://picsum.photos/seed/prop2/200/200' },
  { id: '3', name: '笔记本电脑', description: '办公场景', thumbnail: 'https://picsum.photos/seed/prop3/200/200' },
  { id: '4', name: '豪华跑车', description: '停车场场景', thumbnail: 'https://picsum.photos/seed/prop4/200/200' },
]

// Sample script
const sampleScript = `第1集：初次相遇

[第一场] 总裁办公室-夜
（内景）

林婉儿站在落地窗前，手握文件，背对着门。
陆霆琛推门而入，西装笔挺，面色冷峻。

林婉儿：（回头）陆总，您来了。

陆霆琛：（走近）文件准备好了？
林婉儿：是的，这是收购方案的所有细节。

[第二场] 会议室-夜
（内景）

长会议桌旁，赵明坐在主位，翻看着文件。
林婉儿站在投影屏前，讲解着方案。

赵明：这个价格，不太合理吧？
林婉儿：赵总，这已经是最低价了。

[第三场] 走廊-夜
（内景）

林婉儿快步走向电梯，陆霆琛突然出现。
`

export default function OldScriptStudio() {
  const navigate = useNavigate()
  const [scriptText, setScriptText] = useState('')
  const [activeTab, setActiveTab] = useState('edit')
  const [parsedView, setParsedView] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showCustomPanel, setShowCustomPanel] = useState(false)

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>剧本工坊 (v3.2 - 旧版)</h1>
          <div className="header-actions">
            <Link to="/script-studio" className="btn btn-outline">
              返回新版
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="script-tabs">
          <button className={`script-tab ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>剧本编辑</button>
          <button className={`script-tab ${activeTab === 'novel' ? 'active' : ''}`} onClick={() => setActiveTab('novel')}>小说转剧本</button>
          {parsedView && <button className={`script-tab ${activeTab === 'parsed' ? 'active' : ''}`} onClick={() => setActiveTab('parsed')}>解析结果</button>}
        </div>

        {activeTab === 'edit' && (
          <div className="script-editor-container" style={{ display: 'flex', gap: 24 }}>
            {/* Main Editor Area */}
            <div className="script-editor-main" style={{ flex: 1 }}>
              <div className="script-toolbar">
                <button className="btn btn-sm btn-secondary">保存剧本</button>
                <button className="btn btn-sm btn-outline">导出</button>
                <button className="btn btn-sm btn-outline">格式调整</button>
                <button className="btn btn-sm btn-outline">分集设置</button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm" style={{ background: showCustomPanel ? 'var(--primary-hover)' : 'var(--primary)', color: 'white' }} onClick={() => setShowCustomPanel(!showCustomPanel)}>
                    <Wand2 size={14} /> AI自定义修改 {showCustomPanel ? '✕' : ''}
                  </button>
                </div>
              </div>
              <textarea
                className="script-textarea-large"
                placeholder="在这里编辑剧本内容...

支持格式：
[场次号] 场景-时间
（内/外景）

角色名：（动作描述）对白内容

支持长文本自动滚动..."
                value={scriptText || sampleScript}
                onChange={(e) => setScriptText(e.target.value)}
                style={{ minHeight: 'calc(100vh - 300px)' }}
              />
            </div>

            {/* Conditional Side Panel */}
            {showCustomPanel && (
              <div className="ai-assistant-panel" style={{ width: 360, flexShrink: 0, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <h3><Wand2 size={18} />AI自定义修改</h3>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>修改要求</div>
                  <textarea
                    style={{
                      width: '100%', minHeight: 120, padding: 14, background: 'var(--bg-card)',
                      border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)',
                      fontSize: 14, lineHeight: 1.6, resize: 'vertical'
                    }}
                    placeholder="请输入您的修改要求，例如：

- 把开头改成更有悬念的风格
- 增加男女主角初次相遇的冲突
- 让台词更加口语化"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>修改范围</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm" style={{ background: 'var(--primary)', color: 'white' }}>仅开头</button>
                    <button className="btn btn-sm" style={{ background: 'var(--bg-input)' }}>全剧本</button>
                    <button className="btn btn-sm" style={{ background: 'var(--bg-input)' }}>指定段落</button>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginBottom: 16 }}>
                  <Wand2 size={16} /> 执行修改
                </button>

                {/* Quick Templates */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>快速模板</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div
                      style={{ padding: 10, background: 'var(--bg-input)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                      onClick={() => setCustomPrompt('增加悬念感，让读者想知道后续发生了什么')}
                    >
                      增加悬念
                    </div>
                    <div
                      style={{ padding: 10, background: 'var(--bg-input)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                      onClick={() => setCustomPrompt('加快节奏，删除冗余描述，保持紧张感')}
                    >
                      加快节奏
                    </div>
                    <div
                      style={{ padding: 10, background: 'var(--bg-input)', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
                      onClick={() => setCustomPrompt('加入更多人物心理描写，让角色更立体')}
                    >
                      心理描写
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Assistant Panel (hidden when custom panel is shown) */}
            {!showCustomPanel && (
              <div className="ai-assistant-panel">
                <h3><Wand2 size={18} />AI编剧助手</h3>

                <div className="ai-tools-grid">
                  <div className="ai-tool-card" style={{ cursor: 'pointer' }} onClick={() => alert('AI正在优化开头，请稍候...')}>
                    <h4>开头精修 <Play size={12} style={{ marginLeft: 4, opacity: 0.6 }} /></h4>
                    <p>设计更抓人的剧本开头</p>
                  </div>
                  <div className="ai-tool-card" style={{ cursor: 'pointer' }} onClick={() => alert('AI正在续写剧本，请稍候...')}>
                    <h4>续写剧本 <Play size={12} style={{ marginLeft: 4, opacity: 0.6 }} /></h4>
                    <p>AI根据现有剧情继续编写</p>
                  </div>
                  <div className="ai-tool-card" style={{ cursor: 'pointer' }} onClick={() => alert('AI正在优化台词，请稍候...')}>
                    <h4>优化台词 <Play size={12} style={{ marginLeft: 4, opacity: 0.6 }} /></h4>
                    <p>让对白更自然流畅</p>
                  </div>
                  <div className="ai-tool-card" style={{ cursor: 'pointer' }} onClick={() => alert('AI正在增加冲突，请稍候...')}>
                    <h4>增加冲突 <Play size={12} style={{ marginLeft: 4, opacity: 0.6 }} /></h4>
                    <p>为剧情添加更多矛盾</p>
                  </div>
                  <div className="ai-tool-card" style={{ cursor: 'pointer' }} onClick={() => alert('AI正在扩展情节，请稍候...')}>
                    <h4>情节扩展 <Play size={12} style={{ marginLeft: 4, opacity: 0.6 }} /></h4>
                    <p>丰富场景和细节描写</p>
                  </div>
                </div>

                <div className="next-steps">
                  <h4>下一步操作</h4>
                  <Link to="/casting" className="next-step-item" onClick={() => setParsedView(true)}>
                    <div className="next-step-icon"><Users size={20} /></div>
                    <div className="next-step-info">
                      <h5>智能选角</h5>
                      <p>从剧本提取角色，匹配资产库形象</p>
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                  </Link>
                  <Link to="/scene" className="next-step-item" onClick={() => setParsedView(true)}>
                    <div className="next-step-icon"><Image size={20} /></div>
                    <div className="next-step-info">
                      <h5>场景推荐</h5>
                      <p>提取剧本场景，匹配或生成场景</p>
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                  </Link>
                  <Link to="/storyboard" className="next-step-item">
                    <div className="next-step-icon"><Package size={20} /></div>
                    <div className="next-step-info">
                      <h5>生成分镜</h5>
                      <p>智能拆分镜头，生成拍摄计划</p>
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'novel' && (
          <div className="script-editor-container">
            <div className="script-editor-main">
              <div className="script-toolbar">
                <button className="btn btn-sm btn-primary">开始转换</button>
                <button className="btn btn-sm btn-outline">设置转换规则</button>
              </div>
              <textarea
                className="script-textarea-large"
                placeholder="在这里粘贴小说内容，AI将自动转换为剧本格式...

支持：
- 小说原文粘贴
- 自动分场
- 角色对话提取
- 动作描写转换"
              />
            </div>
            <div className="ai-assistant-panel">
              <h3><Wand2 size={18} />转换设置</h3>
              <div style={{ padding: 16 }}>
                <div className="setting-group-inline" style={{ marginBottom: 16 }}>
                  <label>转换风格：</label>
                  <select className="setting-select">
                    <option>标准剧本格式</option>
                    <option>详细描写版</option>
                    <option>简化对白版</option>
                  </select>
                </div>
                <div className="setting-group-inline" style={{ marginBottom: 16 }}>
                  <label>场次划分：</label>
                  <select className="setting-select">
                    <option>自动根据场景</option>
                    <option>按章节</option>
                    <option>按情绪</option>
                  </select>
                </div>
                <button className="btn btn-primary full-width">开始转换</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parsed' && (
          <div className="parsing-result">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2>剧本解析结果</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>已从剧本中提取以下元素，您可以选择进入对应模块进行详细管理</p>
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: 16 }}
                onClick={() => navigate('/project/1')}
              >
                🎬 创建项目，进入制作
              </button>
            </div>
            <div className="parsing-grid">
              <Link to="/casting" className="parsing-card parsing-card-clickable">
                <h4><Users size={16} /> 人物信息 (4)</h4>
                <div className="character-list">
                  {sampleCharacters.map(char => (
                    <div key={char.id} className="character-item">
                      <img src={char.avatar} alt={char.name} />
                      <div>
                        <strong>{char.name}</strong>
                        <span>{char.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-action">
                  <span>进入选角中心</span> <ArrowRight size={14} />
                </div>
              </Link>

              <Link to="/scene" className="parsing-card parsing-card-clickable">
                <h4><Image size={16} /> 场景信息 (4)</h4>
                <div className="scene-list">
                  {sampleScenes.map(scene => (
                    <div key={scene.id} className="scene-item">
                      <img src={scene.thumbnail} alt={scene.name} />
                      <div>
                        <strong>{scene.name}</strong>
                        <span>{scene.type === 'interior' ? '室内' : '室外'} · {scene.mood}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-action">
                  <span>进入场景工坊</span> <ArrowRight size={14} />
                </div>
              </Link>

              <Link to="/props" className="parsing-card parsing-card-clickable">
                <h4><Package size={16} /> 道具信息 (4)</h4>
                <div className="prop-list">
                  {sampleProps.map(prop => (
                    <div key={prop.id} className="prop-item">
                      <img src={prop.thumbnail} alt={prop.name} />
                      <div>
                        <strong>{prop.name}</strong>
                        <span>{prop.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-action">
                  <span>进入道具管理</span> <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
