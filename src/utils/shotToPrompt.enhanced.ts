// 增强版：基于 Seedance 2.0 多模态能力的提示词生成

import type { Shot } from './scriptToStoryboard'

export interface EnhancedVideoPrompt {
  shotId: string
  chinesePrompt: string  // Seedance 要求使用中文
  referenceImages: string[]  // @图片1, @图片2 格式
  referenceVideos: string[]  // @视频1, @视频2 格式
  cameraMovement: string  // 中文运镜关键词
  technicalParams: {
    aspectRatio: string
    duration: number
    fps: number
    isOneTake: boolean  // 是否一镜到底
  }
  audioReference?: string  // 音频参考
  emotionIntensity: 'low' | 'medium' | 'high'  // 情绪强度
  continuityNotes?: string  // 连贯性说明
}

// Seedance 2.0 中文运镜关键词（必须使用）
const CAMERA_MOVEMENT_CN = {
  'static': '固定镜头',
  'push': '推镜头',
  'pull': '拉镜头',
  'pan-left': '左摇镜头',
  'pan-right': '右摇镜头',
  'tilt-up': '上摇镜头',
  'tilt-down': '下摇镜头',
  'dolly': '移镜头',
  'tracking': '跟随镜头',
  'crane': '升降镜头',
  'orbit': '环绕镜头',
  '360': '360度环绕',
  'handheld': '手持跟拍',
  'zoom-in': '推近',
  'zoom-out': '拉远',
  'one-take': '一镜到底'
}

// 景别关键词
const SHOT_SIZE_CN = {
  'establishing': '远景',
  'wide': '全景',
  'medium': '中景',
  'closeup': '特写',
  'extreme-closeup': '大特写',
  'over-shoulder': '越肩镜头',
  'pov': '主观视角',
  'two-shot': '双人镜头'
}

// 角度关键词
const ANGLE_CN = {
  'eye-level': '平视',
  'high-angle': '俯拍',
  'low-angle': '仰拍',
  'dutch-angle': '倾斜角度',
  'birds-eye': '鸟瞰',
  'worms-eye': '虫视角'
}

// 情绪氛围关键词（中文）
const EMOTION_CN = {
  '愤怒': '紧张激烈的氛围，强烈的对抗感',
  '高兴': '明亮温馨的氛围，欢快的情绪',
  '悲伤': '低沉压抑的氛围，忧郁的情绪',
  '惊讶': '突然的转折，震惊的瞬间',
  '恐惧': '阴暗诡异的氛围，紧张的气氛',
  '平静': '舒缓宁静的氛围，平和的情绪',
  '紧张': '悬疑紧迫的氛围，压迫感',
  '兴奋': '激动人心的氛围，充满活力',
  '失望': '失落沮丧的氛围，低落的情绪',
  '温柔': '柔和温暖的氛围，细腻的情感'
}

/**
 * 核心功能：生成 Seedance 2.0 优化的中文提示词
 * 
 * 关键改进：
 * 1. 使用自然中文描述，不直译英文
 * 2. 明确运镜关键词（必须用中文）
 * 3. 支持参考图/视频引用（@图片1, @视频1）
 * 4. 强调动作的视觉化描述
 * 5. 包含情绪氛围词汇
 */
export function generateSeedancePrompt(
  shot: Shot,
  characters: { 
    name: string
    description: string
    appearance: string
    referenceImage?: string  // 角色参考图
  }[],
  scene: { 
    location: string
    timeOfDay: string
    style: string
    referenceImage?: string  // 场景参考图
  },
  previousShot?: Shot  // 前一个镜头，用于保持连贯性
): EnhancedVideoPrompt {
  
  const parts: string[] = []
  const referenceImages: string[] = []
  const referenceVideos: string[] = []
  
  // 1. 场景描述（具体、视觉化）
  const timeDesc = getTimeDescription(scene.timeOfDay)
  parts.push(`${scene.location}，${timeDesc}`)
  
  // 如果有场景参考图
  if (scene.referenceImage) {
    referenceImages.push(scene.referenceImage)
    parts.push(`场景参考@图片${referenceImages.length}`)
  }
  
  // 2. 景别描述
  const shotSize = SHOT_SIZE_CN[shot.shotType] || '中景'
  parts.push(shotSize)
  
  // 3. 角色描述（自然中文）
  if (shot.characters.length > 0) {
    shot.characters.forEach(charName => {
      const char = characters.find(c => c.name === charName)
      if (char) {
        // 使用自然的中文描述
        parts.push(char.description)
        
        // 如果有角色参考图
        if (char.referenceImage) {
          referenceImages.push(char.referenceImage)
          parts.push(`${charName}的形象参考@图片${referenceImages.length}`)
        }
      }
    })
  }
  
  // 4. 动作描述（清晰、具体）
  if (shot.action) {
    // 将动作描述转为自然的中文表达
    const actionDesc = naturalizeAction(shot.action, shot.characters)
    parts.push(actionDesc)
  }
  
  // 5. 运镜描述（使用中文关键词）
  const cameraMovement = getCameraMovementCN(shot.cameraMovement, shot.cameraAngle)
  parts.push(cameraMovement)
  
  // 6. 情绪氛围
  if (shot.emotion && EMOTION_CN[shot.emotion as keyof typeof EMOTION_CN]) {
    parts.push(EMOTION_CN[shot.emotion as keyof typeof EMOTION_CN])
  }
  
  // 7. 连贯性处理（如果有前一个镜头）
  let continuityNotes = ''
  if (previousShot) {
    continuityNotes = generateContinuityNotes(previousShot, shot)
    if (continuityNotes) {
      parts.push(continuityNotes)
    }
  }
  
  // 8. 对话（如果有）
  if (shot.dialogue) {
    parts.push(`角色说："${shot.dialogue}"`)
  }
  
  // 组合成最终提示词
  const chinesePrompt = parts.join('，')
  
  return {
    shotId: shot.id,
    chinesePrompt,
    referenceImages,
    referenceVideos,
    cameraMovement,
    technicalParams: {
      aspectRatio: getAspectRatio(shot.shotType),
      duration: shot.duration,
      fps: 24,
      isOneTake: false
    },
    emotionIntensity: getEmotionIntensity(shot.emotion),
    continuityNotes
  }
}

// 时间描述转中文
function getTimeDescription(timeOfDay: string): string {
  const timeMap: Record<string, string> = {
    'day': '白天，自然光线明亮',
    'night': '夜晚，灯光氛围',
    'dawn': '清晨，柔和的晨光',
    'dusk': '黄昏，温暖的夕阳'
  }
  return timeMap[timeOfDay] || '白天'
}

// 将动作描述自然化
function naturalizeAction(action: string, characters: string[]): string {
  // 替换常见的动作词为更自然的表达
  let natural = action
  
  // 如果有角色名，使其更自然
  if (characters.length > 0) {
    const char = characters[0]
    natural = natural.replace(/角色/, char)
  }
  
  // 动作词优化
  const actionMap: Record<string, string> = {
    '建立': '展现',
    '捕捉': '特写展示',
    '展现': '呈现',
    '从.*看': '视角切换到'
  }
  
  for (const [pattern, replacement] of Object.entries(actionMap)) {
    natural = natural.replace(new RegExp(pattern, 'g'), replacement)
  }
  
  return natural
}

// 获取中文运镜描述
function getCameraMovementCN(movement: string, angle: string): string {
  const parts: string[] = []
  
  // 运镜方式
  if (CAMERA_MOVEMENT_CN[movement as keyof typeof CAMERA_MOVEMENT_CN]) {
    parts.push(CAMERA_MOVEMENT_CN[movement as keyof typeof CAMERA_MOVEMENT_CN])
  }
  
  // 角度
  if (angle !== 'eye-level' && ANGLE_CN[angle as keyof typeof ANGLE_CN]) {
    parts.push(ANGLE_CN[angle as keyof typeof ANGLE_CN])
  }
  
  return parts.join('，') || '固定镜头'
}

// 获取画幅比例
function getAspectRatio(shotType: string): string {
  // 根据镜头类型推荐画幅
  const ratioMap: Record<string, string> = {
    'establishing': '16:9',
    'wide': '16:9',
    'medium': '9:16',
    'closeup': '9:16',
    'extreme-closeup': '1:1',
    'over-shoulder': '16:9',
    'pov': '16:9',
    'two-shot': '16:9'
  }
  return ratioMap[shotType] || '16:9'
}

// 获取情绪强度
function getEmotionIntensity(emotion: string): 'low' | 'medium' | 'high' {
  const highIntensity = ['愤怒', '恐惧', '崩溃', '狂喜', '震惊']
  const mediumIntensity = ['高兴', '悲伤', '惊讶', '紧张', '兴奋']
  
  if (highIntensity.includes(emotion)) return 'high'
  if (mediumIntensity.includes(emotion)) return 'medium'
  return 'low'
}

// 生成连贯性说明
function generateContinuityNotes(previousShot: Shot, currentShot: Shot): string {
  const notes: string[] = []
  
  // 1. 角色连贯性
  const prevChars = new Set(previousShot.characters)
  const currChars = new Set(currentShot.characters)
  const commonChars = [...prevChars].filter(c => currChars.has(c))
  
  if (commonChars.length > 0) {
    notes.push(`保持${commonChars.join('、')}的造型和状态连贯`)
  }
  
  // 2. 动作连贯性
  if (previousShot.action.includes('走') && currentShot.action.includes('到达')) {
    notes.push('动作自然衔接，保持移动的流畅性')
  }
  
  // 3. 情绪连贯性
  if (previousShot.emotion === currentShot.emotion) {
    notes.push(`延续${currentShot.emotion}的情绪氛围`)
  }
  
  return notes.join('，')
}


/**
 * Seedance 2.0 高级功能：一镜到底
 * 
 * 将多个镜头合并为一个连续的长镜头
 */
export function generateOneTakePrompt(
  shots: Shot[],
  characters: { name: string; description: string; appearance: string; referenceImage?: string }[],
  scene: { location: string; timeOfDay: string; style: string; referenceImage?: string }
): EnhancedVideoPrompt {
  
  const parts: string[] = []
  const referenceImages: string[] = []
  
  // 开头说明一镜到底
  parts.push('一镜到底')
  
  // 场景描述
  parts.push(`${scene.location}，${getTimeDescription(scene.timeOfDay)}`)
  
  // 逐个描述每个镜头的动作和运镜
  shots.forEach((shot, index) => {
    // 运镜转换
    const movement = getCameraMovementCN(shot.cameraMovement, shot.cameraAngle)
    
    // 动作描述
    const action = naturalizeAction(shot.action, shot.characters)
    
    // 组合
    if (index === 0) {
      parts.push(`镜头从${movement}开始，${action}`)
    } else {
      parts.push(`然后${movement}，${action}`)
    }
    
    // 添加角色参考图
    shot.characters.forEach(charName => {
      const char = characters.find(c => c.name === charName)
      if (char?.referenceImage && !referenceImages.includes(char.referenceImage)) {
        referenceImages.push(char.referenceImage)
      }
    })
  })
  
  // 总时长
  const totalDuration = shots.reduce((sum, shot) => sum + shot.duration, 0)
  
  return {
    shotId: `one-take-${shots[0].id}`,
    chinesePrompt: parts.join('，'),
    referenceImages,
    referenceVideos: [],
    cameraMovement: '一镜到底',
    technicalParams: {
      aspectRatio: '16:9',
      duration: totalDuration,
      fps: 24,
      isOneTake: true
    },
    emotionIntensity: getEmotionIntensity(shots[0].emotion),
    continuityNotes: '全程保持镜头连贯，无切镜'
  }
}

/**
 * Seedance 2.0 高级功能：参考视频运镜
 * 
 * 使用参考视频的运镜方式
 */
export function generateWithVideoReference(
  shot: Shot,
  characters: { name: string; description: string; appearance: string; referenceImage?: string }[],
  scene: { location: string; timeOfDay: string; style: string; referenceImage?: string },
  referenceVideo: {
    id: string
    description: string  // 描述这个视频的运镜特点
  }
): EnhancedVideoPrompt {
  
  const basePrompt = generateSeedancePrompt(shot, characters, scene)
  
  // 添加视频参考
  const videoRef = `@视频1`
  const enhancedPrompt = `${basePrompt.chinesePrompt}，完全参考${videoRef}的运镜效果和节奏`
  
  return {
    ...basePrompt,
    chinesePrompt: enhancedPrompt,
    referenceVideos: [referenceVideo.id],
    continuityNotes: `${basePrompt.continuityNotes || ''}，运镜风格参考${referenceVideo.description}`
  }
}

/**
 * Seedance 2.0 高级功能：音乐卡点
 * 
 * 根据音乐节奏生成卡点视频
 */
export function generateMusicSyncPrompt(
  shots: Shot[],
  characters: { name: string; description: string; appearance: string; referenceImage?: string }[],
  scene: { location: string; timeOfDay: string; style: string; referenceImage?: string },
  musicReference: {
    id: string
    bpm: number  // 节拍
    keyMoments: number[]  // 关键卡点时间（秒）
  }
): EnhancedVideoPrompt {
  
  const parts: string[] = []
  const referenceImages: string[] = []
  
  // 说明音乐卡点
  parts.push(`根据@视频${musicReference.id}的音乐节奏进行卡点`)
  
  // 为每个关键时刻分配镜头
  musicReference.keyMoments.forEach((moment, index) => {
    if (index < shots.length) {
      const shot = shots[index]
      const action = naturalizeAction(shot.action, shot.characters)
      parts.push(`在${moment}秒处，${action}`)
      
      // 收集参考图
      shot.characters.forEach(charName => {
        const char = characters.find(c => c.name === charName)
        if (char?.referenceImage && !referenceImages.includes(char.referenceImage)) {
          referenceImages.push(char.referenceImage)
        }
      })
    }
  })
  
  parts.push('画面切换与音乐节奏完美同步，节奏感强')
  
  return {
    shotId: `music-sync-${shots[0].id}`,
    chinesePrompt: parts.join('，'),
    referenceImages,
    referenceVideos: [musicReference.id],
    cameraMovement: '节奏卡点',
    technicalParams: {
      aspectRatio: '9:16',
      duration: Math.max(...musicReference.keyMoments) + 2,
      fps: 24,
      isOneTake: false
    },
    emotionIntensity: 'high',
    audioReference: musicReference.id,
    continuityNotes: '严格按照音乐节奏进行画面切换'
  }
}

/**
 * Seedance 2.0 高级功能：视频延长
 * 
 * 延长现有视频
 */
export function generateVideoExtensionPrompt(
  originalVideoId: string,
  extensionDuration: number,
  extensionContent: {
    action: string
    characters: string[]
    emotion: string
  }
): EnhancedVideoPrompt {
  
  const parts: string[] = []
  
  parts.push(`将@视频${originalVideoId}延长${extensionDuration}秒`)
  parts.push(extensionContent.action)
  
  if (extensionContent.emotion) {
    parts.push(EMOTION_CN[extensionContent.emotion as keyof typeof EMOTION_CN] || '')
  }
  
  parts.push('保持原视频的风格和节奏，自然衔接')
  
  return {
    shotId: `extension-${originalVideoId}`,
    chinesePrompt: parts.join('，'),
    referenceImages: [],
    referenceVideos: [originalVideoId],
    cameraMovement: '延续原视频运镜',
    technicalParams: {
      aspectRatio: '16:9',
      duration: extensionDuration,
      fps: 24,
      isOneTake: false
    },
    emotionIntensity: getEmotionIntensity(extensionContent.emotion),
    continuityNotes: '延长部分需与原视频无缝衔接'
  }
}

/**
 * Seedance 2.0 高级功能：视频编辑
 * 
 * 修改现有视频的某个部分
 */
export function generateVideoEditPrompt(
  originalVideoId: string,
  editInstructions: {
    timeRange?: { start: number; end: number }
    changeDescription: string
    keepOriginal: string[]  // 保持不变的元素
  }
): EnhancedVideoPrompt {
  
  const parts: string[] = []
  
  if (editInstructions.timeRange) {
    parts.push(`修改@视频${originalVideoId}的${editInstructions.timeRange.start}-${editInstructions.timeRange.end}秒部分`)
  } else {
    parts.push(`修改@视频${originalVideoId}`)
  }
  
  parts.push(editInstructions.changeDescription)
  
  if (editInstructions.keepOriginal.length > 0) {
    parts.push(`保持${editInstructions.keepOriginal.join('、')}不变`)
  }
  
  return {
    shotId: `edit-${originalVideoId}`,
    chinesePrompt: parts.join('，'),
    referenceImages: [],
    referenceVideos: [originalVideoId],
    cameraMovement: '保持原运镜',
    technicalParams: {
      aspectRatio: '16:9',
      duration: editInstructions.timeRange 
        ? editInstructions.timeRange.end - editInstructions.timeRange.start 
        : 10,
      fps: 24,
      isOneTake: false
    },
    emotionIntensity: 'medium',
    continuityNotes: '仅修改指定部分，其他保持原样'
  }
}

/**
 * 提示词质量检查
 * 
 * 检查提示词是否符合 Seedance 2.0 规范
 */
export function validatePrompt(prompt: EnhancedVideoPrompt): {
  isValid: boolean
  warnings: string[]
  suggestions: string[]
} {
  const warnings: string[] = []
  const suggestions: string[] = []
  
  // 1. 检查是否使用中文
  if (!/[\u4e00-\u9fa5]/.test(prompt.chinesePrompt)) {
    warnings.push('提示词应使用中文描述')
  }
  
  // 2. 检查运镜关键词
  const hasMovementKeyword = Object.values(CAMERA_MOVEMENT_CN).some(
    keyword => prompt.chinesePrompt.includes(keyword)
  )
  if (!hasMovementKeyword && !prompt.technicalParams.isOneTake) {
    warnings.push('缺少运镜关键词，建议添加如"推镜头"、"跟随镜头"等')
  }
  
  // 3. 检查提示词长度
  if (prompt.chinesePrompt.length > 500) {
    warnings.push('提示词过长，建议精简到500字以内')
  }
  
  if (prompt.chinesePrompt.length < 20) {
    warnings.push('提示词过短，建议补充更多细节描述')
  }
  
  // 4. 检查参考图引用
  if (prompt.referenceImages.length > 0) {
    const hasReference = /@图片\d+/.test(prompt.chinesePrompt)
    if (!hasReference) {
      suggestions.push('已有参考图但未在提示词中引用，建议添加"参考@图片1"等描述')
    }
  }
  
  // 5. 检查动作描述
  if (!prompt.chinesePrompt.includes('，')) {
    suggestions.push('建议使用逗号分隔不同的描述要素，使提示词更清晰')
  }
  
  // 6. 检查情绪描述
  const hasEmotion = Object.values(EMOTION_CN).some(
    emotion => prompt.chinesePrompt.includes(emotion)
  )
  if (!hasEmotion && prompt.emotionIntensity !== 'low') {
    suggestions.push('建议添加情绪氛围描述，如"紧张的氛围"、"温馨的情绪"等')
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  }
}

/**
 * 批量生成优化
 * 
 * 为整个场景生成所有镜头的提示词，并自动处理连贯性
 */
export function generateScenePrompts(
  shots: Shot[],
  characters: { name: string; description: string; appearance: string; referenceImage?: string }[],
  scene: { location: string; timeOfDay: string; style: string; referenceImage?: string }
): EnhancedVideoPrompt[] {
  
  return shots.map((shot, index) => {
    const previousShot = index > 0 ? shots[index - 1] : undefined
    return generateSeedancePrompt(shot, characters, scene, previousShot)
  })
}
