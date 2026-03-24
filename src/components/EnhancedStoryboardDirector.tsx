import { useState } from 'react'
import { Wand2, Image, Play, CheckCircle, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { 
  generateSeedancePrompt, 
  validatePrompt,
  generateOneTakePrompt,
  generateMusicSyncPrompt,
  type EnhancedVideoPrompt 
} from '../utils/shotToPrompt.enhanced'
import type { Shot } from '../utils/scriptToStoryboard'

interface Props {
  shots: Shot[]
  characters: Array<{
    name: string
    description: string
    appearance: string
    referenceImage?: string
  }>
  scene: {
    location: string
    timeOfDay: string
    style: string
    referenceImage?: string
  }
}

export default function EnhancedStoryboardDirector({ shots, characters, scene }: Props) {
  const [selectedShot, setSelectedShot] = useState(shots[0])
  const [generationMode, setGenerationMode] = useState<'normal' | 'oneTake' | 'musicSync'>('normal')
  const [generatedPrompt, setGeneratedPrompt] = useState<EnhancedVideoPrompt | null>(null)
  const [showValidation, setShowValidation] = useState(false)

  const handleGeneratePrompt = () => {
    let prompt: EnhancedVideoPrompt

    const shotIndex = shots.findIndex(s => s.id === selectedShot.id)
    const previousShot = shotIndex > 0 ? shots[shotIndex - 1] : undefined

    switch (generationMode) {
      case 'normal':
        prompt = generateSeedancePrompt(selectedShot, characters, scene, previousShot)
        break
      case 'oneTake':
        prompt = generateOneTakePrompt(shots.slice(0, 3), characters, scene)
        break
      case 'musicSync':
        prompt = generateMusicSyncPrompt(
          shots.slice(0, 5),
          characters,
          scene,
          { id: 'music1', bpm: 120, keyMoments: [0, 3, 6, 9, 12] }
        )
        break
      default:
        prompt = generateSeedancePrompt(selectedShot, characters, scene, previousShot)
    }

    setGeneratedPrompt(prompt)
    setShowValidation(true)
  }

  const validation = generatedPrompt ? validatePrompt(generatedPrompt) : null

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 20 }}>增强版分镜导演台</h2>
      
      {/* 模式选择 */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 14, marginBottom: 12, display: 'block', color: 'var(--text-muted)' }}>
          生成模式
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { value: 'normal', label: '普通模式', desc: '逐个生成镜头' },
            { value: 'oneTake', label: '一镜到底', desc: '连贯长镜头' },
            { value: 'musicSync', label: '音乐卡点', desc: '节奏同步' }
          ].map(mode => (
            <button
              key={mode.value}
              onClick={() => setGenerationMode(mode.value as any)}
              style={{
                flex: 1,
                padding: 16,
                background: generationMode === mode.value ? 'var(--primary)' : 'var(--bg-input)',
                border: `2px solid ${generationMode === mode.value ? 'var(--primary)' : 'transparent'}`,
                borderRadius: 8,
                cursor: 'pointer',
                color: generationMode === mode.value ? 'white' : 'var(--text)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{mode.label}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={handleGeneratePrompt}
        style={{
          padding: '12px 24px',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24
        }}
      >
        <Wand2 size={16} />
        生成 Seedance 2.0 提示词
      </button>

      {/* 提示词展示 */}
      {generatedPrompt && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} />
            生成的中文提示词
          </h3>
          
          <textarea
            readOnly
            value={generatedPrompt.chinesePrompt}
            style={{
              width: '100%',
              minHeight: 120,
              padding: 16,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text)',
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 16
            }}
          />

          {/* 技术参数 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>运镜</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{generatedPrompt.cameraMovement}</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>画幅</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{generatedPrompt.technicalParams.aspectRatio}</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>时长</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{generatedPrompt.technicalParams.duration}秒</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>情绪强度</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{generatedPrompt.emotionIntensity}</div>
            </div>
          </div>

          {/* 参考图 */}
          {generatedPrompt.referenceImages.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>参考图</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {generatedPrompt.referenceImages.map((ref, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(99,102,241,0.2)',
                      color: 'var(--primary)',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500
                    }}
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 连贯性说明 */}
          {generatedPrompt.continuityNotes && (
            <div style={{ padding: 12, background: 'rgba(99,102,241,0.1)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>连贯性说明</div>
              <div style={{ fontSize: 13 }}>{generatedPrompt.continuityNotes}</div>
            </div>
          )}
        </div>
      )}

      {/* 质量检查 */}
      {validation && showValidation && (
        <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            质量检查
          </h3>

          {validation.isValid ? (
            <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 8, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} />
              提示词质量良好，可以直接使用
            </div>
          ) : (
            <>
              {validation.warnings.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--warning)' }}>
                    ⚠️ 警告
                  </div>
                  {validation.warnings.map((warning, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 10,
                        background: 'rgba(245,158,11,0.1)',
                        borderRadius: 6,
                        fontSize: 13,
                        marginBottom: 8,
                        borderLeft: '3px solid var(--warning)'
                      }}
                    >
                      {warning}
                    </div>
                  ))}
                </div>
              )}

              {validation.suggestions.length > 0 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--primary)' }}>
                    💡 优化建议
                  </div>
                  {validation.suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 10,
                        background: 'rgba(99,102,241,0.1)',
                        borderRadius: 6,
                        fontSize: 13,
                        marginBottom: 8,
                        borderLeft: '3px solid var(--primary)'
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
