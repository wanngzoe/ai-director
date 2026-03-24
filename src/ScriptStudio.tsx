import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Upload, Wand2,
  FileText, Users, Image,
  ChevronDown, AlignLeft, Clock, Search,
  BookOpen, AlertTriangle, CheckCircle
} from 'lucide-react'
import './ScriptStudio.css'

// Types
interface Scene {
  id: string
  name: string
  location: string
  timeOfDay: string
  characters: string[]
  content: string
}

interface Character {
  id: string
  name: string
  description: string
  dialogues: number
  backstory?: string // 人物小传
}

interface ParsedScript {
  title: string
  scenes: Scene[]
  characters: Character[]
}

interface ProjectSettings {
  synopsis: string      // 梗概
  worldView: string     // 世界观
  characterBackstories: Record<string, string> // 角色小传
}

// Sample data for demo
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

赵明：（皱眉）这个价格，不太合理吧？
林婉儿：赵总，这已经是最低价了。

[第三场] 走廊-夜
（内景）

林婉儿快步走向电梯，陆霆琛突然出现。
陆霆琛：林小姐，我们还会再见面的。

[第四场] 停车场-夜
（外景）

陆霆琛坐在豪华跑车里，透过后视镜观察林婉儿离开的背影。
陆霆琛：（内心OS）有意思，这个女人很特别。
`

export default function ScriptStudio() {
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Basic state
  const [scriptText, setScriptText] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'outline' | 'parsed' | 'settings'>('outline')
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lineCount, setLineCount] = useState(0)

  // Project state
  const [hasExtracted, setHasExtracted] = useState(false)     // 是否已提取要素
  const [hasProceeded, setHasProceeded] = useState(false)    // 是否已进入下一步
  const [showReimportConfirm, setShowReimportConfirm] = useState(false)
  const [showEditWarning, setShowEditWarning] = useState(false)

  // Parsed data
  const [parsedData, setParsedData] = useState<ParsedScript | null>(null)

  // Project settings (人物小传、梗概等)
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    synopsis: '',
    worldView: '',
    characterBackstories: {}
  })

  // Parse script to extract scenes and characters
  const parseScript = useCallback((text: string) => {
    const scenes: Scene[] = []
    const characters: Map<string, Character> = new Map()

    const scenePattern = /\[第(\d+)场\]\s*(.+?)-(\w+)/g
    const characterPattern = /^[【（]?([^：\n]+)[:：]/gm
    const dialoguePattern = /([^\n]+)：([^【】]+)/g

    let match
    let lastIndex = 0
    let currentScene: Scene | null = null

    while ((match = scenePattern.exec(text)) !== null) {
      if (currentScene) {
        currentScene.content = text.slice(lastIndex, match.index).trim()
        scenes.push(currentScene)
      }

      currentScene = {
        id: match[1],
        name: match[2],
        location: match[2],
        timeOfDay: match[3],
        characters: [],
        content: ''
      }
      lastIndex = match.index + match[0].length
    }

    if (currentScene) {
      currentScene.content = text.slice(lastIndex).trim()
      scenes.push(currentScene)
    }

    while ((match = characterPattern.exec(text)) !== null) {
      const name = match[1].trim()
      if (name && !characters.has(name)) {
        characters.set(name, {
          id: name,
          name,
          description: '',
          dialogues: 0
        })
      }
    }

    while ((match = dialoguePattern.exec(text)) !== null) {
      const char = characters.get(match[1])
      if (char) {
        char.dialogues++
      }
    }

    return {
      title: '剧本',
      scenes,
      characters: Array.from(characters.values())
    }
  }, [])

  // Update line count
  useEffect(() => {
    const lines = scriptText.split('\n').length
    setLineCount(lines)
  }, [scriptText])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scriptText])

  const handleSave = () => {
    console.log('Saving script...')
  }

  // Handle analyze
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const parsed = parseScript(scriptText || sampleScript)
    setParsedData(parsed)
    setHasExtracted(true)
    setActiveTab('parsed')
    setIsAnalyzing(false)
  }

  // Handle import with logic
  const handleImport = () => {
    // If already proceeded to next stage, show warning
    if (hasProceeded) {
      alert('已进入后续制作流程，如需重新导入剧本，请先重置项目进度。')
      return
    }

    // If already extracted elements, show confirmation
    if (hasExtracted) {
      setShowReimportConfirm(true)
      return
    }

    // Otherwise, directly import
    doImport()
  }

  const doImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.fountain,.fdx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setScriptText(content)
          // Reset extracted state when importing new script
          setHasExtracted(false)
          setParsedData(null)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  // Handle script text change with warning
  const handleScriptChange = (newText: string) => {
    // If already extracted and changing significantly, show warning
    if (hasExtracted && newText !== scriptText) {
      setShowEditWarning(true)
    }
    setScriptText(newText)
  }

  // Handle reimport confirmation
  const confirmReimport = () => {
    setShowReimportConfirm(false)
    doImport()
  }

  // Handle proceed to next step
  const handleProceed = () => {
    setHasProceeded(true)
  }

  // Handle settings change
  const updateSettings = (key: keyof ProjectSettings, value: string) => {
    setProjectSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateCharacterBackstory = (charId: string, backstory: string) => {
    setProjectSettings(prev => ({
      ...prev,
      characterBackstories: { ...prev.characterBackstories, [charId]: backstory }
    }))
  }

  // Get lines for line numbers
  const lines = (scriptText || sampleScript).split('\n')

  return (
    <div className="script-studio">
      {/* Header */}
      <header className="script-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>剧本工坊</h1>
            <span className="subtitle">
              {hasExtracted ? (
                <span className="status-tag extracted">
                  <CheckCircle size={12} /> 已提取要素
                </span>
              ) : (
                <span className="status-tag draft">
                  草稿中
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-outline"
            onClick={handleImport}
            disabled={hasProceeded}
            title={hasProceeded ? '已进入后续流程，无法重导' : '导入新剧本'}
          >
            <Upload size={18} /> 导入
          </button>
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={isAnalyzing || !scriptText}>
            {isAnalyzing ? (
              <>分析中...</>
            ) : (
              <><Wand2 size={18} /> {hasExtracted ? '重新解析' : 'AI智能解析'}</>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="script-main">
        {/* Tab Navigation */}
        <div className="script-tabs">
          <button
            className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <AlignLeft size={16} /> 剧本编辑
          </button>
          <button
            className={`tab ${activeTab === 'outline' ? 'active' : ''}`}
            onClick={() => setActiveTab('outline')}
          >
            <FileText size={16} /> 大纲视图
          </button>
          <button
            className={`tab ${activeTab === 'parsed' ? 'active' : ''}`}
            onClick={() => setActiveTab('parsed')}
            disabled={!hasExtracted}
          >
            <Search size={16} /> 解析结果 {!hasExtracted && <span className="tab-badge">NEW</span>}
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <BookOpen size={16} /> 剧本设定
          </button>
        </div>

        <div className="script-content">
          {/* Sidebar - only show for edit and outline */}
          {activeTab !== 'parsed' && activeTab !== 'settings' && (
            <aside className="script-sidebar">
              <div className="sidebar-section">
                <div className="sidebar-header">
                  <h3>场景</h3>
                  <span className="badge">{parsedData?.scenes.length || 0}</span>
                </div>
                <div className="scene-list">
                  {(parsedData?.scenes.length ? parsedData.scenes : [
                    { id: '1', name: '总裁办公室', timeOfDay: '夜' },
                    { id: '2', name: '会议室', timeOfDay: '夜' },
                    { id: '3', name: '走廊', timeOfDay: '夜' },
                    { id: '4', name: '停车场', timeOfDay: '夜' }
                  ]).map((scene: any) => (
                    <div
                      key={scene.id}
                      className={`scene-item ${selectedScene === scene.id ? 'active' : ''}`}
                      onClick={() => setSelectedScene(scene.id)}
                    >
                      <Clock size={14} />
                      <span>{scene.name}</span>
                      <span className="time-badge">{scene.timeOfDay}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-header">
                  <h3>角色</h3>
                  <span className="badge">{parsedData?.characters.length || 0}</span>
                </div>
                <div className="character-list">
                  {(parsedData?.characters.length ? parsedData.characters : [
                    { id: '1', name: '林婉儿', dialogues: 3 },
                    { id: '2', name: '陆霆琛', dialogues: 3 },
                    { id: '3', name: '赵明', dialogues: 1 }
                  ]).map((char: any) => (
                    <div key={char.id} className="character-item">
                      <Users size={14} />
                      <span>{char.name}</span>
                      <span className="dialogue-count">{char.dialogues}句</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Editor Area */}
          <div className="editor-area">
            {activeTab === 'edit' && (
              <div className="editor-container">
                <div className="editor-toolbar">
                  <div className="toolbar-left">
                    <span className="word-count">{lineCount} 行</span>
                    {hasExtracted && (
                      <span className="warning-badge">
                        <AlertTriangle size={12} /> 修改剧本后需重新解析
                      </span>
                    )}
                  </div>
                  <div className="toolbar-right">
                    <span className="hint">⌘+S 保存</span>
                  </div>
                </div>
                <div className="editor-wrapper">
                  <div className="line-numbers">
                    {lines.map((_, i) => (
                      <div key={i} className="line-number">{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="script-editor"
                    value={scriptText}
                    onChange={(e) => handleScriptChange(e.target.value)}
                    placeholder="在这里编辑剧本...

支持格式：
[第一场] 场景名-时间
（内/外景）

角色名：（动作）对白内容

快捷键：
⌘+S 保存"
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {activeTab === 'outline' && (
              <div className="outline-view">
                <div className="outline-header">
                  <h2>剧本大纲</h2>
                  <p>{parsedData?.scenes.length || 0} 场戏，{parsedData?.characters.length || 0} 个角色</p>
                </div>
                <div className="outline-tree">
                  {(parsedData?.scenes.length ? parsedData.scenes : [
                    { id: '1', name: '总裁办公室', timeOfDay: '夜', characters: ['林婉儿', '陆霆琛'] },
                    { id: '2', name: '会议室', timeOfDay: '夜', characters: ['林婉儿', '赵明'] },
                    { id: '3', name: '走廊', timeOfDay: '夜', characters: ['林婉儿', '陆霆琛'] },
                    { id: '4', name: '停车场', timeOfDay: '夜', characters: ['陆霆琛'] }
                  ]).map((scene: any) => (
                    <div key={scene.id} className="outline-scene">
                      <div className="scene-header">
                        <ChevronDown size={16} />
                        <span className="scene-title">第{scene.id}场: {scene.name}</span>
                        <span className="scene-time">{scene.timeOfDay}</span>
                      </div>
                      <div className="scene-content">
                        {scene.content?.slice(0, 100) || '场景内容...'}
                      </div>
                      <div className="scene-characters">
                        {scene.characters?.map((c: string) => (
                          <span key={c} className="character-tag">{c}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'parsed' && (
              <div className="parsed-view">
                <div className="parsed-header">
                  <h2>剧本解析结果</h2>
                  <p>已从剧本中提取以下元素，可进入后续模块继续制作</p>
                </div>

                <div className="parsed-grid">
                  <div className="parsed-card">
                    <div className="card-header">
                      <Users size={20} />
                      <h3>角色 ({parsedData?.characters.length || 0})</h3>
                    </div>
                    <div className="card-content">
                      {(parsedData?.characters.length ? parsedData.characters : []).map((char: any) => (
                        <div key={char.id} className="parsed-character">
                          <div className="char-avatar">{char.name[0]}</div>
                          <div className="char-info">
                            <span className="char-name">{char.name}</span>
                            <span className="char-lines">{char.dialogues} 句对白</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="parsed-card">
                    <div className="card-header">
                      <Image size={20} />
                      <h3>场景 ({parsedData?.scenes.length || 0})</h3>
                    </div>
                    <div className="card-content">
                      {(parsedData?.scenes.length ? parsedData.scenes : []).map((scene: any) => (
                        <div key={scene.id} className="parsed-scene">
                          <div className="scene-info">
                            <span className="scene-name">{scene.name}</span>
                            <span className="scene-meta">{scene.timeOfDay}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="parsed-actions">
                  <button className="btn btn-primary" onClick={handleProceed}>
                    <Users size={18} /> 进入选角中心
                  </button>
                  <button className="btn btn-outline" onClick={() => navigate('/scene')}>
                    <Image size={18} /> 进入场景工坊
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-view">
                <div className="settings-section">
                  <h3>剧本梗概</h3>
                  <textarea
                    className="settings-textarea"
                    placeholder="请输入剧本梗概（100-500字）..."
                    value={projectSettings.synopsis}
                    onChange={(e) => updateSettings('synopsis', e.target.value)}
                  />
                </div>

                <div className="settings-section">
                  <h3>世界观设定</h3>
                  <textarea
                    className="settings-textarea"
                    placeholder="请输入世界观设定..."
                    value={projectSettings.worldView}
                    onChange={(e) => updateSettings('worldView', e.target.value)}
                  />
                </div>

                <div className="settings-section">
                  <h3>人物小传</h3>
                  <div className="character-backstories">
                    {(parsedData?.characters.length ? parsedData.characters : [
                      { id: '1', name: '林婉儿' },
                      { id: '2', name: '陆霆琛' },
                      { id: '3', name: '赵明' }
                    ]).map((char: any) => (
                      <div key={char.id} className="backstory-item">
                        <div className="backstory-header">
                          <span className="char-name">{char.name}</span>
                        </div>
                        <textarea
                          className="backstory-textarea"
                          placeholder={`请输入 ${char.name} 的人物小传...`}
                          value={projectSettings.characterBackstories[char.id] || ''}
                          onChange={(e) => updateCharacterBackstory(char.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reimport Confirmation Modal */}
      {showReimportConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangle size={24} color="#f59e0b" />
              <h3>重新导入剧本</h3>
            </div>
            <p>当前剧本已提取角色和场景要素，重新导入将：</p>
            <ul>
              <li>覆盖现有剧本内容</li>
              <li>清除已提取的要素数据</li>
              <li>保留剧本设定（梗概、世界观、人物小传）</li>
            </ul>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowReimportConfirm(false)}>
                取消
              </button>
              <button className="btn btn-primary" onClick={confirmReimport}>
                确认重导
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Warning Modal */}
      {showEditWarning && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangle size={24} color="#f59e0b" />
              <h3>剧本已修改</h3>
            </div>
            <p>您修改了剧本内容，需要重新解析才能更新提取的要素。</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowEditWarning(false)}>
                稍后再说
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowEditWarning(false)
                handleAnalyze()
              }}>
                立即重新解析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
