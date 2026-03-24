import { useState } from 'react'
import { Image, Video, Plus, X, Upload } from 'lucide-react'

interface Reference {
  id: string
  type: 'image' | 'video'
  url: string
  name: string
  category: 'character' | 'scene' | 'action'
}

interface Props {
  onReferenceAdd: (ref: Reference) => void
  onReferenceRemove: (id: string) => void
  references: Reference[]
}

export default function ReferenceManager({ onReferenceAdd, onReferenceRemove, references }: Props) {
  const [activeCategory, setActiveCategory] = useState<'character' | 'scene' | 'action'>('character')

  const categoryRefs = references.filter(r => r.category === activeCategory)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const url = URL.createObjectURL(file)

    onReferenceAdd({
      id: `ref-${Date.now()}`,
      type: isVideo ? 'video' : 'image',
      url,
      name: file.name,
      category: activeCategory
    })
  }

  return (
    <div style={{ background: 'var(--bg-card)', padding: 20, borderRadius: 12 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>参考素材管理</h3>

      {/* 分类选择 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { value: 'character', label: '角色参考', icon: '👤' },
          { value: 'scene', label: '场景参考', icon: '🏛️' },
          { value: 'action', label: '动作参考', icon: '🎬' }
        ].map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value as any)}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: activeCategory === cat.value ? 'var(--primary)' : 'var(--bg-input)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              color: activeCategory === cat.value ? 'white' : 'var(--text)',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* 参考图列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginBottom: 16 }}>
        {categoryRefs.map(ref => (
          <div
            key={ref.id}
            style={{
              position: 'relative',
              aspectRatio: '1',
              background: 'var(--bg-input)',
              borderRadius: 8,
              overflow: 'hidden'
            }}
          >
            {ref.type === 'image' ? (
              <img src={ref.url} alt={ref.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #334155, #475569)' }}>
                <Video size={24} />
              </div>
            )}
            <button
              onClick={() => onReferenceRemove(ref.id)}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 24,
                height: 24,
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                borderRadius: 4,
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* 上传按钮 */}
        <label
          style={{
            aspectRatio: '1',
            border: '2px dashed var(--border)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'var(--bg-input)'
          }}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <Plus size={24} style={{ marginBottom: 4, color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>上传</span>
        </label>
      </div>

      {/* 使用说明 */}
      <div style={{ padding: 12, background: 'rgba(99,102,241,0.1)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)' }}>
        💡 提示：上传的参考图将自动在提示词中引用为 @图片1、@图片2 等格式
      </div>
    </div>
  )
}
