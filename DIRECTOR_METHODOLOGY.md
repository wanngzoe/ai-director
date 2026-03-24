# AI 导演方法论：从剧本到视频生成

## 概述

本方法论提供了一套系统化的流程，将文字剧本转化为可执行的视频生成提示词。

---

## 完整工作流

```
剧本文本 → 场景解析 → 分镜设计 → 提示词生成 → 视频生成
```

---

## 第一步：剧本解析

### 剧本格式要求

```
[第1场] 总裁办公室 - 夜

林婉儿站在落地窗前，手握文件，神情紧张。

陆霆琛推门而入，目光冷峻。

陆霆琛：你为什么要这么做？

林婉儿转身，眼中含泪：我没有选择。
```

### 解析要素

1. **场景信息**
   - 场景编号：第X场
   - 地点：总裁办公室
   - 时间：夜/日/黎明/黄昏

2. **角色信息**
   - 出场角色：林婉儿、陆霆琛
   - 角色状态：站立、转身等

3. **动作描述**
   - 环境动作：推门而入
   - 角色动作：站在、转身

4. **对话内容**
   - 说话人：陆霆琛
   - 对话：你为什么要这么做？

5. **情绪信息**
   - 明确情绪：紧张、冷峻、含泪
   - 隐含情绪：通过动作推断

---

## 第二步：分镜设计规则

### 经典电影语言规则

#### 1. 场景开场：建立镜头（Establishing Shot）

**用途**：建立场景环境和空间关系

**规格**：
- 镜头类型：远景/全景
- 相机运动：静止
- 相机角度：平视
- 时长：3-5秒

**示例**：
```
镜头1：总裁办公室全景
- 展现豪华的办公室环境
- 落地窗外的城市夜景
- 建立空间感和氛围
```

#### 2. 对话场景：正反打（Shot-Reverse-Shot）

**用途**：展现对话双方的交流

**规格**：
- 镜头类型：中景 → 越肩 → 特写
- 相机运动：静止
- 相机角度：平视
- 时长：每个镜头4-6秒

**示例**：
```
镜头2：林婉儿中景
- 从正面拍摄林婉儿
- 展现她的肢体语言

镜头3：陆霆琛越肩镜头
- 从林婉儿的角度看陆霆琛
- 前景是林婉儿的肩膀（虚化）

镜头4：陆霆琛中景
- 切换到陆霆琛的正面
- 展现他的表情

镜头5：林婉儿越肩镜头
- 从陆霆琛的角度看林婉儿
```

#### 3. 情绪高潮：特写（Close-up）

**用途**：捕捉关键情绪时刻

**规格**：
- 镜头类型：特写/大特写
- 相机运动：静止或缓慢推进
- 相机角度：平视或微仰
- 时长：2-4秒

**示例**：
```
镜头6：林婉儿特写
- 聚焦面部表情
- 捕捉眼中的泪水
- 浅景深，虚化背景
```

#### 4. 动作场景：跟随镜头（Tracking Shot）

**用途**：展现动作的流畅性和动态感

**规格**：
- 镜头类型：全景/中景
- 相机运动：跟随/手持
- 相机角度：平视或低角度
- 时长：4-8秒

**示例**：
```
镜头7：陆霆琛走向林婉儿
- 相机跟随陆霆琛移动
- 展现他的步伐和气场
- 动态构图
```

---

## 第三步：镜头参数设计

### 镜头类型（Shot Type）

| 类型 | 英文 | 用途 | 画面范围 |
|------|------|------|----------|
| 远景 | Establishing Shot | 建立环境 | 完整场景 |
| 全景 | Wide Shot | 展现全身 | 人物全身+环境 |
| 中景 | Medium Shot | 展现上半身 | 腰部以上 |
| 特写 | Close-up | 展现面部 | 肩部以上 |
| 大特写 | Extreme Close-up | 展现细节 | 面部局部 |
| 越肩 | Over-the-Shoulder | 对话视角 | 从肩膀看对方 |
| 主观 | POV | 第一人称 | 角色视角 |

### 相机运动（Camera Movement）

| 运动 | 英文 | 效果 | 适用场景 |
|------|------|------|----------|
| 静止 | Static | 稳定、客观 | 对话、观察 |
| 横摇 | Pan | 展现空间 | 环境扫视 |
| 竖摇 | Tilt | 展现高度 | 建筑、人物 |
| 推拉 | Dolly | 情绪变化 | 接近/远离 |
| 跟随 | Tracking | 动态感 | 行走、追逐 |
| 手持 | Handheld | 真实感 | 紧张、混乱 |
| 升降 | Crane | 宏大感 | 开场、结尾 |

### 相机角度（Camera Angle）

| 角度 | 英文 | 心理效果 | 适用场景 |
|------|------|----------|----------|
| 平视 | Eye Level | 中性、客观 | 日常对话 |
| 俯视 | High Angle | 弱小、压抑 | 展现弱势 |
| 仰视 | Low Angle | 强大、威严 | 展现权威 |
| 倾斜 | Dutch Angle | 不安、混乱 | 紧张场景 |
| 鸟瞰 | Bird's Eye | 全局视角 | 环境总览 |
| 虫视 | Worm's Eye | 极度仰视 | 极端视角 |

### 照明风格（Lighting）

| 风格 | 效果 | 适用场景 |
|------|------|----------|
| 自然光 | 真实、柔和 | 日常场景 |
| 低调照明 | 戏剧性、神秘 | 夜景、悬疑 |
| 高调照明 | 明亮、清晰 | 喜剧、广告 |
| 三点布光 | 专业、立体 | 人物特写 |
| 背光 | 轮廓、剪影 | 浪漫、神秘 |
| 侧光 | 质感、层次 | 人物塑造 |

---

## 第四步：提示词生成规则

### 提示词结构

```
[镜头类型] + [场景描述] + [角色描述] + [动作描述] + 
[相机参数] + [照明] + [情绪氛围] + [构图] + [风格标签]
```

### 实际案例

#### 输入（分镜）：
```
镜头1：总裁办公室建立镜头
- 类型：远景
- 运动：静止
- 角度：平视
- 时长：3秒
- 照明：低调照明
- 情绪：紧张
```

#### 输出（提示词）：
```
主提示词：
wide establishing shot, luxurious CEO office with floor-to-ceiling windows, 
city skyline at night, modern interior design, static camera, eye level angle, 
low-key lighting, dramatic shadows, high contrast, tense atmosphere, 
rule of thirds composition, cinematic, professional, high quality, 
detailed, realistic style

负面提示词：
blurry, low quality, distorted, deformed, ugly, bad anatomy, 
watermark, text, logo, amateur, poorly lit

技术参数：
- 画幅比例：16:9
- 时长：3秒
- 帧率：24fps
- 运动强度：0.2
```

---

## 第五步：不同模型的优化策略

### Seedance 2.1
**特点**：擅长长镜头和运动连贯性

**优化策略**：
- 增加运动描述：smooth motion, fluid movement
- 提高运动强度：motionStrength = 0.6-0.8
- 强调连贯性：continuous action, seamless transition

**适用场景**：
- 跟随镜头
- 长镜头
- 动作场景

### Wan Show
**特点**：擅长细节和质感

**优化策略**：
- 强调细节：ultra detailed, photorealistic, 8k quality
- 增加质感描述：realistic texture, fine details
- 降低运动强度：motionStrength = 0.3-0.5

**适用场景**：
- 特写镜头
- 静态场景
- 人物肖像

### Runway Gen-3
**特点**：擅长创意和风格化

**优化策略**：
- 增加艺术性：artistic style, creative composition
- 风格化描述：stylized, cinematic look
- 灵活运动：motionStrength = 0.4-0.7

**适用场景**：
- 创意镜头
- 风格化场景
- 实验性画面

---

## 实战案例：完整流程演示

### 原始剧本
```
[第1场] 总裁办公室 - 夜

林婉儿站在落地窗前，手握文件，神情紧张。
陆霆琛推门而入，目光冷峻。

陆霆琛：你为什么要这么做？
林婉儿转身，眼中含泪：我没有选择。

陆霆琛走向林婉儿，伸手想要触碰她的脸。
林婉儿后退一步，摇头。
```

### 分镜脚本

**镜头1：建立镜头**
- 类型：远景
- 内容：总裁办公室全景，落地窗外城市夜景
- 时长：3秒
- 运动：静止
- 角度：平视

**镜头2：林婉儿中景**
- 类型：中景
- 内容：林婉儿站在窗前，手握文件
- 时长：4秒
- 运动：静止
- 角度：平视

**镜头3：陆霆琛进门**
- 类型：中景
- 内容：陆霆琛推门而入
- 时长：3秒
- 运动：跟随
- 角度：平视

**镜头4：陆霆琛中景**
- 类型：中景
- 内容：陆霆琛正面，目光冷峻
- 时长：5秒
- 运动：静止
- 角度：微仰

**镜头5：林婉儿越肩**
- 类型：越肩
- 内容：从陆霆琛角度看林婉儿
- 时长：4秒
- 运动：静止
- 角度：平视

**镜头6：林婉儿特写**
- 类型：特写
- 内容：林婉儿转身，眼中含泪
- 时长：3秒
- 运动：缓慢推进
- 角度：平视

**镜头7：陆霆琛走向林婉儿**
- 类型：全景
- 内容：陆霆琛走向林婉儿
- 时长：5秒
- 运动：跟随
- 角度：平视

**镜头8：双人中景**
- 类型：中景
- 内容：陆霆琛伸手，林婉儿后退
- 时长：4秒
- 运动：静止
- 角度：平视

### 生成的提示词（示例）

**镜头1提示词：**
```
主提示词：
wide establishing shot, luxurious CEO office with floor-to-ceiling windows, 
modern city skyline at night, contemporary interior design, 
ambient city lights, static camera, eye level angle, 
low-key lighting, dramatic shadows, high contrast, 
tense atmosphere, rule of thirds composition, 
cinematic, professional, high quality, detailed, realistic style

技术参数：
- 画幅：16:9
- 时长：3秒
- 运动强度：0.2
```

**镜头6提示词：**
```
主提示词：
close-up shot, young Chinese woman, elegant business attire, 
emotional expression, tears in eyes, turning around, 
in luxurious CEO office at night, slow dolly in camera movement, 
eye level angle, soft lighting on face, dramatic backlighting, 
melancholic atmosphere, emotional depth, centered composition, 
shallow depth of field, blurred background, 
cinematic, professional, high quality, ultra detailed, realistic style

技术参数：
- 画幅：9:16
- 时长：3秒
- 运动强度：0.4
```

---

## 高级技巧

### 1. 镜头连贯性

**原则**：相邻镜头要有视觉连续性

**技巧**：
- 180度轴线规则：保持拍摄方向一致
- 匹配剪辑：动作连贯
- 视线匹配：角色视线方向一致

### 2. 情绪递进

**原则**：镜头大小随情绪强度变化

**规律**：
- 平静 → 中景/全景
- 紧张 → 中景/特写
- 高潮 → 特写/大特写

### 3. 节奏控制

**原则**：镜头时长影响节奏感

**规律**：
- 快节奏：2-3秒/镜头
- 中等节奏：4-6秒/镜头
- 慢节奏：7-10秒/镜头

### 4. 视觉引导

**原则**：用构图引导观众视线

**技巧**：
- 引导线：利用线条引导视线
- 框架构图：用前景框住主体
- 对比：用明暗/色彩突出主体

---

## 常见问题

### Q1：如何确定一个场景需要几个镜头？

**A**：根据以下因素：
- 场景时长：每10秒剧本约需2-3个镜头
- 对话数量：每段对话至少2个镜头（正反打）
- 情绪变化：每次情绪转折增加1个镜头
- 动作复杂度：复杂动作需要多角度展现

### Q2：什么时候用特写？

**A**：以下情况使用特写：
- 情绪高潮时刻
- 重要道具展示
- 关键对话
- 微表情捕捉
- 戏剧性转折

### Q3：如何选择相机运动？

**A**：根据场景需求：
- 静止：对话、观察、稳定情绪
- 推进：情绪递进、接近真相
- 跟随：动作场景、角色移动
- 手持：紧张、混乱、真实感
- 摇移：展现空间、环境扫视

### Q4：提示词太长怎么办？

**A**：优化策略：
- 保留核心要素（镜头类型、主体、动作）
- 合并相似描述
- 删除冗余形容词
- 使用简洁的英文表达
- 控制在150-200词以内

---

## 工具使用指南

### 在代码中使用

```typescript
import { parseScript, sceneToShots } from './utils/scriptToStoryboard'
import { shotToPrompt, optimizePrompt } from './utils/shotToPrompt'

// 1. 解析剧本
const scenes = parseScript(scriptText)

// 2. 生成分镜
const shots = scenes.flatMap(scene => sceneToShots(scene))

// 3. 生成提示词
const prompts = shots.map(shot => 
  shotToPrompt(shot, characters, sceneSettings)
)

// 4. 针对特定模型优化
const optimizedPrompts = prompts.map(prompt => 
  optimizePrompt(prompt, 'seedance')
)
```

---

## 总结

这套方法论提供了从剧本到视频生成的完整流程：

1. **剧本解析**：结构化提取场景信息
2. **分镜设计**：应用经典电影语言规则
3. **参数设置**：确定镜头技术参数
4. **提示词生成**：转化为模型可理解的描述
5. **模型优化**：针对不同模型调整策略

通过系统化的方法，可以确保生成的视频具有专业的电影感和叙事连贯性。
