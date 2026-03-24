// 分镜到视频生成提示词的转化工具

import type { Shot } from './scriptToStoryboard'

export interface VideoPrompt {
  shotId: string
  mainPrompt: string
  negativePrompt: string
  technicalParams: {
    aspectRatio: string
    duration: number
    fps: number
    motionStrength: number
  }
  styleGuide: string
  referenceImages?: string[]
}

// 镜头类型的提示词模板
const SHOT_TYPE_PROMPTS = {
  'establishing': 'wide establishing shot, cinematic composition, detailed environment',
  'wide': 'wide shot, full body visible, environmental context',
  'medium': 'medium shot, waist up, balanced composition',
  'closeup': 'close-up shot, face and shoulders, emotional detail',
  'extreme-closeup': 'extreme close-up, facial features, intense emotion',
  'over-shoulder': 'over-the-shoulder shot, conversation perspective',
  'pov': 'point of view shot, first person perspective'
}

// 相机运动的提示词
const CAMERA_MOVEMENT_PROMPTS = {
  'static': 'static camera, stable frame',
  'pan': 'smooth pan movement, horizontal camera motion',
  'tilt': 'tilt movement, vertical camera motion',
  'dolly': 'dolly shot, camera moving forward/backward',
  'tracking': 'tracking shot, camera following subject',
  'handheld': 'handheld camera, dynamic movement, slight shake',
  'crane': 'crane shot, elevated camera movement'
}

// 相机角度的提示词
const CAMERA_ANGLE_PROMPTS = {
  'eye-level': 'eye level angle, neutral perspective',
  'high-angle': 'high angle shot, looking down',
  'low-angle': 'low angle shot, looking up, powerful perspective',
  'dutch-angle': 'dutch angle, tilted frame, dramatic tension',
  'birds-eye': 'birds eye view, top-down perspective',
  'worms-eye': 'worms eye view, extreme low angle'
}

// 照明风格的提示词
const LIGHTING_PROMPTS = {
  '自然光': 'natural lighting, soft shadows, realistic',
  '低调照明': 'low-key lighting, dramatic shadows, high contrast',
  '高调照明': 'high-key lighting, bright and even, minimal shadows',
  '三点布光': 'three-point lighting, professional setup, balanced',
  '柔光': 'soft lighting, diffused, gentle shadows',
  '强对比光': 'hard lighting, strong contrast, defined shadows',
  '动态照明': 'dynamic lighting, changing light conditions',
  '背光': 'backlighting, rim light, silhouette effect'
}

// 情绪氛围的提示词
const EMOTION_PROMPTS = {
  '愤怒': 'angry atmosphere, tense mood, aggressive energy',
  '高兴': 'joyful atmosphere, bright mood, positive energy',
  '悲伤': 'melancholic atmosphere, somber mood, emotional depth',
  '惊讶': 'surprised atmosphere, dynamic energy, unexpected moment',
  '恐惧': 'fearful atmosphere, dark mood, suspenseful tension',
  '平静': 'calm atmosphere, peaceful mood, serene energy',
  '紧张': 'tense atmosphere, suspenseful mood, anxious energy',
  '兴奋': 'excited atmosphere, energetic mood, dynamic movement',
  '失望': 'disappointed atmosphere, subdued mood, low energy',
  '温柔': 'gentle atmosphere, soft mood, tender emotion'
}

// 构图原则的提示词
const COMPOSITION_PROMPTS = {
  '三分法': 'rule of thirds composition, balanced framing',
  '中心构图': 'centered composition, symmetrical framing',
  '对角线构图': 'diagonal composition, dynamic lines',
  '框架构图': 'frame within frame, layered composition',
  '引导线构图': 'leading lines, directional composition',
  '对称构图': 'symmetrical composition, balanced elements',
  '紧凑构图': 'tight composition, close framing',
  '留白构图': 'negative space composition, minimalist framing'
}


// 核心功能：将分镜转化为视频生成提示词
export function shotToPrompt(
  shot: Shot,
  characters: { name: string; description: string; appearance: string }[],
  scene: { location: string; timeOfDay: string; style: string }
): VideoPrompt {
  
  // 1. 构建主提示词
  const mainPrompt = buildMainPrompt(shot, characters, scene)
  
  // 2. 构建负面提示词
  const negativePrompt = buildNegativePrompt()
  
  // 3. 设置技术参数
  const technicalParams = buildTechnicalParams(shot)
  
  // 4. 生成风格指南
  const styleGuide = buildStyleGuide(shot, scene)
  
  return {
    shotId: shot.id,
    mainPrompt,
    negativePrompt,
    technicalParams,
    styleGuide
  }
}

// 构建主提示词
function buildMainPrompt(
  shot: Shot,
  characters: { name: string; description: string; appearance: string }[],
  scene: { location: string; timeOfDay: string; style: string }
): string {
  const parts: string[] = []
  
  // 1. 镜头类型
  parts.push(SHOT_TYPE_PROMPTS[shot.shotType])
  
  // 2. 场景描述
  parts.push(`in ${scene.location}`)
  parts.push(`${scene.timeOfDay} time`)
  
  // 3. 角色描述
  if (shot.characters.length > 0) {
    const characterDescs = shot.characters.map(charName => {
      const char = characters.find(c => c.name === charName)
      return char ? char.appearance : charName
    })
    parts.push(characterDescs.join(', '))
  }
  
  // 4. 动作描述
  if (shot.action) {
    parts.push(translateActionToEnglish(shot.action))
  }
  
  // 5. 相机运动
  parts.push(CAMERA_MOVEMENT_PROMPTS[shot.cameraMovement])
  
  // 6. 相机角度
  parts.push(CAMERA_ANGLE_PROMPTS[shot.cameraAngle])
  
  // 7. 照明
  const lightingKey = shot.lighting as keyof typeof LIGHTING_PROMPTS
  if (LIGHTING_PROMPTS[lightingKey]) {
    parts.push(LIGHTING_PROMPTS[lightingKey])
  }
  
  // 8. 情绪氛围
  const emotionKey = shot.emotion as keyof typeof EMOTION_PROMPTS
  if (EMOTION_PROMPTS[emotionKey]) {
    parts.push(EMOTION_PROMPTS[emotionKey])
  }
  
  // 9. 构图
  const compositionMatch = Object.keys(COMPOSITION_PROMPTS).find(key => 
    shot.composition.includes(key)
  )
  if (compositionMatch) {
    parts.push(COMPOSITION_PROMPTS[compositionMatch as keyof typeof COMPOSITION_PROMPTS])
  }
  
  // 10. 风格标签
  parts.push('cinematic, professional, high quality, detailed')
  parts.push(scene.style || 'realistic style')
  
  return parts.join(', ')
}

// 构建负面提示词
function buildNegativePrompt(): string {
  return [
    'blurry',
    'low quality',
    'distorted',
    'deformed',
    'ugly',
    'bad anatomy',
    'watermark',
    'text',
    'logo',
    'amateur',
    'poorly lit',
    'overexposed',
    'underexposed'
  ].join(', ')
}

// 构建技术参数
function buildTechnicalParams(shot: Shot) {
  // 根据镜头类型推荐画幅比例
  const aspectRatioMap: Record<string, string> = {
    'establishing': '16:9',
    'wide': '16:9',
    'medium': '9:16',
    'closeup': '9:16',
    'extreme-closeup': '1:1',
    'over-shoulder': '16:9',
    'pov': '16:9'
  }
  
  // 根据相机运动推荐运动强度
  const motionStrengthMap: Record<string, number> = {
    'static': 0.2,
    'pan': 0.5,
    'tilt': 0.5,
    'dolly': 0.7,
    'tracking': 0.8,
    'handheld': 0.6,
    'crane': 0.7
  }
  
  return {
    aspectRatio: aspectRatioMap[shot.shotType] || '16:9',
    duration: shot.duration,
    fps: 24,
    motionStrength: motionStrengthMap[shot.cameraMovement] || 0.5
  }
}

// 构建风格指南
function buildStyleGuide(
  shot: Shot,
  scene: { location: string; timeOfDay: string; style: string }
): string {
  const guides: string[] = []
  
  // 根据镜头类型给出建议
  switch (shot.shotType) {
    case 'establishing':
      guides.push('展现环境全貌，建立空间感')
      guides.push('使用广角镜头，景深较大')
      break
    case 'closeup':
      guides.push('聚焦面部表情，捕捉情绪细节')
      guides.push('使用浅景深，虚化背景')
      break
    case 'medium':
      guides.push('平衡人物与环境，展现肢体语言')
      guides.push('标准镜头，自然视角')
      break
  }
  
  // 根据时间给出照明建议
  switch (scene.timeOfDay) {
    case 'night':
      guides.push('使用低调照明，营造神秘氛围')
      break
    case 'day':
      guides.push('自然光为主，明亮清晰')
      break
    case 'dawn':
      guides.push('柔和的晨光，温暖色调')
      break
    case 'dusk':
      guides.push('金色黄昏光，浪漫氛围')
      break
  }
  
  return guides.join('；')
}

// 辅助函数：将中文动作描述转为英文
function translateActionToEnglish(action: string): string {
  const actionMap: Record<string, string> = {
    '走': 'walking',
    '跑': 'running',
    '站': 'standing',
    '坐': 'sitting',
    '说话': 'talking',
    '哭': 'crying',
    '笑': 'laughing',
    '看': 'looking',
    '转身': 'turning around',
    '离开': 'leaving',
    '进入': 'entering',
    '拥抱': 'hugging',
    '亲吻': 'kissing',
    '打': 'fighting',
    '追': 'chasing'
  }
  
  // 简单的关键词匹配翻译
  for (const [cn, en] of Object.entries(actionMap)) {
    if (action.includes(cn)) {
      return en
    }
  }
  
  return 'action scene'
}


// 高级功能：智能提示词优化
export function optimizePrompt(prompt: VideoPrompt, model: 'seedance' | 'wan' | 'runway'): VideoPrompt {
  const optimized = { ...prompt }
  
  // 根据不同模型优化提示词
  switch (model) {
    case 'seedance':
      // Seedance 擅长长镜头和运动
      optimized.mainPrompt += ', smooth motion, cinematic movement'
      optimized.technicalParams.motionStrength *= 1.2
      break
      
    case 'wan':
      // Wan 擅长细节和质感
      optimized.mainPrompt += ', ultra detailed, photorealistic, 8k quality'
      break
      
    case 'runway':
      // Runway 擅长创意和风格化
      optimized.mainPrompt += ', artistic style, creative composition'
      break
  }
  
  return optimized
}

// 批量生成：从完整剧本到所有提示词
export function scriptToAllPrompts(
  scriptText: string,
  characters: { name: string; description: string; appearance: string }[],
  sceneSettings: { location: string; timeOfDay: string; style: string }[]
): VideoPrompt[] {
  // 这个函数需要导入 scriptToStoryboard 的功能
  // 这里提供接口定义，实际使用时需要组合使用
  return []
}

// 提示词模板库：常见场景的预设
export const PROMPT_TEMPLATES = {
  // 霸总剧常用场景
  ceo_office: {
    location: 'luxurious CEO office with floor-to-ceiling windows',
    lighting: 'dramatic backlighting, city skyline visible',
    style: 'modern, high-end, cinematic'
  },
  
  romantic_dinner: {
    location: 'elegant restaurant with candlelight',
    lighting: 'warm ambient lighting, soft shadows',
    style: 'romantic, intimate, cinematic'
  },
  
  confrontation: {
    location: 'dramatic setting with strong visual contrast',
    lighting: 'high contrast lighting, dramatic shadows',
    style: 'tense, cinematic, emotional'
  },
  
  // 都市剧常用场景
  city_street: {
    location: 'busy city street with modern buildings',
    lighting: 'natural daylight, urban atmosphere',
    style: 'realistic, contemporary, dynamic'
  },
  
  apartment: {
    location: 'modern apartment interior, cozy atmosphere',
    lighting: 'soft indoor lighting, warm tones',
    style: 'realistic, intimate, comfortable'
  }
}

// 导出完整的工作流函数
export function generateVideoPromptWorkflow(
  scriptText: string,
  projectSettings: {
    characters: { name: string; description: string; appearance: string }[]
    defaultStyle: string
    targetModel: 'seedance' | 'wan' | 'runway'
  }
): {
  scenes: any[]
  shots: any[]
  prompts: VideoPrompt[]
} {
  // 完整工作流将在实际使用时实现
  // 这里提供接口定义
  return {
    scenes: [],
    shots: [],
    prompts: []
  }
}
