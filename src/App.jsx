import { useState, useCallback, useRef } from 'react'
import * as IMG from './assets/deviceImages'

// ── PROTOCOLS ────────────────────────────────────────────────────────────────
const PROTOCOLS = [
  { id: 'profinet',    label: 'PROFINET',     color: '#00aa66', dash: 'none',       width: 2.5 },
  { id: 'ethernet_ip', label: 'EtherNet/IP',  color: '#cc8800', dash: '8,4',        width: 2 },
  { id: 'modbus_tcp',  label: 'Modbus TCP',   color: '#2277cc', dash: '4,4',        width: 2 },
  { id: 'profibus',    label: 'PROFIBUS DP',  color: '#cc3300', dash: '10,3,2,3',   width: 2 },
  { id: 'webserver',   label: 'Web Server',   color: '#9933cc', dash: '3,3',        width: 1.5, wireless: true },
  { id: 'vpn',         label: 'VPN',          color: '#0066cc', dash: '6,3',        width: 2,   wireless: true },
  { id: 'ethernet',    label: 'Ethernet',     color: '#555555', dash: 'none',       width: 1.5 },
]

// ── DEVICE CATALOG ────────────────────────────────────────────────────────────
const DEVICES = [
  { type: 'S7_1500',      label: 'S7-1500',           group: 'CLPs',        img: IMG.S7_1500 },
  { type: 'S7_1200',      label: 'S7-1200',           group: 'CLPs',        img: IMG.S7_1200 },
  { type: 'S7_300',       label: 'S7-300',            group: 'CLPs',        img: IMG.S7_300 },
  { type: 'S7_400',       label: 'S7-400',            group: 'CLPs',        img: IMG.S7_400 },
  { type: 'LOGO_PLC',     label: 'LOGO!',             group: 'CLPs',        img: IMG.LOGO_PLC },
  { type: 'ET200AL',      label: 'ET 200AL',          group: 'I/O Remotas', img: IMG.ET200AL },
  { type: 'ET200ECO',     label: 'ET 200eco PN',      group: 'I/O Remotas', img: IMG.ET200ECO },
  { type: 'ET200PRO',     label: 'ET 200PRO',         group: 'I/O Remotas', img: IMG.ET200PRO },
  { type: 'REMOTA',       label: 'ET 200SP',          group: 'I/O Remotas', img: IMG.REMOTA },
  { type: 'SWITCH',       label: 'Switch SCALANCE',   group: 'Rede',        img: IMG.SWITCH },
  { type: 'GATEWAY',      label: 'Gateway',           group: 'Rede',        img: IMG.GATEWAY },
  { type: 'SERVIDOR',     label: 'Servidor WinCC',    group: 'SCADA/PC',    img: IMG.SERVIDOR },
  { type: 'STANDALONE',   label: 'Standalone',        group: 'SCADA/PC',    img: IMG.STANDALONE },
  { type: 'CLIENTE',      label: 'Cliente Operação',  group: 'SCADA/PC',    img: IMG.CLIENTE },
  { type: 'ENGENHARIA',   label: 'Est. Engenharia',   group: 'SCADA/PC',    img: IMG.ENGENHARIA },
  { type: 'BANCO_DE_DADOS',label: 'Banco de Dados',  group: 'SCADA/PC',    img: IMG.BANCO_DE_DADOS },
  { type: 'MOTOR',        label: 'Motor',             group: 'Campo',       img: IMG.MOTOR },
  { type: 'DEVICE',       label: 'Dispositivo',       group: 'Campo',       img: IMG.DEVICE },
  { type: 'VPN',          label: 'VPN',               group: 'Rede',        img: null, svgIcon: 'vpn' },
  { type: 'FIREWALL',     label: 'Firewall',          group: 'Rede',        img: null, svgIcon: 'firewall' },
]

const GROUPS = ['CLPs', 'I/O Remotas', 'SCADA/PC', 'Rede', 'Campo']

// ── SVG ICONS FOR VPN & FIREWALL ─────────────────────────────────────────────
function VpnIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" fill="#dbeafe" stroke="#2277cc" strokeWidth="2"/>
      <circle cx="32" cy="32" r="16" fill="#bfdbfe" stroke="#2277cc" strokeWidth="1.5"/>
      <ellipse cx="32" cy="32" rx="10" ry="26" fill="none" stroke="#2277cc" strokeWidth="1.5"/>
      <line x1="6" y1="32" x2="58" y2="32" stroke="#2277cc" strokeWidth="1.5"/>
      <line x1="10" y1="20" x2="54" y2="20" stroke="#2277cc" strokeWidth="1"/>
      <line x1="10" y1="44" x2="54" y2="44" stroke="#2277cc" strokeWidth="1"/>
      <rect x="24" y="26" width="16" height="12" rx="2" fill="#2277cc" opacity="0.15" stroke="#2277cc" strokeWidth="1.2"/>
      <rect x="28" y="20" width="8" height="7" rx="1.5" fill="none" stroke="#2277cc" strokeWidth="1.2"/>
      <text x="32" y="70" textAnchor="middle" fill="#1a1a2e" fontSize="9" fontFamily="DM Sans,sans-serif" fontWeight="600">VPN</text>
    </svg>
  )
}

function FirewallIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M32 6 L54 16 L54 36 Q54 52 32 58 Q10 52 10 36 L10 16 Z" fill="#fee2e2" stroke="#cc3300" strokeWidth="2"/>
      <path d="M32 12 L50 20 L50 36 Q50 49 32 54 Q14 49 14 36 L14 20 Z" fill="#fca5a5" opacity="0.4"/>
      <line x1="32" y1="12" x2="32" y2="54" stroke="#cc3300" strokeWidth="1.5"/>
      <line x1="14" y1="28" x2="50" y2="28" stroke="#cc3300" strokeWidth="1.5"/>
      <line x1="14" y1="40" x2="50" y2="40" stroke="#cc3300" strokeWidth="1"/>
      <rect x="22" y="30" width="8" height="6" rx="1" fill="#cc3300" opacity="0.7"/>
      <rect x="34" y="18" width="8" height="6" rx="1" fill="#cc3300" opacity="0.7"/>
      <text x="32" y="70" textAnchor="middle" fill="#1a1a2e" fontSize="9" fontFamily="DM Sans,sans-serif" fontWeight="600">Firewall</text>
    </svg>
  )
}

// ── DEVICE NODE ───────────────────────────────────────────────────────────────
function DeviceNode({ node, selected, connecting, onMouseDown, onConnect, onDelete, onLabelChange }) {
  const dev = DEVICES.find(d => d.type === node.type)
  const [editingLabel, setEditingLabel] = useState(false)
  const [labelVal, setLabelVal] = useState(node.customLabel || dev?.label || '')

  const handleLabelBlur = () => {
    setEditingLabel(false)
    onLabelChange(node.id, labelVal)
  }

  return (
    <div
      onMouseDown={e => onMouseDown(e, node.id)}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', left: node.x, top: node.y,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: connecting ? 'crosshair' : 'grab',
        userSelect: 'none', zIndex: selected ? 20 : 1,
        width: 80,
      }}
    >
      {/* Context toolbar */}
      {selected && !connecting && (
        <div style={{
          position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 3, whiteSpace: 'nowrap', zIndex: 30,
          animation: 'fadeIn 0.15s ease',
        }}>
          <button onClick={e => { e.stopPropagation(); onConnect(node.id) }}
            style={{ padding: '3px 8px', background: '#009999', border: 'none', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
            + Conectar
          </button>
          <button onClick={e => { e.stopPropagation(); setEditingLabel(true) }}
            style={{ padding: '3px 7px', background: '#334455', border: 'none', color: '#fff', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>
            ✎
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(node.id) }}
            style={{ padding: '3px 7px', background: '#cc3300', border: 'none', color: '#fff', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>
            ✕
          </button>
        </div>
      )}

      {/* Icon container */}
      <div style={{
        width: 72, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? 'rgba(0,153,153,0.08)' : 'transparent',
        border: selected ? '2px solid rgba(0,153,153,0.5)' : '2px solid transparent',
        borderRadius: 8,
        transition: 'all 0.15s',
        outline: connecting === node.id ? '2px solid #cc8800' : 'none',
        outlineOffset: 2,
      }}>
        {dev?.img ? (
          <img src={dev.img} alt={dev.label} style={{ maxWidth: 64, maxHeight: 64, objectFit: 'contain' }} />
        ) : dev?.svgIcon === 'vpn' ? (
          <VpnIcon size={56} />
        ) : (
          <FirewallIcon size={56} />
        )}
      </div>

      {/* Label */}
      {editingLabel ? (
        <input
          autoFocus
          value={labelVal}
          onChange={e => setLabelVal(e.target.value)}
          onBlur={handleLabelBlur}
          onKeyDown={e => { if (e.key === 'Enter') handleLabelBlur() }}
          onClick={e => e.stopPropagation()}
          style={{
            width: 80, textAlign: 'center', fontSize: 11, fontWeight: 600,
            border: '1px solid #009999', borderRadius: 4,
            background: '#fff', color: '#1a1a2e', padding: '2px 4px',
            outline: 'none', fontFamily: 'DM Sans, sans-serif',
          }}
        />
      ) : (
        <div
          onDoubleClick={e => { e.stopPropagation(); setEditingLabel(true) }}
          style={{
            marginTop: 4, fontSize: 11, fontWeight: 600,
            color: '#1a1a2e', textAlign: 'center',
            maxWidth: 80, lineHeight: 1.3, wordBreak: 'break-word',
            background: 'rgba(255,255,255,0.85)',
            padding: '1px 4px', borderRadius: 3,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {node.customLabel || dev?.label}
        </div>
      )}
    </div>
  )
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedProtocol, setSelectedProtocol] = useState('profinet')
  const [connecting, setConnecting] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedConn, setSelectedConn] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [openGroup, setOpenGroup] = useState('CLPs')
  const [diagramTitle, setDiagramTitle] = useState('Arquitetura de Rede')
  const [diagramNotes, setDiagramNotes] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const canvasRef = useRef(null)
  const nextId = useRef(1)

  const addDevice = useCallback((type) => {
    setNodes(n => [...n, {
      id: `n${nextId.current++}`, type,
      x: 120 + Math.random() * 500,
      y: 80 + Math.random() * 350,
      customLabel: '',
    }])
  }, [])

  const deleteNode = useCallback((id) => {
    setNodes(n => n.filter(x => x.id !== id))
    setConnections(c => c.filter(x => x.from !== id && x.to !== id))
    setSelectedNode(null)
  }, [])

  const deleteConn = useCallback((id) => {
    setConnections(c => c.filter(x => x.id !== id))
    setSelectedConn(null)
  }, [])

  const updateLabel = useCallback((id, label) => {
    setNodes(n => n.map(x => x.id === id ? { ...x, customLabel: label } : x))
  }, [])

  const onMouseDown = useCallback((e, nodeId) => {
    e.stopPropagation()
    if (connecting) {
      if (connecting !== nodeId) {
        setConnections(c => [...c, { id: `c${nextId.current++}`, from: connecting, to: nodeId, protocol: selectedProtocol }])
      }
      setConnecting(null)
      return
    }
    const rect = canvasRef.current.getBoundingClientRect()
    const node = nodes.find(n => n.id === nodeId)
    setDragging(nodeId)
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y })
    setSelectedNode(nodeId)
    setSelectedConn(null)
  }, [connecting, nodes, selectedProtocol])

  const onMouseMove = useCallback((e) => {
    if (!dragging) return
    const rect = canvasRef.current.getBoundingClientRect()
    setNodes(n => n.map(nd => nd.id === dragging
      ? { ...nd, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y }
      : nd
    ))
  }, [dragging, dragOffset])

  const onMouseUp = useCallback(() => setDragging(null), [])

  const onCanvasClick = useCallback(() => {
    if (connecting) { setConnecting(null); return }
    setSelectedNode(null); setSelectedConn(null)
  }, [connecting])

  const prot = PROTOCOLS.find(p => p.id === selectedProtocol)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f2f4', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none} }
        @keyframes pulse  { 0%,100%{opacity:1}50%{opacity:0.4} }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{ width: 220, background: '#111416', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0, borderRight: '1px solid #1e2326' }}>

        {/* Header */}
        <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #1e2326' }}>
          <div style={{ color: '#009999', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'Rajdhani, sans-serif' }}>SIEMENS</div>
          <div style={{ color: '#334455', fontSize: 10, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>Network Architect</div>
        </div>

        {/* Diagram info */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e2326' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334455', letterSpacing: '0.1em', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif' }}>TÍTULO DO DIAGRAMA</div>
          <input
            value={diagramTitle}
            onChange={e => setDiagramTitle(e.target.value)}
            style={{
              width: '100%', padding: '6px 8px', background: '#0d0f10',
              border: '1px solid #1e2326', borderRadius: 5,
              color: '#f0f2f4', fontSize: 12, fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334455', letterSpacing: '0.1em', margin: '8px 0 4px', fontFamily: 'Rajdhani, sans-serif' }}>OBSERVAÇÕES</div>
          <textarea
            value={diagramNotes}
            onChange={e => setDiagramNotes(e.target.value)}
            placeholder="Notas, versão, autor..."
            rows={3}
            style={{
              width: '100%', padding: '6px 8px', background: '#0d0f10',
              border: '1px solid #1e2326', borderRadius: 5, resize: 'none',
              color: '#8a9199', fontSize: 11, fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Protocol selector */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e2326' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334455', letterSpacing: '0.1em', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif' }}>PROTOCOLO</div>
          {PROTOCOLS.map(p => (
            <div key={p.id} onClick={() => setSelectedProtocol(p.id)} style={{
              padding: '5px 8px', borderRadius: 4, marginBottom: 3, cursor: 'pointer',
              border: selectedProtocol === p.id ? `1px solid ${p.color}` : '1px solid #1e2326',
              background: selectedProtocol === p.id ? '#1a1e22' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.12s',
            }}>
              <svg width="28" height="8" style={{ flexShrink: 0 }}>
                <line x1="0" y1="4" x2="28" y2="4" stroke={p.color} strokeWidth={p.width} strokeDasharray={p.dash === 'none' ? undefined : p.dash}/>
              </svg>
              <span style={{ color: selectedProtocol === p.id ? p.color : '#556', fontSize: 10, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* Device catalog */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334455', letterSpacing: '0.1em', marginBottom: 8, fontFamily: 'Rajdhani, sans-serif' }}>DISPOSITIVOS</div>
          {GROUPS.map(group => {
            const groupDevices = DEVICES.filter(d => d.group === group)
            const isOpen = openGroup === group
            return (
              <div key={group} style={{ marginBottom: 6 }}>
                <div onClick={() => setOpenGroup(isOpen ? null : group)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '5px 6px', borderRadius: 4, cursor: 'pointer',
                  background: isOpen ? '#1a1e22' : 'transparent',
                  border: '1px solid ' + (isOpen ? '#2a3040' : 'transparent'),
                  marginBottom: isOpen ? 4 : 0,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isOpen ? '#009999' : '#667', letterSpacing: '0.06em', fontFamily: 'Rajdhani, sans-serif' }}>{group}</span>
                  <span style={{ color: '#445', fontSize: 10 }}>{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && groupDevices.map(dev => (
                  <div key={dev.type} onClick={() => addDevice(dev.type)} style={{
                    padding: '6px 8px', borderRadius: 4, marginBottom: 2, cursor: 'pointer',
                    border: '1px solid #1e2326', background: '#0d0f10',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#334455'; e.currentTarget.style.background = '#161a1c' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2326'; e.currentTarget.style.background = '#0d0f10' }}
                  >
                    <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {dev.img ? (
                        <img src={dev.img} alt={dev.label} style={{ maxWidth: 28, maxHeight: 28, objectFit: 'contain' }}/>
                      ) : dev.svgIcon === 'vpn' ? (
                        <VpnIcon size={24}/>
                      ) : (
                        <FirewallIcon size={24}/>
                      )}
                    </div>
                    <span style={{ color: '#ccc', fontSize: 11, fontWeight: 500 }}>{dev.label}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

      </div>

      {/* ── CANVAS ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f8f9fa' }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e5e7eb',
          backdropFilter: 'blur(8px)',
          padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {connecting && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#cc8800', animation: 'pulse 0.8s infinite' }}/>}
            <span style={{ color: connecting ? '#cc8800' : '#888', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
              {connecting ? '► Clique no dispositivo destino' : `Protocolo: ${prot?.label}`}
            </span>
            {connecting && (
              <button onClick={() => setConnecting(null)} style={{ padding: '2px 8px', background: 'transparent', border: '1px solid #cc3300', color: '#cc3300', borderRadius: 3, fontSize: 10, cursor: 'pointer' }}>
                ESC
              </button>
            )}
          </div>
          <span style={{ color: '#bbb', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
            {nodes.length} dispositivos · {connections.length} conexões
          </span>
          <span style={{ color: '#ccc', fontSize: 10, marginLeft: 'auto', fontFamily: 'DM Sans, sans-serif' }}>
            Duplo-clique no label para editar · Arraste para mover
          </span>
        </div>

        {/* Engineering grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <pattern id="sm" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0L0 0 0 10" fill="none" stroke="#efefed" strokeWidth="0.5"/>
            </pattern>
            <pattern id="lg" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#sm)"/>
              <path d="M100 0L0 0 0 100" fill="none" stroke="#e5e5e2" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lg)"/>
        </svg>

        {/* Connections SVG */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            {PROTOCOLS.map(p => (
              <marker key={p.id} id={`arr_${p.id}`} markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={p.color}/>
              </marker>
            ))}
          </defs>
          {connections.map(conn => {
            const from = nodes.find(n => n.id === conn.from)
            const to = nodes.find(n => n.id === conn.to)
            if (!from || !to) return null
            const p = PROTOCOLS.find(x => x.id === conn.protocol) || PROTOCOLS[0]
            const fx = from.x + 36, fy = from.y + 36 + 36
            const tx = to.x + 36, ty = to.y + 36 + 36
            const mx = (fx + tx) / 2, my = (fy + ty) / 2
            const isSel = selectedConn === conn.id
            const dash = p.dash !== 'none' ? p.dash : undefined

            if (p.wireless) {
              const dx = tx - fx, dy = ty - fy, len = Math.sqrt(dx * dx + dy * dy)
              const cx1 = fx + dx * .25, cy1 = fy + dy * .25 - len * .15
              const cx2 = fx + dx * .75, cy2 = fy + dy * .75 - len * .15
              const cmx = (fx + tx) / 2, cmy = Math.min(fy, ty) - len * .1
              return (
                <g key={conn.id} style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); setSelectedConn(conn.id); setSelectedNode(null) }}>
                  {isSel && <path d={`M${fx},${fy} C${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`} fill="none" stroke={p.color} strokeWidth={10} opacity={0.1}/>}
                  <path d={`M${fx},${fy} C${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`}
                    fill="none" stroke={p.color} strokeWidth={isSel ? p.width + 1 : p.width}
                    strokeDasharray={dash} markerEnd={`url(#arr_${p.id})`}/>
                  <rect x={cmx - 30} y={cmy - 9} width="60" height="16" rx="3" fill="white" stroke={p.color} strokeWidth="0.8"/>
                  <text x={cmx} y={cmy + 4} textAnchor="middle" fill={p.color} fontSize="9" fontFamily="sans-serif">{p.label}</text>
                </g>
              )
            }
            return (
              <g key={conn.id} style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); setSelectedConn(conn.id); setSelectedNode(null) }}>
                {isSel && <line x1={fx} y1={fy} x2={tx} y2={ty} stroke={p.color} strokeWidth={12} opacity={0.1}/>}
                <line x1={fx} y1={fy} x2={tx} y2={ty} stroke={p.color}
                  strokeWidth={isSel ? p.width + 1 : p.width} strokeDasharray={dash}
                  markerEnd={`url(#arr_${p.id})`}/>
                <rect x={mx - 30} y={my - 9} width="60" height="16" rx="3" fill="white" stroke={p.color} strokeWidth="0.8"/>
                <text x={mx} y={my + 4} textAnchor="middle" fill={p.color} fontSize="9" fontFamily="sans-serif">{p.label}</text>
              </g>
            )
          })}
        </svg>

        {/* Canvas */}
        <div ref={canvasRef} style={{ position: 'absolute', inset: 0, paddingTop: 40 }}
          onClick={onCanvasClick}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          {nodes.map(node => (
            <DeviceNode
              key={node.id}
              node={node}
              selected={selectedNode === node.id}
              connecting={connecting}
              onMouseDown={onMouseDown}
              onConnect={setConnecting}
              onDelete={deleteNode}
              onLabelChange={updateLabel}
            />
          ))}
        </div>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', marginTop: 40 }}>
            <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
              <rect x="2" y="8" width="24" height="32" fill="none" stroke="#ccc" strokeWidth="1"/>
              <rect x="38" y="8" width="24" height="32" fill="none" stroke="#ccc" strokeWidth="1"/>
              <line x1="26" y1="24" x2="38" y2="24" stroke="#ccc" strokeWidth="1" strokeDasharray="3,2"/>
            </svg>
            <div style={{ color: '#aaa', fontSize: 13, fontWeight: 600, marginTop: 12, fontFamily: 'JetBrains Mono, monospace' }}>Adicione dispositivos do painel</div>
            <div style={{ color: '#ccc', fontSize: 11, marginTop: 4 }}>Clique → selecione → "+ Conectar" → clique destino</div>
          </div>
        )}

        {/* Connection info panel */}
        {selectedConn && (() => {
          const conn = connections.find(c => c.id === selectedConn)
          if (!conn) return null
          const from = nodes.find(n => n.id === conn.from)
          const to = nodes.find(n => n.id === conn.to)
          const p = PROTOCOLS.find(x => x.id === conn.protocol)
          const fromDev = DEVICES.find(d => d.type === from?.type)
          const toDev = DEVICES.find(d => d.type === to?.type)
          return (
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              background: '#fff', border: `1px solid ${p?.color}`,
              borderRadius: 8, padding: '12px 14px', minWidth: 200,
              boxShadow: '0 2px 16px rgba(0,0,0,0.12)', animation: 'fadeIn 0.15s ease',
            }}>
              <div style={{ fontSize: 9, color: '#888', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6, fontFamily: 'Rajdhani, sans-serif' }}>CONEXÃO</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <svg width="30" height="8"><line x1="0" y1="4" x2="30" y2="4" stroke={p?.color} strokeWidth={p?.width} strokeDasharray={p?.dash === 'none' ? undefined : p?.dash}/></svg>
                <span style={{ color: p?.color, fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{p?.label}</span>
              </div>
              <div style={{ color: '#555', fontSize: 11, marginBottom: 10 }}>
                {from?.customLabel || fromDev?.label} → {to?.customLabel || toDev?.label}
              </div>
              <button onClick={() => deleteConn(selectedConn)} style={{
                width: '100%', padding: '5px', background: 'transparent',
                border: '1px solid #cc3300', color: '#cc3300', borderRadius: 4,
                fontSize: 10, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif',
              }}>REMOVER CONEXÃO</button>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
