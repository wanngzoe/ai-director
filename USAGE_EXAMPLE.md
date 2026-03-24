# 使用示例：从剧本到视频生成

## 完整示例

### 步骤1：准备剧本

```typescript
const scriptText = `
[第1场] 总裁办公室 - 夜

林婉儿站在落地窗前，手握文件，神情紧张。
陆霆琛推门而入，目光冷峻。

陆霆琛：你为什么要这么做？
林婉儿转身，眼中含泪：我没有选择。

陆霆琛走向林婉儿，伸手想要触碰她的脸。
林婉儿后退一步，摇头。

[第2场] 豪华公寓 - 日

林婉儿独自坐在沙发上，看着手机里的照片，露出微笑。
门铃响起，她收起笑容，深吸一口气。
`


### 步骤2：定义角色和场景

```typescript
const characters = [
  {
    name: '林婉儿',
    description: '28岁，干练女强人',
    appearance: 'young Chinese woman, elegant business attire, professional hairstyle, confident posture'
  },
  {
    name: '陆霆琛',
    description: '30岁，霸道总裁',
    appearance: 'handsome Chinese man, expensive suit, tall and imposing, cold expression'
  }
]

const sceneSettings = [
  {
    location: 'luxurious CEO office with floor-to-ceiling windows',
    timeOfDay: 'night',
    style: 'modern, cinematic, high-end'
  },
  {
    location: 'luxury apartment interior, modern design',
    timeOfDay: 'day',
    style: 'contemporary, bright, comfortable'
  }
]
```

### 步骤3：解析剧本

```typescript
import { parseScript } from './utils/scriptToStoryboard'

const scenes = parseScript(scriptText)

console.log(scenes)
// 输出：
// [
//   {
//     id: 'scene-1',
//     sceneNumber: 1,
//     location: '总裁办公室',
//     timeOfDay: 'night',
//     characters: ['林婉儿', '陆霆琛'],
//     dialogue: '你为什么要这么做？ 我没有选择。',
//     action: '林婉儿站在落地窗前，手握文件，神情紧张。陆霆琛推门而入...',
//     emotion: '紧张',
//     duration: 25
//   },
//   {
//     id: 'scene-2',
//     sceneNumber: 2,
//     location: '豪华公寓',
//     timeOfDay: 'day',
//     characters: ['林婉儿'],
//     dialogue: '',
//     action: '林婉儿独自坐在沙发上，看着手机里的照片...',
//     emotion: '平静',
//     duration: 15
//   }
// ]
```

### 步骤4：生成分镜

```typescript
import { sceneToShots } from './utils/scriptToStoryboard'

const allShots = scenes.flatMap(scene => sceneToShots(scene))

console.log(allShots[0])
// 输出第一个镜头：
// {
//   id: 'scene-1-shot-1',
//   shotNumber: 1,
//   shotType: 'establishing',
//   cameraMovement: 'static',
//   cameraAngle: 'eye-level',
//   duration: 3,
//   characters: [],
//   action: '建立总裁办公室的环境',
//   emotion: '紧张',
//   lighting: '低调照明',
//   composition: '三分法构图，展现环境全貌'
// }
```

### 步骤5：生成视频提示词

```typescript
import { shotToPrompt } from './utils/shotToPrompt'

const prompts = allShots.map((shot, index) => {
  const sceneIndex = Math.floor(index / 8) // 假设每个场景8个镜头
  return shotToPrompt(shot, characters, sceneSettings[sceneIndex])
})

console.log(prompts[0])
// 输出：
// {
//   shotId: 'scene-1-shot-1',
//   mainPrompt: 'wide establishing shot, in luxurious CEO office with floor-to-ceiling windows, night time, static camera, eye level angle, low-key lighting, dramatic shadows, high contrast, tense atmosphere, rule of thirds composition, cinematic, professional, high quality, detailed, modern, cinematic, high-end',
//   negativePrompt: 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, logo, amateur, poorly lit, overexposed, underexposed',
//   technicalParams: {
//     aspectRatio: '16:9',
//     duration: 3,
//     fps: 24,
//     motionStrength: 0.2
//   },
//   styleGuide: '展现环境全貌，建立空间感；使用广角镜头，景深较大；使用低调照明，营造神秘氛围'
// }
```

### 步骤6：针对特定模型优化

```typescript
import { optimizePrompt } from './utils/shotToPrompt'

// 为 Seedance 优化
const seedancePrompts = prompts.map(prompt => 
  optimizePrompt(prompt, 'seedance')
)

// 为 Wan 优化
const wanPrompts = prompts.map(prompt => 
  optimizePrompt(prompt, 'wan')
)

console.log(seedancePrompts[0].mainPrompt)
// 输出（Seedance优化后）：
// 'wide establishing shot, in luxurious CEO office with floor-to-ceiling windows, night time, static camera, eye level angle, low-key lighting, dramatic shadows, high contrast, tense atmosphere, rule of thirds composition, cinematic, professional, high quality, detailed, modern, cinematic, high-end, smooth motion, cinematic movement'
```

---

## 在 React 组件中使用

### 创建分镜生成组件

```typescript
import React, { useState } from 'react'
import { parseScript, sceneToShots } from './utils/scriptToStoryboard'
import { shotToPrompt, optimizePrompt } from './utils/shotToPrompt'

function StoryboardGenerator() {
  const [scriptText, setScriptText] = useState('')
  const [shots, setShots] = useState([])
  const [prompts, setPrompts] = useState([])
  const [selectedModel, setSelectedModel] = useState<'seedance' | 'wan' | 'runway'>('seedance')

  const handleGenerate = () => {
    // 1. 解析剧本
    const scenes = parseScript(scriptText)
    
    // 2. 生成分镜
    const generatedShots = scenes.flatMap(scene => sceneToShots(scene))
    setShots(generatedShots)
    
    // 3. 生成提示词
    const generatedPrompts = generatedShots.map(shot => {
      const prompt = shotToPrompt(shot, characters, sceneSettings[0])
      return optimizePrompt(prompt, selectedModel)
    })
    setPrompts(generatedPrompts)
  }

  return (
    <div className="storyboard-generator">
      <div className="input-section">
        <h2>输入剧本</h2>
        <textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="粘贴你的剧本..."
          rows={20}
        />
        
        <div className="model-selector">
          <label>选择生成模型：</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as any)}>
            <option value="seedance">Seedance 2.1</option>
            <option value="wan">Wan Show</option>
            <option value="runway">Runway Gen-3</option>
          </select>
        </div>
        
        <button onClick={handleGenerate} className="btn btn-primary">
          生成分镜和提示词
        </button>
      </div>

      {shots.length > 0 && (
        <div className="output-section">
          <h2>生成的分镜（共 {shots.length} 个镜头）</h2>
          
          {shots.map((shot, index) => (
            <div key={shot.id} className="shot-card">
              <h3>镜头 {shot.shotNumber}</h3>
              
              <div className="shot-details">
                <div className="detail-row">
                  <span className="label">类型：</span>
                  <span>{shot.shotType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">运动：</span>
                  <span>{shot.cameraMovement}</span>
                </div>
                <div className="detail-row">
                  <span className="label">角度：</span>
                  <span>{shot.cameraAngle}</span>
                </div>
                <div className="detail-row">
                  <span className="label">时长：</span>
                  <span>{shot.duration}秒</span>
                </div>
                <div className="detail-row">
                  <span className="label">动作：</span>
                  <span>{shot.action}</span>
                </div>
              </div>

              {prompts[index] && (
                <div className="prompt-section">
                  <h4>视频生成提示词</h4>
                  
                  <div className="prompt-box">
                    <label>主提示词：</label>
                    <textarea 
                      value={prompts[index].mainPrompt} 
                      readOnly 
                      rows={4}
                    />
                  </div>
                  
                  <div className="prompt-box">
                    <label>负面提示词：</label>
                    <textarea 
                      value={prompts[index].negativePrompt} 
                      readOnly 
                      rows={2}
                    />
                  </div>
                  
                  <div className="technical-params">
                    <h5>技术参数</h5>
                    <div>画幅：{prompts[index].technicalParams.aspectRatio}</div>
                    <div>时长：{prompts[index].technicalParams.duration}秒</div>
                    <div>帧率：{prompts[index].technicalParams.fps}fps</div>
                    <div>运动强度：{prompts[index].technicalParams.motionStrength}</div>
                  </div>
                  
                  <button className="btn btn-primary">
                    发送到生成队列
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StoryboardGenerator
```

---

## 实际输出示例

### 场景1 - 镜头1（建立镜头）

**分镜信息：**
```json
{
  "shotNumber": 1,
  "shotType": "establishing",
  "cameraMovement": "static",
  "cameraAngle": "eye-level",
  "duration": 3,
  "action": "建立总裁办公室的环境"
}
```

**生成的提示词：**
```
主提示词：
wide establishing shot, in luxurious CEO office with floor-to-ceiling windows, 
night time, modern city skyline visible, contemporary interior design, 
ambient lighting from city, static camera, eye level angle, 
low-key lighting, dramatic shadows, high contrast, tense atmosphere, 
rule of thirds composition, cinematic, professional, high quality, 
detailed, modern, cinematic, high-end

负面提示词：
blurry, low quality, distorted, deformed, ugly, bad anatomy, 
watermark, text, logo, amateur, poorly lit, overexposed, underexposed

技术参数：
- 画幅比例：16:9
- 时长：3秒
- 帧率：24fps
- 运动强度：0.2

风格指南：
展现环境全貌，建立空间感；使用广角镜头，景深较大；
使用低调照明，营造神秘氛围
```

### 场景1 - 镜头6（情绪特写）

**分镜信息：**
```json
{
  "shotNumber": 6,
  "shotType": "closeup",
  "cameraMovement": "static",
  "cameraAngle": "eye-level",
  "duration": 3,
  "characters": ["林婉儿"],
  "action": "捕捉林婉儿的情绪变化",
  "emotion": "悲伤"
}
```

**生成的提示词：**
```
主提示词：
close-up shot, in luxurious CEO office with floor-to-ceiling windows, 
night time, young Chinese woman, elegant business attire, 
professional hairstyle, confident posture, 
捕捉林婉儿的情绪变化, static camera, eye level angle, 
soft lighting, diffused, gentle shadows, 
melancholic atmosphere, somber mood, emotional depth, 
centered composition, symmetrical framing, 
cinematic, professional, high quality, detailed, 
modern, cinematic, high-end

负面提示词：
blurry, low quality, distorted, deformed, ugly, bad anatomy, 
watermark, text, logo, amateur, poorly lit, overexposed, underexposed

技术参数：
- 画幅比例：9:16
- 时长：3秒
- 帧率：24fps
- 运动强度：0.2

风格指南：
聚焦面部表情，捕捉情绪细节；使用浅景深，虚化背景；
使用低调照明，营造神秘氛围
```

---

## 批量处理示例

```typescript
// 批量处理整个剧本
async function processEntireScript(scriptText: string) {
  // 1. 解析
  const scenes = parseScript(scriptText)
  console.log(`解析完成：${scenes.length} 个场景`)
  
  // 2. 生成分镜
  const allShots = scenes.flatMap(scene => sceneToShots(scene))
  console.log(`分镜生成完成：${allShots.length} 个镜头`)
  
  // 3. 生成提示词
  const allPrompts = allShots.map((shot, index) => {
    const sceneIndex = scenes.findIndex(s => shot.id.startsWith(s.id))
    return shotToPrompt(shot, characters, sceneSettings[sceneIndex])
  })
  console.log(`提示词生成完成：${allPrompts.length} 个`)
  
  // 4. 优化并保存
  const optimizedPrompts = allPrompts.map(prompt => 
    optimizePrompt(prompt, 'seedance')
  )
  
  // 5. 导出为JSON
  const output = {
    projectName: '霸总甜妻999次逃婚',
    totalScenes: scenes.length,
    totalShots: allShots.length,
    scenes: scenes.map((scene, sceneIndex) => ({
      sceneNumber: scene.sceneNumber,
      location: scene.location,
      shots: allShots
        .filter(shot => shot.id.startsWith(scene.id))
        .map((shot, shotIndex) => ({
          shotNumber: shot.shotNumber,
          shotInfo: shot,
          prompt: optimizedPrompts[sceneIndex * 8 + shotIndex]
        }))
    }))
  }
  
  return output
}

// 使用
const result = await processEntireScript(scriptText)
console.log(JSON.stringify(result, null, 2))
```

---

## 导出和使用

### 导出为CSV（用于批量生成）

```typescript
function exportToCSV(prompts: VideoPrompt[]) {
  const headers = ['镜头ID', '主提示词', '负面提示词', '画幅', '时长', '运动强度']
  const rows = prompts.map(p => [
    p.shotId,
    p.mainPrompt,
    p.negativePrompt,
    p.technicalParams.aspectRatio,
    p.technicalParams.duration,
    p.technicalParams.motionStrength
  ])
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
  
  // 下载CSV
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'video-prompts.csv'
  a.click()
}
```

### 直接发送到生成API

```typescript
async function sendToVideoAPI(prompt: VideoPrompt) {
  const response = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: prompt.mainPrompt,
      negative_prompt: prompt.negativePrompt,
      aspect_ratio: prompt.technicalParams.aspectRatio,
      duration: prompt.technicalParams.duration,
      motion_strength: prompt.technicalParams.motionStrength
    })
  })
  
  return await response.json()
}
```

---

## 总结

通过这套工具，你可以：

1. ✅ 自动解析剧本文本
2. ✅ 基于电影语言规则生成专业分镜
3. ✅ 将分镜转化为视频生成提示词
4. ✅ 针对不同模型优化提示词
5. ✅ 批量处理整个剧本
6. ✅ 导出为各种格式

这大大提高了从剧本到视频的制作效率！
