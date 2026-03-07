import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  Layout, FileText, Users, Image, Clapperboard,
  Play, Scissors, Download, Plus,
  MoreVertical, Clock, CheckCircle,
  Upload, Settings, ChevronRight, Sparkles, Wand2, Video,
  ArrowRight, Wand, Package, ListChecks
} from 'lucide-react'
import './App.css'

// Types
interface Project {
  id: string
  title: string
  cover: string
  episodes: number
  progress: number
  status: 'script' | 'casting' | 'scene' | 'props' | 'storyboard' | 'post' | 'completed'
  currentStep: number
  updatedAt: string
}

interface Character {
  id: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  avatar: string
  description: string
  outfits: string[]
}

interface Scene {
  id: string
  name: string
  type: 'interior' | 'exterior'
  timeOfDay: 'day' | 'night' | 'dawn' | 'dusk'
  mood: string
  thumbnail: string
}

interface Prop {
  id: string
  name: string
  description: string
  thumbnail: string
}

interface Shot {
  id: string
  number: number
  duration: number
  status: 'pending' | 'generating' | 'completed' | 'failed'
  thumbnail?: string
  scene?: string
  characters?: string[]
  prompt?: string
}

interface Episode {
  id: number
  title: string
  shots: Shot[]
}

// Sample Data
const sampleProject: Project = {
  id: '1',
  title: '霸总甜妻999次逃婚',
  cover: 'https://picsum.photos/seed/proj1/400/600',
  episodes: 12,
  progress: 45,
  status: 'storyboard',
  currentStep: 5,
  updatedAt: '2小时前'
}

const sampleCharacters: Character[] = [
  { id: '1', name: '林婉儿', role: 'protagonist', avatar: 'https://picsum.photos/seed/char1/200/200', description: '女主，28岁，干练女强人', outfits: ['https://picsum.photos/seed/outfit1a/200/200', 'https://picsum.photos/seed/outfit1b/200/200', 'https://picsum.photos/seed/outfit1c/200/200'] },
  { id: '2', name: '陆霆琛', role: 'protagonist', avatar: 'https://picsum.photos/seed/char2/200/200', description: '男主，30岁，霸道总裁', outfits: ['https://picsum.photos/seed/outfit2a/200/200', 'https://picsum.photos/seed/outfit2b/200/200'] },
  { id: '3', name: '苏晴', role: 'supporting', avatar: 'https://picsum.photos/seed/char3/200/200', description: '女二，富家千金', outfits: ['https://picsum.photos/seed/outfit3a/200/200'] },
  { id: '4', name: '赵明', role: 'antagonist', avatar: 'https://picsum.photos/seed/char4/200/200', description: '反派，商业竞争对手', outfits: ['https://picsum.photos/seed/outfit4a/200/200'] },
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

const generateShots = (episodeId: number): Shot[] => [
  { id: `${episodeId}-1`, number: 1, duration: 8, status: 'completed', thumbnail: 'https://picsum.photos/seed/shot1/200/356', scene: '总裁办公室', characters: ['林婉儿', '陆霆琛'], prompt: '参考角色图 @林婉儿_职场 @陆霆琛_西装，在 @总裁办公室_夜景 场景中...' },
  { id: `${episodeId}-2`, number: 2, duration: 15, status: 'completed', thumbnail: 'https://picsum.photos/seed/shot2/200/356', scene: '总裁办公室', characters: ['林婉儿', '陆霆琛'], prompt: '越肩镜头，男女主对视...' },
  { id: `${episodeId}-3`, number: 3, duration: 5, status: 'completed', thumbnail: 'https://picsum.photos/seed/shot3/200/356', scene: '走廊', characters: ['林婉儿'], prompt: '女主快步离开...' },
  { id: `${episodeId}-4`, number: 4, duration: 12, status: 'generating', thumbnail: 'https://picsum.photos/seed/shot4/200/356', scene: '会议室', characters: ['林婉儿', '赵明'], prompt: '商业谈判场景...' },
  { id: `${episodeId}-5`, number: 5, duration: 8, status: 'pending', scene: '电梯口', characters: ['陆霆琛'], prompt: '男主进入电梯...' },
  { id: `${episodeId}-6`, number: 6, duration: 10, status: 'pending', scene: '总裁办公室', characters: ['陆霆琛', '苏晴'], prompt: '苏晴来找陆霆琛...' },
  { id: `${episodeId}-7`, number: 7, duration: 6, status: 'pending', scene: '公司大门', characters: ['林婉儿'], prompt: '女主下班离开...' },
  { id: `${episodeId}-8`, number: 8, duration: 15, status: 'pending', scene: '停车场', characters: ['陆霆琛', '林婉儿'], prompt: '停车场相遇...' },
]

const sampleEpisodes: Episode[] = [
  { id: 1, title: '初次相遇', shots: generateShots(1) },
  { id: 2, title: '误会加深', shots: generateShots(2) },
  { id: 3, title: '真相大白', shots: generateShots(3) },
]

// Flow Steps Component
function FlowSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, label: '剧本', icon: FileText, path: '/script-studio' },
    { id: 2, label: '选角', icon: Users, path: '/casting' },
    { id: 3, label: '场景', icon: Image, path: '/scene' },
    { id: 4, label: '道具', icon: Package, path: '/props' },
    { id: 5, label: '分镜&视频生成', icon: ListChecks, path: '/storyboard' },
    { id: 6, label: '后期', icon: Scissors, path: '/post' },
    { id: 7, label: '成片', icon: Download, path: '/output' },
  ]

  return (
    <div className="flow-steps">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <Link
            to={step.path}
            className={`flow-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          >
            <span className="step-num">{step.id}</span>
            <step.icon size={16} />
            <span>{step.label}</span>
          </Link>
          {index < steps.length - 1 && <ChevronRight size={16} className="flow-arrow" />}
        </React.Fragment>
      ))}
    </div>
  )
}

import React from 'react'

// Page 1: Home/Dashboard
function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects')

  const statusMap = {
    script: { label: '剧本创作中', color: '#3b82f6' },
    casting: { label: '选角中', color: '#f59e0b' },
    scene: { label: '场景准备中', color: '#8b5cf6' },
    props: { label: '道具准备中', color: '#06b6d4' },
    storyboard: { label: '分镜&视频生成中', color: '#ec4899' },
    post: { label: '后期制作中', color: '#14b8a6' },
    completed: { label: '已完成', color: '#10b981' }
  }

  const features = [
    { icon: FileText, title: '智能剧本', desc: 'AI剧本生成与优化，支持小说转剧本' },
    { icon: Users, title: 'AI选角', desc: '智能匹配角色形象，多造型管理' },
    { icon: Image, title: '场景生成', desc: '文字描述生成场景，多视角管理' },
    { icon: ListChecks, title: '智能分镜', desc: '自动拆分镜头，提示词智能优化' },
    { icon: Wand2, title: '视频生成', desc: '多模型支持，保持角色一致性' },
    { icon: Scissors, title: '后期处理', desc: '字幕擦除，智能配音，时长调节' },
  ]

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>工作台</h1>
          <Link to="/script-studio" className="btn btn-primary">
            <Plus size={18} />新建项目
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="script-tabs" style={{ marginBottom: 24 }}>
          <button className={`script-tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>我的项目</button>
          <button className={`script-tab ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>功能亮点</button>
        </div>

        {activeTab === 'projects' && (
          <>
            {/* Current Project Flow */}
            <FlowSteps currentStep={sampleProject.currentStep} />

            <section className="project-list">
              <h2>当前项目</h2>
              <div className="projects-grid">
                <div className="project-card">
                  <div className="project-cover">
                    <img src={sampleProject.cover} alt={sampleProject.title} />
                    <span className="project-badge" style={{ background: statusMap[sampleProject.status].color }}>
                      {statusMap[sampleProject.status].label}
                    </span>
                  </div>
                  <div className="project-info">
                    <h3>{sampleProject.title}</h3>
                    <p>{sampleProject.episodes}集 · 第{sampleProject.currentStep}步</p>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${sampleProject.progress}%` }}></div>
                    </div>
                    <span className="update-time"><Clock size={14} /> {sampleProject.updatedAt}</span>
                  </div>
                  <button className="more-btn"><MoreVertical size={16} /></button>
                </div>
              </div>
            </section>

            <section className="quick-entry" style={{ marginTop:32 }}>
              <h2>快捷入口</h2>
              <div className="quick-cards">
                <Link to="/script-studio" className="quick-card">
                  <FileText size={32} />
                  <span>剧本工坊</span>
                </Link>
                <Link to="/casting" className="quick-card">
                  <Users size={32} />
                  <span>选角中心</span>
                </Link>
                <Link to="/scene" className="quick-card">
                  <Image size={32} />
                  <span>场景工坊</span>
                </Link>
                <Link to="/storyboard" className="quick-card">
                  <Clapperboard size={32} />
                  <span>分镜导演</span>
                </Link>
              </div>
            </section>
          </>
        )}

        {activeTab === 'features' && (
          <section className="features-showcase">
            <div className="features-grid">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-card">
                  <div className="feature-icon">
                    <feature.icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
            <div className="features-cta">
              <Link to="/script-studio" className="btn btn-primary btn-lg">
                立即体验 <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// Page 2: Script Studio (Refactored)
function ScriptStudio() {
  const [scriptText, setScriptText] = useState('')
  const [activeTab, setActiveTab] = useState('edit')
  const [parsedView, setParsedView] = useState(false)

  // Sample long script for demo
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

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>剧本工坊</h1>
          <div className="header-actions">
            <button className="btn btn-outline">
              <Upload size={18} />导入剧本
            </button>
            <button className="btn btn-primary" onClick={() => setParsedView(true)}>
              <Wand2 size={18} />AI智能解析
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="script-tabs">
          <button className={`script-tab ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>剧本编辑</button>
          <button className={`script-tab ${activeTab === 'novel' ? 'active' : ''}`} onClick={() => setActiveTab('novel')}>小说转剧本</button>
          {parsedView && <button className={`script-tab ${activeTab === 'parsed' ? 'active' : ''}`} onClick={() => setActiveTab('parsed')}>解析结果</button>}
        </div>

        {activeTab === 'edit' && (
          <div className="script-editor-container">
            <div className="script-editor-main">
              <div className="script-toolbar">
                <button className="btn btn-sm btn-secondary">保存剧本</button>
                <button className="btn btn-sm btn-outline">导出</button>
                <button className="btn btn-sm btn-outline">格式调整</button>
                <button className="btn btn-sm btn-outline">分集设置</button>
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
              />
            </div>

            <div className="ai-assistant-panel">
              <h3><Wand2 size={18} />AI编剧助手</h3>

              <div className="ai-tools-grid">
                <div className="ai-tool-card">
                  <h4>续写剧本</h4>
                  <p>AI根据现有剧情继续编写</p>
                </div>
                <div className="ai-tool-card">
                  <h4>优化台词</h4>
                  <p>让对白更自然流畅</p>
                </div>
                <div className="ai-tool-card">
                  <h4>增加冲突</h4>
                  <p>为剧情添加更多矛盾</p>
                </div>
                <div className="ai-tool-card">
                  <h4>情节扩展</h4>
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
                  <div className="next-step-icon"><ListChecks size={20} /></div>
                  <div className="next-step-info">
                    <h5>生成分镜</h5>
                    <p>智能拆分镜头，生成拍摄计划</p>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
                </Link>
              </div>
            </div>
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
            <h2>剧本解析结果</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>已从剧本中提取以下元素，您可以选择进入对应模块进行详细管理</p>
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

// Page 3: Casting Center
function CastingCenter() {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>选角中心</h1>
          <button className="btn btn-primary">
            <Plus size={18} />创建角色
          </button>
        </div>

        <div className="casting-layout">
          <div className="role-tabs">
            <button className="role-tab active">全部角色</button>
            <button className="role-tab">主角</button>
            <button className="role-tab">配角</button>
            <button className="role-tab">反派</button>
            <button className="role-tab">龙套</button>
          </div>

          <div className="characters-grid">
            {sampleCharacters.map(char => (
              <div
                key={char.id}
                className={`character-card ${selectedChar?.id === char.id ? 'selected' : ''}`}
                onClick={() => setSelectedChar(char)}
              >
                <div className="character-avatar">
                  <img src={char.avatar} alt={char.name} />
                  <span className={`role-badge ${char.role}`}>
                    {char.role === 'protagonist' ? '主角' : char.role === 'antagonist' ? '反派' : '配角'}
                  </span>
                </div>
                <div className="character-details">
                  <h3>{char.name}</h3>
                  <p>{char.description}</p>
                  {/* Multiple Outfits Preview */}
                  <div className="outfits-preview">
                    {char.outfits.map((outfit, idx) => (
                      <div key={idx} className={`outfit-thumb ${idx === 0 ? 'active' : ''}`}>
                        <img src={outfit} alt={`造型${idx + 1}`} />
                      </div>
                    ))}
                    <div className="outfit-thumb" style={{ border: '1px dashed var(--border)' }}>
                      <Plus size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="character-card add-new">
              <Plus size={48} />
              <span>创建新角色</span>
            </div>
          </div>
        </div>

        {/* Character Detail Panel - Shows when a character is selected */}
        {selectedChar && (
          <div className="character-detail-panel">
            <div className="detail-header">
              <h3>角色详情 - {selectedChar.name}</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setSelectedChar(null)}>关闭</button>
            </div>

            <div className="detail-content">
              {/* Current Image */}
              <div className="detail-section">
                <h4>当前形象</h4>
                <div className="current-image">
                  <img src={selectedChar.avatar} alt={selectedChar.name} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 12 }} />
                </div>
              </div>

              {/* Add New Outfit - Three Ways */}
              <div className="detail-section">
                <h4>添加新造型</h4>
                <div className="add-outfit-tabs">
                  <button className="add-outfit-tab active">
                    <Wand2 size={16} /> AI生成
                  </button>
                  <button className="add-outfit-tab">
                    <Image size={16} /> 资产库
                  </button>
                  <button className="add-outfit-tab">
                    <Upload size={16} /> 本地上传
                  </button>
                </div>

                {/* AI Generate */}
                <div className="add-outfit-content">
                  <textarea
                    className="ai-prompt-input large"
                    placeholder="描述你想要的人物形象，如：25岁女性，短发，穿职业装，表情冷峻..."
                  />
                  <button className="btn btn-primary" style={{ marginTop: 12, width: '100%' }}>
                    <Sparkles size={16} /> 生成新形象
                  </button>
                </div>

                {/* Asset Library - Hidden by default, shown when tab selected */}
                <div className="asset-library" style={{ display: 'none' }}>
                  <div className="asset-grid">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="asset-item">
                        <img src={`https://picsum.photos/seed/asset${i}/100/100`} alt="资产" />
                        <span>选择</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Upload - Hidden by default */}
                <div className="local-upload" style={{ display: 'none' }}>
                  <div className="upload-zone-large">
                    <Upload size={32} />
                    <span>拖拽图片或点击上传</span>
                    <span className="hint">支持 JPG、PNG 格式</span>
                  </div>
                </div>
              </div>

              {/* Existing Outfits */}
              <div className="detail-section">
                <h4>已有造型 ({selectedChar.outfits.length})</h4>
                <div className="outfits-list">
                  {selectedChar.outfits.map((outfit, idx) => (
                    <div key={idx} className="outfit-row">
                      <img src={outfit} alt={`造型${idx+1}`} />
                      <div className="outfit-info">
                        <span>造型 {idx+1}</span>
                        <button className="btn-link">设为主形象</button>
                      </div>
                      <button className="btn-icon"><MoreVertical size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="detail-section">
                <h4><Wand2 size={14} /> 为您推荐</h4>
                <p className="hint">根据角色特征推荐的相似形象</p>
                <div className="ai-recommends">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="recommend-card">
                      <img src={`https://picsum.photos/seed/rec${i}/80/80`} alt="推荐" />
                      <span className="similarity">{95-i*5}% 相似</span>
                      <button className="btn btn-sm btn-outline">使用</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Link to Next Step */}
        <div style={{ marginTop: 32 }}>
          <Link to="/scene" className="next-step-item" style={{ maxWidth: 400 }}>
            <div className="next-step-icon" style={{ background: 'var(--purple)' }}><Image size={20} /></div>
            <div className="next-step-info">
              <h5>前往场景工坊</h5>
              <p>确定拍摄场景</p>
            </div>
            <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
          </Link>
        </div>
      </main>
    </div>
  )
}

// Page 4: Scene Workshop
function SceneWorkshop() {
  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>场景工坊</h1>
          <button className="btn btn-primary">
            <Plus size={18} />创建场景
          </button>
        </div>

        <div className="scene-filters">
          <button className="filter-btn active">全部</button>
          <button className="filter-btn">室内</button>
          <button className="filter-btn">室外</button>
          <button className="filter-btn">日景</button>
          <button className="filter-btn">夜景</button>
        </div>

        <div className="scenes-grid">
          {sampleScenes.map(scene => (
            <div key={scene.id} className="scene-card">
              <div className="scene-thumbnail">
                <img src={scene.thumbnail} alt={scene.name} />
                <div className="scene-overlay">
                  <button className="btn btn-sm">编辑</button>
                  <button className="btn btn-sm">多视角</button>
                </div>
              </div>
              <div className="scene-info">
                <h3>{scene.name}</h3>
                <div className="scene-tags">
                  <span className="tag">{scene.type === 'interior' ? '室内' : '室外'}</span>
                  <span className="tag">{scene.timeOfDay === 'day' ? '日' : scene.timeOfDay === 'night' ? '夜' : scene.timeOfDay === 'dusk' ? '黄昏' : '黎明'}</span>
                  <span className="tag">{scene.mood}</span>
                </div>
                <div className="scene-views">
                  <span>全景</span>
                  <span>特写</span>
                  <span>反打</span>
                </div>
              </div>
            </div>
          ))}
          <div className="scene-card add-new">
            <Plus size={48} />
            <span>创建新场景</span>
          </div>
        </div>

        {/* Quick Link to Props */}
        <div style={{ marginTop: 32 }}>
          <Link to="/props" className="next-step-item" style={{ maxWidth: 400 }}>
            <div className="next-step-icon" style={{ background: 'var(--purple)' }}><Package size={20} /></div>
            <div className="next-step-info">
              <h5>前往道具管理</h5>
              <p>管理剧中的道具物品</p>
            </div>
            <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
          </Link>
        </div>
      </main>
    </div>
  )
}

// Props Page (New)
function PropsPage() {
  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>道具管理</h1>
          <button className="btn btn-primary">
            <Plus size={18} />添加道具
          </button>
        </div>

        <div className="props-grid">
          {sampleProps.map(prop => (
            <div key={prop.id} className="prop-card">
              <img src={prop.thumbnail} alt={prop.name} />
              <h4>{prop.name}</h4>
              <p>{prop.description}</p>
            </div>
          ))}
          <div className="prop-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, border: '2px dashed var(--border)', cursor: 'pointer' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Plus size={32} />
              <p>添加道具</p>
            </div>
          </div>
        </div>

        {/* Quick Link to Storyboard */}
        <div style={{ marginTop: 32 }}>
          <Link to="/storyboard" className="next-step-item" style={{ maxWidth: 400 }}>
            <div className="next-step-icon" style={{ background: 'var(--purple)' }}><ListChecks size={20} /></div>
            <div className="next-step-info">
              <h5>前往分镜导演台</h5>
              <p>生成分镜和拍摄计划</p>
            </div>
            <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
          </Link>
        </div>
      </main>
    </div>
  )
}

// Page 5: Storyboard Director (Core - Refactored)
function StoryboardDirector() {
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [selectedShot, setSelectedShot] = useState(sampleEpisodes[0].shots[3])
  const [promptText, setPromptText] = useState('')
  const [continuityRef, setContinuityRef] = useState<string | null>(null)
  const [promptStyle, setPromptStyle] = useState('natural')
  const [videoModel, setVideoModel] = useState('seedance')
  const [videoGenMode, setVideoGenMode] = useState('seedance')

  const currentEpisode = sampleEpisodes.find(e => e.id === selectedEpisode) || sampleEpisodes[0]
  const previousShot = currentEpisode.shots.find(s => s.number === selectedShot.number - 1)

  // Generate full prompt - 移除机位和运镜
  const generateFullPrompt = () => {
    return `场景：总裁办公室（夜景）
角色：林婉儿（职场造型）、陆霆琛（西装）
${promptText}`
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>分镜导演台</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>视频生成模式：</label>
            <select
              value={videoGenMode}
              onChange={(e) => setVideoGenMode(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)', fontSize: 13, minWidth: 160 }}
            >
              <option value="seedance">Seedance 2.0 (全能参考)</option>
              <option value="wan">Wan 2.6 (首帧图生成)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, minHeight: 'calc(100vh - 140px)' }}>
          {/* Left: Episode & Shot List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Episode Selector */}
            <div className="card" style={{ padding: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>选择集数</label>
              <select
                value={selectedEpisode}
                onChange={(e) => {
                  setSelectedEpisode(Number(e.target.value))
                  setSelectedShot(sampleEpisodes[Number(e.target.value) - 1].shots[0])
                }}
                style={{ width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#f8fafc', fontSize: 14, cursor: 'pointer' }}
              >
                {sampleEpisodes.map(ep => (
                  <option key={ep.id} value={ep.id}>第{ep.id}集：{ep.title}</option>
                ))}
              </select>
            </div>

            {/* Shot Timeline */}
            <div className="card" style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>镜头序列（共{currentEpisode.shots.length}个）</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm" style={{ background: 'var(--bg-input)', color: 'var(--text)' }}>
                    <Play size={14} style={{ marginRight: 4 }} />连续播放预览
                  </button>
                  <button className="btn btn-sm btn-primary">批量生成</button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {currentEpisode.shots.map(shot => (
                  <div
                    key={shot.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: 10,
                      background: selectedShot.id === shot.id ? 'rgba(99,102,241,0.15)' : 'var(--bg-input)',
                      borderRadius: 8,
                      marginBottom: 8,
                      cursor: 'pointer',
                      border: `2px solid ${selectedShot.id === shot.id ? 'var(--primary)' : 'transparent'}`,
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      setSelectedShot(shot)
                      setPromptText('')
                      setContinuityRef(null)
                    }}
                  >
                    <div style={{ width: 80, height: 48, background: 'linear-gradient(135deg,#334155,#475569)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {shot.status === 'completed' ? <CheckCircle size={18} style={{ color: 'var(--success)' }} /> : shot.status === 'generating' ? <div className="spinner" style={{ width: 16, height: 16 }}></div> : <span style={{ fontSize: 16, fontWeight: 600 }}>{shot.number}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>镜头 #{shot.number}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{shot.duration}秒</div>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: shot.status === 'completed' ? 'rgba(16,185,129,0.2)' : shot.status === 'generating' ? 'rgba(245,158,11,0.2)' : 'rgba(148,163,184,0.2)', color: shot.status === 'completed' ? 'var(--success)' : shot.status === 'generating' ? 'var(--warning)' : 'var(--text-muted)' }}>
                        {shot.status === 'completed' ? '已完成' : shot.status === 'generating' ? '生成中' : '待生成'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Shot Editor - Two Column Layout */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>镜头 #{selectedShot.number}</h2>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedShot.duration}秒 · {selectedShot.scene}</span>
              </div>
            </div>

            {/* Two Column Layout: Video Left, Config Right */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, overflow: 'hidden' }}>
              {/* Left Column: Video Preview */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selectedShot.thumbnail ? (
                    <img src={selectedShot.thumbnail} alt={`镜头${selectedShot.number}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Play size={48} />
                      <div style={{ marginTop: 8 }}>视频预览区</div>
                    </div>
                  )}
                  {/* Generating Overlay */}
                  {selectedShot.status === 'generating' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                      <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                      <span style={{ color: 'white', fontSize: 16 }}>AI正在生成视频...</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>预计剩余 45 秒</span>
                    </div>
                  )}
                </div>
                {/* Video Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-primary">
                    <Wand2 size={16} />生成视频
                  </button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }}>字幕擦除</button>
                    <button className="btn btn-secondary" style={{ flex: 1 }}>视频裁剪</button>
                  </div>
                  <button className="btn btn-secondary">变速调节</button>
                </div>
              </div>

              {/* Right Column: Configuration - Scrollable */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                {/* Script Section */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> 剧本原文</h3>
                  <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                    "林婉儿愤怒地将文件摔在桌上，陆霆琛一把抓住她的手腕，眼神冷冽地看着她..."
                  </div>
                </div>

                {/* Prompt Section - with Model Selection and Settings */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Wand2 size={16} /> 生成设置</h3>

                  {/* Model Selection */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>视频生成模型</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div
                        onClick={() => setVideoModel('seedance')}
                        style={{ flex: 1, padding: 14, background: videoModel === 'seedance' ? 'var(--primary)' : 'var(--bg-input)', borderRadius: 8, cursor: 'pointer', border: `2px solid ${videoModel === 'seedance' ? 'var(--primary)' : 'transparent'}` }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: videoModel === 'seedance' ? 'white' : 'var(--text)' }}>Seedance 2.0</div>
                        <div style={{ fontSize: 12, color: videoModel === 'seedance' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>全能参考模式</div>
                      </div>
                      <div
                        onClick={() => setVideoModel('wan')}
                        style={{ flex: 1, padding: 14, background: videoModel === 'wan' ? 'var(--primary)' : 'var(--bg-input)', borderRadius: 8, cursor: 'pointer', border: `2px solid ${videoModel === 'wan' ? 'var(--primary)' : 'transparent'}` }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: videoModel === 'wan' ? 'white' : 'var(--text)' }}>Wan 2.6</div>
                        <div style={{ fontSize: 12, color: videoModel === 'wan' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>首帧图生成</div>
                      </div>
                    </div>
                  </div>

                  {/* Prompt Settings - with AI Optimize Button */}
                  <div style={{ background: 'var(--bg-input)', padding: 16, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>提示词写法</label>
                        <select
                          value={promptStyle}
                          onChange={(e) => setPromptStyle(e.target.value)}
                          style={{ padding: '8px 12px', background: '#1e293b', border: '1px solid #475569', borderRadius: 6, color: '#f8fafc', fontSize: 13, minWidth: 160, cursor: 'pointer' }}
                        >
                          <option value="natural">自然语言表示</option>
                          <option value="natural_timeline">自然语言 + 精确时间线</option>
                          <option value="detailed">详细描述</option>
                          <option value="detailed_timeline">详细描述 + 精确时间线</option>
                          <option value="simple">简短提示</option>
                        </select>
                      </div>
                      <button className="btn btn-sm btn-primary"><Wand size={14} /> AI优化提示词</button>
                    </div>
                    <textarea
                      style={{ width: '100%', minHeight: 80, padding: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, lineHeight: 1.6, resize: 'vertical' }}
                      value={promptText || generateFullPrompt()}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="输入生成提示词，或使用AI优化自动生成..."
                    />
                  </div>
                </div>

                {/* Reference Materials */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Image size={16} /> 参考素材</h3>

                  {/* Continuity Reference */}
                  {previousShot && (
                    <div style={{ marginBottom: 16, padding: 16, background: 'var(--bg-input)', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>镜头连续性参考</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>使用上一镜头的尾帧/尾片保持画面连贯</div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div
                          style={{ flex: 1, padding: 10, background: continuityRef === 'frame' ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)', borderRadius: 8, cursor: 'pointer', border: `2px solid ${continuityRef === 'frame' ? 'var(--primary)' : 'transparent'}` }}
                          onClick={() => setContinuityRef('frame')}
                        >
                          <div style={{ height: 40, background: 'linear-gradient(135deg,#334155,#475569)', borderRadius: 6, marginBottom: 6 }}></div>
                          <div style={{ fontSize: 11, textAlign: 'center' }}>尾帧图</div>
                        </div>
                        <div
                          style={{ flex: 1, padding: 10, background: continuityRef === 'video' ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)', borderRadius: 8, cursor: 'pointer', border: `2px solid ${continuityRef === 'video' ? 'var(--primary)' : 'transparent'}` }}
                          onClick={() => setContinuityRef('video')}
                        >
                          <div style={{ height: 40, background: 'linear-gradient(135deg,#334155,#475569)', borderRadius: 6, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={16} /></div>
                          <div style={{ fontSize: 11, textAlign: 'center' }}>尾片(1秒)</div>
                        </div>
                        <div
                          style={{ flex: 1, padding: 10, background: continuityRef === null ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)', borderRadius: 8, cursor: 'pointer', border: `2px solid ${continuityRef === null ? 'var(--primary)' : 'transparent'}` }}
                          onClick={() => setContinuityRef(null)}
                        >
                          <div style={{ height: 40, background: 'var(--bg-dark)', borderRadius: 6, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}></div>
                          <div style={{ fontSize: 11, textAlign: 'center' }}>不使用</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Character & Scene References */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>角色参考</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#334155,#475569)', borderRadius: 8 }}></div>
                        <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#334155,#475569)', borderRadius: 8 }}></div>
                        <div style={{ width: 50, height: 50, border: '2px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>场景参考</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#334155,#475569)', borderRadius: 8 }}></div>
                        <div style={{ width: 50, height: 50, border: '2px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</div>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, display: 'block' }}>动作参考</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: 50, height: 50, background: 'var(--bg-input)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={16} /></div>
                        <div style={{ width: 50, height: 50, border: '2px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Page 6: Generation Queue
function GenerationQueue() {
  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>生成队列</h1>
          <div className="queue-stats">
            <span className="stat">
              <span className="stat-num">2</span>进行中
            </span>
            <span className="stat">
              <span className="stat-num">2</span>等待中
            </span>
            <span className="stat completed">
              <span className="stat-num">2</span>已完成
            </span>
          </div>
        </div>

        <div className="queue-list">
          <div className="queue-header">
            <span>任务ID</span>
            <span>镜头</span>
            <span>状态</span>
            <span>进度</span>
            <span>创建时间</span>
            <span>操作</span>
          </div>
          {[
            { id: '1', shot: 4, status: 'processing', progress: 67 },
            { id: '2', shot: 5, status: 'queued', progress: 0 },
            { id: '3', shot: 6, status: 'queued', progress: 0 },
            { id: '4', shot: 2, status: 'completed', progress: 100 },
            { id: '5', shot: 3, status: 'completed', progress: 100 },
          ].map(task => (
            <div key={task.id} className={`queue-item ${task.status}`}>
              <span className="task-id">#{task.id}</span>
              <span className="task-shot">镜头 #{task.shot}</span>
              <span className={`task-status ${task.status}`}>
                {task.status === 'processing' && <div className="status-dot"></div>}
                {task.status === 'queued' && '等待中'}
                {task.status === 'processing' && '生成中'}
                {task.status === 'completed' && <><CheckCircle size={14} /> 完成</>}
              </span>
              <div className="task-progress">
                <div className="progress-bar small">
                  <div className="progress" style={{ width: `${task.progress}%` }}></div>
                </div>
                <span>{task.progress}%</span>
              </div>
              <span className="task-time">10:3{task.id}:15</span>
              <div className="task-actions">
                {task.status === 'completed' && <button className="btn btn-sm btn-outline">查看</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Page 7: Post Studio
function PostStudio() {
  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>后期精修室 - 第1集</h1>
        </div>

        <div className="post-layout">
          <div className="post-preview">
            <div className="preview-player">
              <Play size={64} />
            </div>
            <div className="preview-timeline">
              <div className="timeline-marker active"></div>
              <div className="timeline-marker"></div>
              <div className="timeline-marker"></div>
              <div className="timeline-marker"></div>
            </div>
          </div>

          <div className="post-tools">
            <div className="tool-section">
              <h3><Clock size={16} /> 时长调节</h3>
              <div className="tool-options">
                <button className="tool-btn active">视频延长</button>
                <button className="tool-btn">变速调节</button>
                <button className="tool-btn">片段拼接</button>
                <button className="tool-btn">画面截取</button>
              </div>
            </div>

            <div className="tool-section">
              <h3><FileText size={16} /> 字幕处理</h3>
              <div className="tool-options">
                <button className="tool-btn active">字幕擦除</button>
                <button className="tool-btn">字幕添加</button>
                <button className="tool-btn">手动字幕</button>
              </div>
            </div>

            <div className="tool-section">
              <h3><Video size={16} /> 配音处理</h3>
              <div className="tool-options">
                <button className="tool-btn active">AI原生配音</button>
                <button className="tool-btn">后期精配</button>
                <button className="tool-btn">真人配音</button>
              </div>
            </div>

            <div className="tool-section">
              <h3><Clapperboard size={16} /> 音效配乐</h3>
              <div className="sound-effects">
                <div className="effect-item">
                  <span>场景音效</span>
                  <button className="btn btn-sm btn-outline">选择</button>
                </div>
                <div className="effect-item">
                  <span>背景音乐</span>
                  <button className="btn btn-sm btn-outline">选择</button>
                </div>
                <div className="effect-item">
                  <span>特效音</span>
                  <button className="btn btn-sm btn-outline">选择</button>
                </div>
              </div>
            </div>

            <button className="btn btn-primary full-width">应用所有修改</button>
          </div>
        </div>
      </main>
    </div>
  )
}

// Page 8: Output Center
function OutputCenter() {
  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <div className="page-header">
          <h1>成片输出中心</h1>
        </div>

        <div className="output-layout">
          <div className="output-preview">
            <div className="output-video">
              <Play size={64} />
              <span>霸总甜妻999次逃婚 - 第1集</span>
            </div>
            <div className="output-meta">
              <h3>基本信息</h3>
              <div className="meta-row">
                <span>剧名：</span>
                <span>霸总甜妻999次逃婚</span>
              </div>
              <div className="meta-row">
                <span>集数：</span>
                <span>第1集 / 共12集</span>
              </div>
              <div className="meta-row">
                <span>时长：</span>
                <span>02:35</span>
              </div>
            </div>
          </div>

          <div className="output-settings">
            <div className="settings-section">
              <h3>导出设置</h3>
              <div className="setting-group">
                <label>格式</label>
                <div className="radio-group">
                  <label><input type="radio" name="format" defaultChecked /> MP4</label>
                  <label><input type="radio" name="format" /> MOV</label>
                  <label><input type="radio" name="format" /> GIF</label>
                </div>
              </div>
              <div className="setting-group">
                <label>分辨率</label>
                <div className="radio-group">
                  <label><input type="radio" name="res" /> 4K</label>
                  <label><input type="radio" name="res" defaultChecked /> 1080P</label>
                  <label><input type="radio" name="res" /> 720P</label>
                </div>
              </div>
              <div className="setting-group">
                <label>比例</label>
                <div className="radio-group">
                  <label><input type="radio" name="ratio" defaultChecked /> 竖屏 9:16</label>
                  <label><input type="radio" name="ratio" /> 横屏 16:9</label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>元数据</h3>
              <div className="setting-group">
                <label>标题</label>
                <input type="text" placeholder="视频标题" />
              </div>
              <div className="setting-group">
                <label>封面</label>
                <div className="cover-upload">
                  <div className="cover-preview">+</div>
                  <button className="btn btn-sm btn-outline">上传</button>
                </div>
              </div>
            </div>

            <div className="export-actions">
              <button className="btn btn-primary">
                <Download size={18} />导出当前
              </button>
              <button className="btn btn-outline">批量导出</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Navigation
function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Layout, label: '工作台' },
    { path: '/script-studio', icon: FileText, label: '剧本工坊' },
    { path: '/casting', icon: Users, label: '选角中心' },
    { path: '/scene', icon: Image, label: '场景工坊' },
    { path: '/props', icon: Package, label: '道具管理' },
    { path: '/storyboard', icon: ListChecks, label: '分镜导演' },
    { path: '/queue', icon: Play, label: '生成队列' },
    { path: '/post', icon: Scissors, label: '后期精修' },
    { path: '/output', icon: Download, label: '成片输出' },
  ]

  return (
    <nav className="sidebar">
      <div className="nav-logo">
        <Sparkles size={24} />
        <span>AI Director</span>
      </div>
      <div className="nav-items">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="nav-footer">
        <Link to="/settings" className="nav-item">
          <Settings size={20} />
          <span>设置</span>
        </Link>
      </div>
    </nav>
  )
}

// Main App Content (inside Router)
function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <div className="main-wrapper">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/script-studio" element={<ScriptStudio />} />
          <Route path="/casting" element={<CastingCenter />} />
          <Route path="/scene" element={<SceneWorkshop />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/storyboard" element={<StoryboardDirector />} />
          <Route path="/queue" element={<GenerationQueue />} />
          <Route path="/post" element={<PostStudio />} />
          <Route path="/output" element={<OutputCenter />} />
        </Routes>
      </div>
    </div>
  )
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
