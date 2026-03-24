import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, FileText, Clapperboard, Sparkles } from 'lucide-react'
import './AIDirectorWorkflow.css'

// Prompt Templates
const PROMPT_TEMPLATES = {
  // 阶段1：剧本解析
  stage1: `## 角色
你是一位专业的影视剧本分析师，擅长将剧本拆解为可制作的结构化内容。

## 任务
分析以下剧本，提取所有场景信息。

## 输出格式（严格 JSON）
{
  "title": "剧集标题",
  "total_scenes": 场景总数,
  "scenes": [
    {
      "scene_id": 1,
      "location": "场景名称",
      "time_of_day": "日/夜/晨/昏",
      "interior_exterior": "内/外",
      "mood": "情绪氛围",
      "characters": ["角色1", "角色2"],
      "action": "动作描述",
      "dialogue": [
        {"character": "角色名", "line": "对白内容"}
      ]
    }
  ]
}

## 剧本内容
{{INPUT}}`,

  // 阶段2：分镜拆分
  stage2: `## 角色
你是一位专业分镜导演，擅长将剧本场景转化为具体的镜头序列。必须遵循经典导演法则。

## 核心导演法则（必须遵守）

### 1. 镜头拆分规则
- 每次场景/地点变化 = 新镜头
- 新角色登场/退场 = 新镜头
- 对话场景 = 主镜头 + 角色反应镜头（至少2个镜头）
- 动作描述 = 按动作单元拆分，每个动作单元一个镜头
- 情绪高潮点 = 特写镜头（CU）
- 场景建立 = 远景（WS）

### 2. 180度法则
- 对话双方保持180度内，避免穿越轴线
- 角色关系变化时使用越肩镜头（OTS）过渡

### 3. 30度法则
- 同一物体两个镜头间，摄像机角度至少变化30度，避免跳切

### 4. 镜头节奏
- 动作场景：短镜头（2-5秒），节奏快
- 对话场景：中镜头（5-10秒），节奏平稳
- 情绪场景：长镜头（8-15秒），节奏慢

## 机位类型（shot_type）
WS (Wide Shot) 远景：建立场景、交代环境
MS (Medium Shot) 中景：角色互动、标准叙事
MCU (Medium Close-Up) 中近景：角色上半身
CU (Close-Up) 特写：强调情绪、关键道具
ECU (Extreme Close-Up) 大特写：极致情绪
OTS (Over the Shoulder) 越肩：对话场景
POV 主观视角
2S (Two Shot) 双人镜头：两个角色同框

## 运镜方式（camera_movement）
固定：静止镜头，适合对话
推：镜头向前推进，强调主体
拉：镜头向后拉出，展示环境
摇：镜头左右/上下旋转
移：镜头横向/纵向移动，跟随角色
环绕：围绕主体旋转
跟随：跟随角色移动
升降：镜头上下运动

## 输出格式（严格 JSON）
{
  "scene_id": 1,
  "location": "场景名",
  "time_of_day": "时间",
  "mood": "情绪",
  "shots": [
    {
      "shot_number": 1,
      "shot_type": "WS/MS/CU/OTS/POV/2S等",
      "camera_movement": "固定/推/拉/摇/移/环绕/跟随",
      "duration": 5,
      "characters": ["角色名"],
      "action": "具体动作描述",
      "emotion": "情绪状态",
      "dialogue": "相关对白（若无则为空）",
      "director_notes": "导演备注（可选）"
    }
  ]
}

## 场景内容
{{INPUT}}`,

  // 阶段3：分镜提示词生成
  stage3: `## 角色
你是一位专业的 AI 视频生成提示词专家，擅长将分镜描述转化为 Seedance/即梦 可用的中文提示词。

## Seedance 提示词规范（必须遵守）

### 1. 提示词结构
[场景描述] + [角色描述] + [动作描述] + [运镜描述] + [氛围/情绪] + [时间线（可选）]

### 2. 运镜关键词（必须使用中文）
- 固定镜头 / 静止镜头
- 推镜头 / 拉镜头 / 推近 / 拉远
- 摇镜头 / 左右摇镜 / 上下摇镜
- 移镜头 / 横向移动 / 纵向移动
- 环绕镜头 / 360度环绕
- 跟随镜头 / 跟拍
- 俯拍 / 仰拍 / 低角度 / 高角度
- 特写 / 中景 / 远景 / 全景
- 一镜到底
- 切镜 / 切换镜头

### 3. 参考图引用格式
- @图片1、@图片2 ... = 参考图
- @视频1、@视频2 ... = 参考视频
- 示例："角色形象参考@图片1的西装男子"

### 4. 提示词特点
- 使用自然中文，不要直译英文
- 描述要具体、视觉化
- 动作描述要清晰，如"男主角推门而入"、"女主回头"
- 包含情绪词汇：紧张、温馨、浪漫、诡异等

## 输出格式（严格 JSON）
{
  "shot_number": 1,
  "prompt": "中文提示词，精确描述画面，融入运镜",
  "chinese_description": "中文分镜描述",
  "reference_images": ["@图片1描述"],
  "camera_movement": "运镜关键词"
}

## 分镜内容
{{INPUT}}

## 已有角色参考图（如有）
{{CHARACTER_REFS}}
- 夜不语_帝君: @图片1
- 姬无垢_女帝: @图片2

## 已有场景参考图（如有）
{{SCENE_REFS}}
- 大殿_日: @图片3`
}

// 测试剧本片段
const TEST_SCRIPT = `第1集：帝后恩断义绝

1-1 日 内 大殿
人物：姬无垢、夜不语、墨兰辞、雷神、内官、群臣、侍卫若干

[BGM：庄严肃穆的登基乐曲，渐转诡异]
▲ 大殿内，金碧辉煌，群臣跪拜。姬无垢身着华丽帝袍，头戴帝冠，端坐龙椅之上，眼神高傲。
▲ 夜不语身着玄色帝君华服，与姬无垢的帝袍相映生辉，站在殿下面带喜色，遥望姬无垢。
【特写：夜不语的微笑，眼神中充满爱意和骄傲】
夜不语：（内心OS）今日是她登基为帝的大日子，而她，更是我的妻子。
姬无垢：（声音威严）众爱卿平身。
▲ 群臣起身，纷纷向夜不语拱手示意，眼中满是敬畏。
大臣甲：（赔笑）恭喜帝君，贺喜帝君！此次神魔大战，若非帝君带领幽冥使一族出手相助，陛下岂能轻易平定天下！
大臣乙：（奉承）是是啊，帝君可是拯救神界的英雄！幽冥使一族果然名不虚传！
▲ 夜不语微微一笑，谦逊地点头示意，周身隐隐泛起幽冥之气。
▲ 突然，他抬手挥动，一道黑色符文闪现，殿内烛火瞬间变成幽蓝色，又恢复正常。
【特效：夜不语指尖幽光流转，群臣惊叹】
夜不语：（淡笑）雕虫小技而已能为陛下效力，是本君的荣幸。
▲ 群臣惊叹之余，一道身影款款步入大殿。
▲ 墨兰辞一袭花神华服，姿态妖冶，手中轻摇一柄百花折扇，扇面上绣着绽放的鸢尾花。
墨兰辞：（轻抚手中折扇，娇声）陛下万寿无疆，臣来迟了~
▲ 墨兰辞走到殿中央，目光在夜不语身上停留片刻眼底闪过一丝不易察觉的冷意，随即跪下。
墨兰辞：（哭腔，委屈）陛下，臣有事启奏！
▲ 姬无垢眉头微蹙，但看向墨兰辞时，眼神又变得温柔，甚至带着一丝痴迷。
姬无垢：爱卿何事？起来说话。
墨兰辞：（起身，折扇轻掩面庞）臣昨日路过帝君府邸，见帝君父母言笑晏晏，臣总觉得他们的笑容……不真，似乎对陛下有所不敬，恐有异心！
▲ 夜不语闻言，脸色骤变，怒视墨兰辞。
夜不语：（怒斥）墨兰辞！你血口喷人！我父母对陛下忠心耿耿，从未有过二心！
▲ 夜不语周身幽冥之气暴涨，黑雾弥漫，他猛地抬手，一道黄符直射墨兰辞面门！
【特效：夜不语指尖幽光暴涨，黄符化作黑气袭向墨兰辞】
夜不语：（冷喝）既然你满口胡言，我便让你尝尝幽冥使的厉害！
▲ 墨兰辞脸色大变，惊呼一声连连后退。
墨兰辞：（惊呼）啊！陛下救我！
▲ 就在黄符即将击中墨兰辞的瞬间，姬无垢抬手，一道金光挡下！
▲ 黑气与金光相撞，殿内一阵震动！
姬无垢：（眼神冰冷）放肆！墨兰辞乃朕亲封的花神帝君，岂容你随意质疑？
▲ 姬无垢眼神扫过夜不语，带着失望与冷意。
▲ 墨兰辞躲在姬无垢身后，折扇轻摇，脸上露出得意又挑衅的笑容。
墨兰辞：（娇声）陛下你看，帝君想杀我呢~幽冥使一族果然心怀不轨~
▲ 雷神手持雷锤，出现在殿外，等待指令。
【特效：雷神身边电光闪烁】
姬无垢：雷神何在？
雷神：臣在！
姬无垢：帝君父母不敬帝后，藐视天威，着雷神以天雷惩之！
▲ 夜不语惊骇欲绝，瞪大双眼，不可置信地望向姬无垢。
夜不语：（内心OS）不！
▲ 雷神领命，天空中乌云密布，雷电交加。
[音效：雷鸣电闪，父母惨叫]
▲ 夜不语父母的虚影在殿外被天雷活活击杀，化为灰烬。
▲ 夜不语双膝跪地，发出悲痛欲绝的嘶吼，悲愤欲绝地扑向墨兰辞。
夜不语：墨兰辞！你害我父母！我杀了你！
▲ 姬无垢抬手，一巴掌扇在夜不语脸上。
[音效：清脆巴掌声]
▲ 夜不语嘴角溢血，身体倒飞出去，撞上大殿石柱，吐出一口鲜血。
【慢镜头：姬无垢冷漠的眼神，夜不语绝望的表情】
姬无垢：他们已经死了，难道你还想让高高在上的花神替两个低贱的族类偿命不成？
姬无垢：身为帝君，却毫无包容人的气度，实在难登大雅之堂！
姬无垢：传命下去，将夜不语贬为侍君，囚禁于偏殿，另立花神墨兰辞为帝君，入住帝后宫！
▲ 墨兰辞闻言，脸上露出得意又挑衅的笑容，看向倒地的夜不语。
【特写：墨兰辞的得意，夜不语的绝望和恨意】
[BGM：哀怨的笛声响起]
▲ 夜不语眼神空洞，看着姬无垢和墨兰辞恩爱相拥，心中爱意尽毁，只剩下无尽的恨意。

（本集完）`

interface Stage {
  id: string
  name: string
  icon: React.ElementType
  description: string
}

const stages: Stage[] = [
  { id: 'stage1', name: '阶段一', icon: FileText, description: '剧本解析：剧本 → 结构化场景' },
  { id: 'stage2', name: '阶段二', icon: Clapperboard, description: '分镜拆分：场景 → 分镜脚本' },
  { id: 'stage3', name: '阶段三', icon: Sparkles, description: '提示词生成分镜 → Seedance提示词' },
]

export default function AIDirectorWorkflow() {
  const [currentStage, setCurrentStage] = useState<string>('stage1')
  const [inputText, setInputText] = useState('')
  const [copied, setCopied] = useState(false)

  const loadTemplate = () => {
    const template = PROMPT_TEMPLATES[currentStage as keyof typeof PROMPT_TEMPLATES]
    return template.replace('{{INPUT}}', inputText)
  }

  const loadTestScript = () => {
    setInputText(TEST_SCRIPT)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(loadTemplate())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="workflow-page">
      <header className="workflow-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          <span>返回</span>
        </Link>
        <h1>AI 导演工作流测试</h1>
        <p className="subtitle">剧本 → 分镜 → 视频提示词</p>
      </header>

      {/* Stage Tabs */}
      <div className="stage-tabs">
        {stages.map((stage) => (
          <button
            key={stage.id}
            className={`stage-tab ${currentStage === stage.id ? 'active' : ''}`}
            onClick={() => {
              setCurrentStage(stage.id)
            }}
          >
            <stage.icon size={18} />
            <span>{stage.name}</span>
            <small>{stage.description}</small>
          </button>
        ))}
      </div>

      <div className="workflow-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="section-header">
            <h2>
              {currentStage === 'stage1' && '输入剧本'}
              {currentStage === 'stage2' && '输入场景解析结果'}
              {currentStage === 'stage3' && '输入分镜脚本'}
            </h2>
            <button className="btn btn-sm btn-outline" onClick={loadTestScript}>
              加载测试剧本
            </button>
          </div>
          <textarea
            className="input-textarea"
            placeholder={
              currentStage === 'stage1' ? '粘贴剧本内容...' :
              currentStage === 'stage2' ? '粘贴阶段一的JSON输出...' :
              '粘贴阶段二的JSON输出...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="input-stats">
            字数：{inputText.length}
          </div>
        </div>

        {/* Output Section */}
        <div className="output-section">
          <div className="section-header">
            <h2>生成的 Prompt</h2>
            <div className="header-actions">
              <button className="btn btn-sm btn-secondary" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '已复制' : '复制 Prompt'}
              </button>
            </div>
          </div>
          <textarea
            className="output-textarea"
            readOnly
            value={loadTemplate()}
            placeholder="生成的 Prompt 将显示在这里..."
          />
        </div>
      </div>

      {/* Tips */}
      <div className="workflow-tips">
        <h3>使用说明</h3>
        <ol>
          <li>选择当前测试阶段（阶段一/二/三）</li>
          <li>输入对应的内容（剧本/场景解析/分镜脚本）</li>
          <li>点击"复制 Prompt"按钮</li>
          <li>将复制的 Prompt 粘贴到 Kiro 或 Claude 中执行</li>
          <li>将 AI 输出作为下一阶段的输入，继续测试</li>
        </ol>
      </div>
    </div>
  )
}
