// 剧本到分镜的转化工具

export interface ScriptScene {
  id: string
  sceneNumber: number
  location: string
  timeOfDay: 'day' | 'night' | 'dawn' | 'dusk'
  characters: string[]
  dialogue: string
  action: string
  emotion: string
  duration?: number
}

export interface Shot {
  id: string
  shotNumber: number
  shotType: 'establishing' | 'wide' | 'medium' | 'closeup' | 'extreme-closeup' | 'over-shoulder' | 'pov'
  cameraMovement: 'static' | 'pan' | 'tilt' | 'dolly' | 'tracking' | 'handheld' | 'crane'
  cameraAngle: 'eye-level' | 'high-angle' | 'low-angle' | 'dutch-angle' | 'birds-eye' | 'worms-eye'
  duration: number
  characters: string[]
  action: string
  dialogue?: string
  emotion: string
  lighting: string
  composition: string
}

export interface Storyboard {
  sceneId: string
  shots: Shot[]
}

// 导演方法论：剧本分析规则
export const SCENE_ANALYSIS_RULES = {
  // 场景类型识别
  sceneTypes: {
    establishing: ['建立', '全景', '远景', '环境', '外景'],
    dialogue: ['对话', '交谈', '说', '问', '答'],
    action: ['跑', '打', '追', '战斗', '移动'],
    emotional: ['哭', '笑', '怒', '悲', '喜'],
    transition: ['离开', '进入', '走向', '转身']
  },
  
  // 情绪强度映射
  emotionIntensity: {
    high: ['愤怒', '狂喜', '恐惧', '震惊', '崩溃'],
    medium: ['高兴', '难过', '担心', '惊讶', '失望'],
    low: ['平静', '思考', '观察', '等待', '沉默']
  }
}

// 分镜设计规则（基于经典电影语言）
export const SHOT_DESIGN_RULES = {
  // 场景开场：建立镜头
  sceneOpening: {
    shotType: 'establishing',
    cameraMovement: 'static',
    cameraAngle: 'eye-level',
    duration: 3,
    purpose: '建立场景环境和氛围'
  },
  
  // 对话场景：正反打
  dialogueScene: {
    pattern: ['medium', 'over-shoulder', 'closeup'],
    cameraMovement: 'static',
    cameraAngle: 'eye-level',
    duration: 5,
    purpose: '展现对话和人物反应'
  },
  
  // 情绪高潮：特写
  emotionalPeak: {
    shotType: 'closeup',
    cameraMovement: 'static',
    cameraAngle: 'eye-level',
    duration: 3,
    purpose: '捕捉情绪细节'
  },
  
  // 动作场景：跟随镜头
  actionScene: {
    shotType: 'medium',
    cameraMovement: 'tracking',
    cameraAngle: 'eye-level',
    duration: 4,
    purpose: '展现动作流畅性'
  }
}


// 剧本解析器：将剧本文本转为结构化场景
export function parseScript(scriptText: string): ScriptScene[] {
  const scenes: ScriptScene[] = []
  const sceneBlocks = scriptText.split(/\n\n+/)
  
  let sceneNumber = 1
  
  for (const block of sceneBlocks) {
    if (!block.trim()) continue
    
    // 识别场景标题：[第X场] 或 场景X
    const sceneTitleMatch = block.match(/\[第(\d+)场\]|场景(\d+)|第(\d+)场/)
    if (sceneTitleMatch) {
      const lines = block.split('\n')
      const titleLine = lines[0]
      
      // 提取场景信息
      const location = extractLocation(titleLine)
      const timeOfDay = extractTimeOfDay(titleLine)
      const characters = extractCharacters(block)
      const dialogue = extractDialogue(block)
      const action = extractAction(block)
      const emotion = extractEmotion(block)
      
      scenes.push({
        id: `scene-${sceneNumber}`,
        sceneNumber,
        location,
        timeOfDay,
        characters,
        dialogue,
        action,
        emotion,
        duration: estimateDuration(block)
      })
      
      sceneNumber++
    }
  }
  
  return scenes
}

// 辅助函数：提取场景位置
function extractLocation(text: string): string {
  const patterns = [
    /(?:在|于)([^，。\n]+)/,
    /([^，。\n]+)(?:-|—)/,
    /\[第\d+场\]\s*([^，。\n]+)/
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[1].trim()
  }
  
  return '未知场景'
}

// 辅助函数：提取时间
function extractTimeOfDay(text: string): 'day' | 'night' | 'dawn' | 'dusk' {
  if (/夜|晚上|深夜/.test(text)) return 'night'
  if (/黎明|清晨|早晨/.test(text)) return 'dawn'
  if (/黄昏|傍晚|日落/.test(text)) return 'dusk'
  return 'day'
}

// 辅助函数：提取角色
function extractCharacters(text: string): string[] {
  const characters = new Set<string>()
  const lines = text.split('\n')
  
  for (const line of lines) {
    // 匹配对话格式：角色名：对话内容
    const match = line.match(/^([^：:]+)[：:]/)
    if (match) {
      characters.add(match[1].trim())
    }
  }
  
  return Array.from(characters)
}

// 辅助函数：提取对话
function extractDialogue(text: string): string {
  const dialogues: string[] = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    const match = line.match(/[：:]\s*(.+)/)
    if (match) {
      dialogues.push(match[1].trim())
    }
  }
  
  return dialogues.join(' ')
}

// 辅助函数：提取动作描述
function extractAction(text: string): string {
  const lines = text.split('\n')
  const actions: string[] = []
  
  for (const line of lines) {
    // 动作描述通常不包含对话标记
    if (!line.match(/[：:]/) && line.trim() && !line.match(/\[第\d+场\]/)) {
      actions.push(line.trim())
    }
  }
  
  return actions.join(' ')
}

// 辅助函数：提取情绪
function extractEmotion(text: string): string {
  const emotions = ['愤怒', '高兴', '悲伤', '惊讶', '恐惧', '平静', '紧张', '兴奋', '失望', '温柔']
  
  for (const emotion of emotions) {
    if (text.includes(emotion)) return emotion
  }
  
  // 通过动作词推断情绪
  if (/哭|流泪/.test(text)) return '悲伤'
  if (/笑|微笑/.test(text)) return '高兴'
  if (/怒|吼|摔/.test(text)) return '愤怒'
  if (/惊|震惊/.test(text)) return '惊讶'
  
  return '平静'
}

// 辅助函数：估算时长
function estimateDuration(text: string): number {
  const wordCount = text.length
  // 平均每秒3个字
  return Math.ceil(wordCount / 3)
}


// 核心功能：将场景转化为分镜
export function sceneToShots(scene: ScriptScene): Shot[] {
  const shots: Shot[] = []
  let shotNumber = 1
  
  // 1. 开场建立镜头（如果是新场景）
  shots.push({
    id: `${scene.id}-shot-${shotNumber}`,
    shotNumber: shotNumber++,
    shotType: 'establishing',
    cameraMovement: 'static',
    cameraAngle: 'eye-level',
    duration: 3,
    characters: [],
    action: `建立${scene.location}的环境`,
    emotion: scene.emotion,
    lighting: scene.timeOfDay === 'night' ? '低调照明' : '自然光',
    composition: '三分法构图，展现环境全貌'
  })
  
  // 2. 根据场景类型生成镜头
  if (scene.dialogue && scene.characters.length > 0) {
    // 对话场景：使用正反打
    shots.push(...generateDialogueShots(scene, shotNumber))
    shotNumber += scene.characters.length * 2
  }
  
  if (scene.action && isActionScene(scene.action)) {
    // 动作场景
    shots.push(...generateActionShots(scene, shotNumber))
    shotNumber += 2
  }
  
  // 3. 情绪高潮镜头
  if (isEmotionalPeak(scene.emotion)) {
    shots.push({
      id: `${scene.id}-shot-${shotNumber}`,
      shotNumber: shotNumber++,
      shotType: 'closeup',
      cameraMovement: 'static',
      cameraAngle: 'eye-level',
      duration: 3,
      characters: scene.characters.slice(0, 1),
      action: `捕捉${scene.characters[0]}的情绪变化`,
      dialogue: scene.dialogue,
      emotion: scene.emotion,
      lighting: '柔光，突出面部表情',
      composition: '中心构图，浅景深'
    })
  }
  
  return shots
}

// 生成对话镜头
function generateDialogueShots(scene: ScriptScene, startNumber: number): Shot[] {
  const shots: Shot[] = []
  
  scene.characters.forEach((character, index) => {
    // 中景镜头
    shots.push({
      id: `${scene.id}-shot-${startNumber + index * 2}`,
      shotNumber: startNumber + index * 2,
      shotType: 'medium',
      cameraMovement: 'static',
      cameraAngle: 'eye-level',
      duration: 5,
      characters: [character],
      action: `${character}说话`,
      dialogue: scene.dialogue,
      emotion: scene.emotion,
      lighting: '三点布光',
      composition: '三分法，人物位于画面1/3处'
    })
    
    // 越肩镜头（如果有对话对象）
    if (scene.characters.length > 1) {
      shots.push({
        id: `${scene.id}-shot-${startNumber + index * 2 + 1}`,
        shotNumber: startNumber + index * 2 + 1,
        shotType: 'over-shoulder',
        cameraMovement: 'static',
        cameraAngle: 'eye-level',
        duration: 4,
        characters: scene.characters,
        action: `从${character}的角度看对方`,
        emotion: scene.emotion,
        lighting: '自然光',
        composition: '越肩构图，前景虚化'
      })
    }
  })
  
  return shots
}

// 生成动作镜头
function generateActionShots(scene: ScriptScene, startNumber: number): Shot[] {
  return [
    {
      id: `${scene.id}-shot-${startNumber}`,
      shotNumber: startNumber,
      shotType: 'wide',
      cameraMovement: 'tracking',
      cameraAngle: 'eye-level',
      duration: 6,
      characters: scene.characters,
      action: scene.action,
      emotion: scene.emotion,
      lighting: '动态照明',
      composition: '动态构图，留出运动空间'
    },
    {
      id: `${scene.id}-shot-${startNumber + 1}`,
      shotNumber: startNumber + 1,
      shotType: 'medium',
      cameraMovement: 'handheld',
      cameraAngle: 'low-angle',
      duration: 4,
      characters: scene.characters,
      action: `${scene.action}的细节`,
      emotion: scene.emotion,
      lighting: '强对比光',
      composition: '紧凑构图，增强动感'
    }
  ]
}

// 判断是否为动作场景
function isActionScene(action: string): boolean {
  const actionKeywords = ['跑', '追', '打', '战斗', '逃', '冲', '跳', '摔', '推', '拉']
  return actionKeywords.some(keyword => action.includes(keyword))
}

// 判断是否为情绪高潮
function isEmotionalPeak(emotion: string): boolean {
  const peakEmotions = ['愤怒', '崩溃', '狂喜', '恐惧', '震惊']
  return peakEmotions.includes(emotion)
}
