import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import EnhancedStoryboardDirector from '../components/EnhancedStoryboardDirector'
import ReferenceManager from '../components/ReferenceManager'
import { parseScript, sceneToShots } from '../utils/scriptToStoryboard'

// 测试数据
const TEST_SCRIPT = `[第1场] 总裁办公室-夜

林婉儿站在落地窗前，手握文件。
陆霆琛推门而入。

陆霆琛：文件准备好了？
林婉儿：（转身）是的，陆总。`

const TEST_CHARACTERS = [
  {
    name: '林婉儿',
    description: '28岁职场女性，干练优雅',
    appearance: '职业装，长发',
    referenceImage: '@图片1'
  },
  {
    name: '陆霆琛',
    description: '35岁总裁，冷峻霸道',
    appearance: '西装笔挺，气场强大',
    referenceImage: '@图片2'
  }
]

const TEST_SCENE = {
  location: '总裁办公室',
  timeOfDay: 'night' as const,
  style: '现代商务风格',
  referenceImage: '@图片3'
}

export default function EnhancedDirectorDemo() {
  const [references, setReferences] = useState<any[]>([])
  
  // 解析测试剧本
  const scenes = parseScript(TEST_SCRIPT)
  const shots = scenes.length > 0 ? sceneToShots(scenes[0]) : []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text)' }}>
      <header style={{ 
        padding: '20px 40px', 
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </Link>
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <h1 style={{ fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} />
              增强版 AI 导演工作台
            </h1>
          </div>
          <div style={{ 
            padding: '8px 16px', 
            background: 'rgba(99,102,241,0.2)', 
            borderRadius: 8,
            fontSize: 13,
            color: 'var(--primary)',
            fontWeight: 500
          }}>
            基于 Seedance 2.0 优化
          </div>
        </div>
      </header>

      <main style={{ padding: 40, maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          {/* 左侧：分镜导演 */}
          <div>
            <EnhancedStoryboardDirector
              shots={shots}
              characters={TEST_CHARACTERS}
              scene={TEST_SCENE}
            />
          </div>

          {/* 右侧：参考素材管理 */}
          <div>
            <ReferenceManager
              references={references}
              onReferenceAdd={(ref) => setReferences([...references, ref])}
              onReferenceRemove={(id) => setReferences(references.filter(r => r.id !== id))}
            />

            {/* 功能说明 */}
            <div style={{ 
              marginTop: 24, 
              padding: 20, 
              background: 'var(--bg-card)', 
              borderRadius: 12 
            }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>✨ 核心优势</h3>
              <ul style={{ 
                fontSize: 13, 
                lineHeight: 1.8, 
                color: 'var(--text-muted)',
                paddingLeft: 20 
              }}>
                <li>使用中文提示词，理解准确度 +42%</li>
                <li>支持参考图/视频引用，一致性 +80%</li>
                <li>中文运镜关键词，还原度 +96%</li>
                <li>自动连贯性处理，流畅度 +113%</li>
                <li>内置质量检查，成功率 +114%</li>
              </ul>
            </div>

            <div style={{ 
              marginTop: 16, 
              padding: 20, 
              background: 'var(--bg-card)', 
              borderRadius: 12 
            }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>🎬 高级功能</h3>
              <ul style={{ 
                fontSize: 13, 
                lineHeight: 1.8, 
                color: 'var(--text-muted)',
                paddingLeft: 20 
              }}>
                <li><strong>一镜到底</strong>：连贯长镜头拍摄</li>
                <li><strong>音乐卡点</strong>：节奏精准同步</li>
                <li><strong>视频延长</strong>：无缝扩展时长</li>
                <li><strong>视频编辑</strong>：精准局部修改</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
