import { useState, useCallback, useRef, useEffect } from 'react'
import * as IMG_BASE from './assets/deviceImages'
import * as IMG_LOCAL from './assets/deviceImagesLocal'
const IMG = { ...IMG_BASE, ...IMG_LOCAL }

// ── PROTOCOLS ────────────────────────────────────────────────────────────────
const PROTOCOLS = [
  { id: 'red_rj45', parent: 'Redundância (HSR/MRP)', label: 'RJ45 (Cabo)', color: '#e6007e', dash: 'none', width: 2.5 },
  { id: 'red_fibra', parent: 'Redundância (HSR/MRP)', label: 'Fibra Óptica', color: '#e6007e', dash: '8,4', width: 2 },
  { id: 'profinet_rj45', parent: 'PROFINET', label: 'RJ45 (Cabo)', color: '#00aa66', dash: 'none', width: 2.5 },
  { id: 'profinet_fibra', parent: 'PROFINET', label: 'Fibra Óptica', color: '#00aa66', dash: '8,4', width: 2 },
  { id: 'eth_ip_rj45', parent: 'EtherNet/IP', label: 'RJ45 (Cabo)', color: '#cc8800', dash: 'none', width: 2 },
  { id: 'eth_ip_fibra', parent: 'EtherNet/IP', label: 'Fibra Óptica', color: '#cc8800', dash: '8,4', width: 2 },
  { id: 'modbustcp_rj45', parent: 'Modbus TCP', label: 'RJ45 (Cabo)', color: '#2277cc', dash: 'none', width: 2 },
  { id: 'modbustcp_fibra', parent: 'Modbus TCP', label: 'Fibra Óptica', color: '#2277cc', dash: '8,4', width: 2 },
  { id: 'eth_rj45', parent: 'Ethernet Padrão', label: 'RJ45 (Cabo)', color: '#555555', dash: 'none', width: 1.5 },
  { id: 'eth_fibra', parent: 'Ethernet Padrão', label: 'Fibra Óptica', color: '#555555', dash: '8,4', width: 1.5 },
  { id: 'modbus_serial', parent: null, label: 'Modbus RTU Serial', color: '#cc3300', dash: 'none', width: 2 },
  { id: 'webserver', parent: null, label: 'Web Server', color: '#9933cc', dash: '3,3', width: 1.5, wireless: true },
  { id: 'vpn', parent: null, label: 'VPN', color: '#0066cc', dash: '6,3', width: 2, wireless: true },
]

const GROUPS = ['CLPs', 'I/O Remotas', 'SCADA/PC', 'Automação de Energia', 'Rede', 'Wireless', 'Nuvem / Externa', 'Identificação', 'Campo']

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
  { type: 'SERVIDOR',     label: 'Servidor WinCC',    group: 'SCADA/PC',    img: IMG.SERVIDOR },
  { type: 'STANDALONE',   label: 'Standalone',        group: 'SCADA/PC',    img: IMG.STANDALONE },
  { type: 'CLIENTE',      label: 'Cliente Operação',  group: 'SCADA/PC',    img: IMG.CLIENTE },
  { type: 'ENGENHARIA',   label: 'Est. Engenharia',   group: 'SCADA/PC',    img: IMG.ENGENHARIA },
  { type: 'BANCO_DE_DADOS',label: 'Banco de Dados',   group: 'SCADA/PC',    img: IMG.BANCO_DE_DADOS },
  { type: 'IPC',          label: 'PC Industrial',     group: 'SCADA/PC',    img: IMG.IPC },
  { type: 'IHM_LOCAL',    label: 'IHM Local',         group: 'SCADA/PC',    img: IMG.IHM_LOCAL },
  { type: 'MAQ_REMOTO',   label: 'Acesso Remoto',     group: 'SCADA/PC',    img: IMG.MAQ_REMOTO },
  { type: 'CLP_PROC',     label: 'CLP de Processo',   group: 'Automação de Energia', img: IMG.CLP_PROC },
  { type: 'RTU',          label: 'RTU',               group: 'Automação de Energia', img: IMG.RTU },
  { type: 'RTU_COMPACTA', label: 'RTU Compacta',      group: 'Automação de Energia', img: IMG.RTU_COMPACTA },
  { type: 'MVU',          label: 'MVU',               group: 'Automação de Energia', img: IMG.MVU },
  { type: 'MERGING_UNIT', label: 'Merging Unit',      group: 'Automação de Energia', img: IMG.MERGING_UNIT },
  { type: 'IED',          label: 'IED',               group: 'Automação de Energia', img: IMG.IED },
  { type: 'IED_COMPACTO', label: 'IED Compacto',      group: 'Automação de Energia', img: IMG.IED_COMPACTO },
  { type: 'GATEWAY_SUB',  label: 'Gateway Subestação',group: 'Automação de Energia', img: IMG.GATEWAY_SUB },
  { type: 'GATEWAY_DIR',  label: 'Gateway Direcional',group: 'Automação de Energia', img: IMG.GATEWAY_DIR },
  { type: 'GPS',          label: 'Antena GPS',        group: 'Automação de Energia', img: IMG.GPS },
  { type: 'SW_COMPACTO',  label: 'Switch Compacto',   group: 'Rede',        img: IMG.SW_COMPACTO },
  { type: 'SW_MODULAR',   label: 'Switch Modular',    group: 'Rede',        img: IMG.SW_MODULAR },
  { type: 'SW_RUGGEDCOM', label: 'Switch Ruggedcom',  group: 'Rede',        img: IMG.SW_RUGGEDCOM },
  { type: 'ROTEADOR',     label: 'Roteador',          group: 'Rede',        img: IMG.ROTEADOR },
  { type: 'TERM_SERVER',  label: 'Terminal Server',   group: 'Rede',        img: IMG.TERM_SERVER },
  { type: 'EDGE_COMP',    label: 'Edge Computing',    group: 'Rede',        img: IMG.EDGE_COMP },
  { type: 'GATEWAY',      label: 'Gateway Genérico',  group: 'Rede',        img: IMG.GATEWAY },
  { type: 'SWITCH',       label: 'Switch SCALANCE',   group: 'Rede',        img: IMG.SWITCH },
  { type: 'FIREWALL',     label: 'Firewall',          group: 'Rede',        img: null, svgIcon: 'firewall' },
  { type: 'VPN',          label: 'VPN',               group: 'Rede',        img: null, svgIcon: 'vpn' },
  { type: 'SCALANCE_W_AP',label: 'Access Point',      group: 'Wireless',    img: IMG.SCALANCE_W_AP },
  { type: 'AP_MODULAR',   label: 'AP Modular',        group: 'Wireless',    img: IMG.AP_MODULAR },
  { type: 'SCALANCE_W_CLI',label:'Client Wireless',   group: 'Wireless',    img: IMG.SCALANCE_W_CLI },
  { type: 'NUVEM',        label: 'Nuvem (Cloud)',     group: 'Nuvem / Externa', img: IMG.NUVEM },
  { type: 'WAN',          label: 'Link WAN',          group: 'Nuvem / Externa', img: IMG.WAN },
  { type: 'RED_BOX',      label: 'Red Box',           group: 'Nuvem / Externa', img: IMG.RED_BOX },
  { type: 'RFID_GATEWAY', label: 'Gateway RFID',      group: 'Identificação', img: IMG.RFID_GATEWAY },
  { type: 'RFID_ANTENA',  label: 'Antena RFID',       group: 'Identificação', img: IMG.RFID_ANTENA },
  { type: 'RFID_TAG',     label: 'Tag RFID',          group: 'Identificação', img: IMG.RFID_TAG },
  { type: 'MOTOR',        label: 'Motor',             group: 'Campo',       img: IMG.MOTOR },
  { type: 'SINAMICS',     label: 'Inversor',          group: 'Campo',       img: IMG.SINAMICS },
  { type: 'DEVICE',       label: 'Dispositivo',       group: 'Campo',       img: IMG.DEVICE },
]

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

function DeviceNode({ node, selected, connecting, onMouseDown, onConnect, onCompleteConnect, onDelete, onLabelChange }) {
  const dev = DEVICES.find(d => d.type === node.type)
  const [editingLabel, setEditingLabel] = useState(false)
  const [labelVal, setLabelVal] = useState(node.customLabel || dev?.label || '')
  const handleLabelBlur = () => { setEditingLabel(false); onLabelChange(node.id, labelVal) }

  return (
    <div onMouseDown={e => onMouseDown(e, node.id)} onClick={e => { e.stopPropagation(); if (connecting && typeof onCompleteConnect === 'function') { onCompleteConnect(node.id) } }} style={{ position: 'absolute', left: node.x, top: node.y, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: connecting ? 'crosshair' : 'grab', userSelect: 'none', zIndex: selected ? 20 : 1, width: 80 }}>
      {selected && !connecting && (
        <div style={{ position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3, whiteSpace: 'nowrap', zIndex: 30 }}>
          <button onClick={e => { e.stopPropagation(); onConnect(node.id) }} style={{ padding: '3px 8px', background: '#009999', border: 'none', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>+ Conectar</button>
          <button onClick={e => { e.stopPropagation(); setEditingLabel(true) }} style={{ padding: '3px 7px', background: '#334455', border: 'none', color: '#fff', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>✎</button>
          <button onClick={e => { e.stopPropagation(); onDelete(node.id) }} style={{ padding: '3px 7px', background: '#cc3300', border: 'none', color: '#fff', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>✕</button>
        </div>
      )}
      <div style={{ width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? 'rgba(0,153,153,0.08)' : 'transparent', border: selected ? '2px solid rgba(0,153,153,0.5)' : '2px solid transparent', borderRadius: 8, transition: 'all 0.15s', outline: connecting === node.id ? '2px solid #cc8800' : 'none', outlineOffset: 2 }}>
        {dev?.img ? <img src={dev.img} alt={dev.label} style={{ maxWidth: 64, maxHeight: 64, objectFit: 'contain' }} /> : dev?.svgIcon === 'vpn' ? <VpnIcon size={56} /> : <FirewallIcon size={56} />}
      </div>
      {editingLabel ? (
        <input autoFocus value={labelVal} onChange={e => setLabelVal(e.target.value)} onBlur={handleLabelBlur} onKeyDown={e => { if (e.key === 'Enter') handleLabelBlur() }} style={{ width: 80, textAlign: 'center', fontSize: 11, fontWeight: 600, border: '1px solid #009999', borderRadius: 4, background: '#fff', color: '#1a1a2e', padding: '2px 4px', outline: 'none' }} />
      ) : (
        <div onClick={e => { e.stopPropagation(); setEditingLabel(true) }} style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: '#1a1a2e', textAlign: 'center', maxWidth: 80, lineHeight: 1.3, wordBreak: 'break-word', background: 'rgba(255,255,255,0.85)', padding: '1px 4px', borderRadius: 3 }}>
          {node.customLabel || dev?.label}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedProtocol, setSelectedProtocol] = useState('profinet_rj45')
  const [openProtocolGroup, setOpenProtocolGroup] = useState('PROFINET')
  const [connecting, setConnecting] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedConn, setSelectedConn] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [openGroup, setOpenGroup] = useState('CLPs')
  const canvasRef = useRef(null)
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const nextId = useRef(1)

  const exportImage = useCallback(async () => {
    const inner = innerRef.current || canvasRef.current
    if (!inner) return

    // If there are nodes, compute bounding box around nodes and connections; otherwise fallback to full area
    if (nodes.length > 0) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      // include nodes
      for (const n of nodes) {
        minX = Math.min(minX, n.x)
        minY = Math.min(minY, n.y)
        maxX = Math.max(maxX, n.x + 72)
        maxY = Math.max(maxY, n.y + 86)
      }
      // include connection end points just in case labels extend
      for (const c of connections) {
        const from = nodes.find(n => n.id === c.from)
        const to = nodes.find(n => n.id === c.to)
        if (!from || !to) continue
        const fx = from.x + 36, fy = from.y + 36 + 36
        const tx = to.x + 36, ty = to.y + 36 + 36
        minX = Math.min(minX, fx, tx)
        minY = Math.min(minY, fy, ty)
        maxX = Math.max(maxX, fx, tx)
        maxY = Math.max(maxY, fy, ty)
      }

      const padding = 80
      const viewX = Math.max(0, Math.floor(minX - padding))
      const viewY = Math.max(0, Math.floor(minY - padding))
      const viewW = Math.ceil(maxX - minX + padding * 2)
      const viewH = Math.ceil(maxY - minY + padding * 2)

      const xmlns = 'http://www.w3.org/2000/svg'
      const svgParts = []
      svgParts.push(`<svg xmlns="${xmlns}" width="${viewW}" height="${viewH}" viewBox="0 0 ${viewW} ${viewH}">`)
      svgParts.push(`<rect width="100%" height="100%" fill="#f8f9fa"/>`)

      // connections (adjusted to viewX/viewY)
      for (const conn of connections) {
        const from = nodes.find(n => n.id === conn.from)
        const to = nodes.find(n => n.id === conn.to)
        if (!from || !to) continue
        const p = PROTOCOLS.find(x => x.id === conn.protocol) || PROTOCOLS[0]
        const fx = from.x + 36 - viewX, fy = from.y + 36 + 36 - viewY
        const tx = to.x + 36 - viewX, ty = to.y + 36 + 36 - viewY
        const dash = p.dash !== 'none' ? ` stroke-dasharray="${p.dash}"` : ''
        svgParts.push(`<line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${p.color}" stroke-width="${p.width}"${dash} stroke-linecap="round" />`)
        const mx = (fx + tx) / 2, my = (fy + ty) / 2
        const parentLabel = p.parent ? p.parent + ' — ' : ''
        const textLabel = (parentLabel + p.label).replace(/&/g, '&amp;')
        svgParts.push(`<rect x="${mx -  (Math.max(60, (textLabel.length || 10) * 7 + 16)/2)}" y="${my - 24}" width="${Math.max(60, (textLabel.length || 10) * 7 + 16)}" height="20" rx="10" fill="#ffffff" stroke="${p.color}" stroke-width="1" />`)
        svgParts.push(`<text x="${mx}" y="${my - 10}" font-family="DM Sans, sans-serif" font-size="11" fill="${p.color}" font-weight="700" text-anchor="middle">${textLabel}</text>`)
      }

      // nodes
      for (const node of nodes) {
        const dev = DEVICES.find(d => d.type === node.type)
        const imgSrc = dev?.img && (typeof dev.img === 'string') ? dev.img : null
        const x = node.x - viewX, y = node.y - viewY
        if (imgSrc) {
          const esc = imgSrc.replace(/#/g, '%23')
          svgParts.push(`<image href="${esc}" x="${x}" y="${y}" width="72" height="72" preserveAspectRatio="xMidYMid meet" />`)
        } else {
          svgParts.push(`<rect x="${x}" y="${y}" width="72" height="72" rx="8" fill="#fff" stroke="#ddd" />`)
        }
        const label = (node.customLabel || dev?.label || '').replace(/&/g, '&amp;')
        svgParts.push(`<text x="${x + 36}" y="${y + 86}" font-family="DM Sans, sans-serif" font-size="11" fill="#1a1a2e" font-weight="600" text-anchor="middle">${label}</text>`)
      }

      svgParts.push('</svg>')
      const svgString = svgParts.join('\n')
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = viewW; canvas.height = viewH
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, viewW, viewH)
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        const png = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = png
        a.download = 'network-architect.png'
        a.click()
      }
      img.onerror = (e) => { console.error('Export image failed', e) }
      img.src = url
      return
    }

    // fallback: export full inner area
    const width = Math.max(1200, inner.scrollWidth || inner.clientWidth || 1200)
    const height = Math.max(800, inner.scrollHeight || inner.clientHeight || 800)
    const xmlns = 'http://www.w3.org/2000/svg'
    const svgParts = []
    svgParts.push(`<svg xmlns="${xmlns}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`)
    svgParts.push(`<rect width="100%" height="100%" fill="#f8f9fa"/>`)

    // connections
    for (const conn of connections) {
      const from = nodes.find(n => n.id === conn.from)
      const to = nodes.find(n => n.id === conn.to)
      if (!from || !to) continue
      const p = PROTOCOLS.find(x => x.id === conn.protocol) || PROTOCOLS[0]
      const fx = from.x + 36, fy = from.y + 36 + 36
      const tx = to.x + 36, ty = to.y + 36 + 36
      const dash = p.dash !== 'none' ? ` stroke-dasharray="${p.dash}"` : ''
      svgParts.push(`<line x1="${fx}" y1="${fy}" x2="${tx}" y2="${ty}" stroke="${p.color}" stroke-width="${p.width}"${dash} stroke-linecap="round" />`)
      const mx = (fx + tx) / 2, my = (fy + ty) / 2
      const parentLabel = p.parent ? p.parent + ' — ' : ''
      const textLabel = (parentLabel + p.label).replace(/&/g, '&amp;')
      svgParts.push(`<text x="${mx}" y="${my - 8}" font-family="DM Sans, sans-serif" font-size="11" fill="${p.color}" font-weight="700" text-anchor="middle">${textLabel}</text>`)
    }

    // nodes
    for (const node of nodes) {
      const dev = DEVICES.find(d => d.type === node.type)
      const imgSrc = dev?.img && (typeof dev.img === 'string') ? dev.img : null
      const x = node.x, y = node.y
      if (imgSrc) {
        const esc = imgSrc.replace(/#/g, '%23')
        svgParts.push(`<image href="${esc}" x="${x}" y="${y}" width="72" height="72" preserveAspectRatio="xMidYMid meet" />`)
      } else {
        svgParts.push(`<rect x="${x}" y="${y}" width="72" height="72" rx="8" fill="#fff" stroke="#ddd" />`)
      }
      const label = (node.customLabel || dev?.label || '').replace(/&/g, '&amp;')
      svgParts.push(`<text x="${x + 36}" y="${y + 86}" font-family="DM Sans, sans-serif" font-size="11" fill="#1a1a2e" font-weight="600" text-anchor="middle">${label}</text>`)
    }

    svgParts.push('</svg>')
    const svgString = svgParts.join('\n')
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      const png = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = png
      a.download = 'network-architect.png'
      a.click()
    }
    img.onerror = (e) => { console.error('Export image failed', e) }
    img.src = url
  }, [nodes, connections])

  const addDevice = useCallback((type) => { setNodes(n => [...n, { id: `n${nextId.current++}`, type, x: 120 + Math.random() * 500, y: 80 + Math.random() * 350, customLabel: '' }]) }, [])
  const deleteNode = useCallback((id) => { setNodes(n => n.filter(x => x.id !== id)); setConnections(c => c.filter(x => x.from !== id && x.to !== id)); setSelectedNode(null) }, [])
  const deleteConn = useCallback((id) => { setConnections(c => c.filter(x => x.id !== id)); setSelectedConn(null) }, [])
  const updateLabel = useCallback((id, label) => { setNodes(n => n.map(x => x.id === id ? { ...x, customLabel: label } : x)) }, [])
  const onMouseDown = useCallback((e, nodeId) => {
    e.stopPropagation()
    console.log('onMouseDown', { connecting, nodeId })
    if (connecting) {
      if (connecting !== nodeId) {
        const newConn = { id: `c${nextId.current++}`, from: connecting, to: nodeId, protocol: selectedProtocol }
        console.log('creating connection', newConn)
        setConnections(c => [...c, newConn])
      }
      setConnecting(null)
      return
    }
    const rectEl = canvasRef.current || innerRef.current || document.body
    const rect = rectEl.getBoundingClientRect()
    const node = nodes.find(n => n.id === nodeId)
    setDragging(nodeId)
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y })
    setSelectedNode(nodeId)
    setSelectedConn(null)
  }, [connecting, nodes, selectedProtocol])
  const onMouseMove = useCallback((e) => { if(!dragging) return; const rect = (innerRef.current || canvasRef.current).getBoundingClientRect(); setNodes(n => n.map(nd => nd.id === dragging ? { ...nd, x: e.clientX - rect.left - dragOffset.x, y: e.clientY - rect.top - dragOffset.y } : nd)) }, [dragging, dragOffset])
  const onMouseUp = useCallback(() => setDragging(null), [])
  const onCanvasClick = useCallback((e) => {
    if (connecting) {
      const rect = (innerRef.current || canvasRef.current).getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const target = nodes.find(n => x >= n.x && x <= n.x + 80 && y >= n.y && y <= n.y + 100)
      if (target && target.id !== connecting) {
        setConnections(c => [...c, { id: `c${nextId.current++}`, from: connecting, to: target.id, protocol: selectedProtocol }])
      }
      setConnecting(null)
      return
    }
    setSelectedNode(null); setSelectedConn(null)
  }, [connecting, nodes, selectedProtocol])
  const prot = PROTOCOLS.find(p => p.id === selectedProtocol)

  useEffect(() => {
    function onKey(e) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConn) {
        deleteConn(selectedConn)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedConn, deleteConn])

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f2f4', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: 220, background: '#111416', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #1e2326' }}>
            <div style={{ color: '#009999', fontSize: 18, fontWeight: 700, fontFamily: 'Rajdhani' }}>SIEMENS</div>
        </div>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e2326' }}>
            {Array.from(new Set(PROTOCOLS.map(p => p.parent))).map(parentName => {
                if (parentName === null) return PROTOCOLS.filter(p => p.parent === null).map(p => (
                    <div key={p.id} onClick={() => setSelectedProtocol(p.id)} style={{ padding: '5px 8px', borderRadius: 4, cursor: 'pointer', border: selectedProtocol === p.id ? `1px solid ${p.color}` : '1px solid #1e2326', background: selectedProtocol === p.id ? '#1a1e22' : 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="28" height="8"><line x1="0" y1="4" x2="28" y2="4" stroke={p.color} strokeWidth={p.width} strokeDasharray={p.dash === 'none' ? undefined : p.dash}/></svg>
                        <span style={{ color: '#aaa', fontSize: 10 }}>{p.label}</span>
                    </div>
                ))
                const isGroupOpen = openProtocolGroup === parentName;
                return (
                    <div key={parentName} style={{ marginBottom: 4 }}>
                        <div onClick={() => setOpenProtocolGroup(isGroupOpen ? null : parentName)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 6px', cursor: 'pointer', color: '#889', fontSize: 10 }}>
                            {parentName} <span>{isGroupOpen ? '▲' : '▼'}</span>
                        </div>
                        {isGroupOpen && PROTOCOLS.filter(p => p.parent === parentName).map(p => (
                            <div key={p.id} onClick={() => setSelectedProtocol(p.id)} style={{ padding: '5px 8px', marginLeft: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: selectedProtocol === p.id ? '#161a1c' : 'transparent' }}>
                                <svg width="28" height="8"><line x1="0" y1="4" x2="28" y2="4" stroke={p.color} strokeWidth={p.width} strokeDasharray={p.dash === 'none' ? undefined : p.dash}/></svg>
                                <span style={{ color: selectedProtocol === p.id ? p.color : '#aaa', fontSize: 10 }}>{p.label}</span>
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
          {GROUPS.map(group => {
            const isOpen = openGroup === group
            return (
              <div key={group} style={{ marginBottom: 6 }}>
                <div onClick={() => setOpenGroup(isOpen ? null : group)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 6px', cursor: 'pointer', color: isOpen ? '#009999' : '#667', fontSize: 10 }}>{group} <span>{isOpen ? '▲' : '▼'}</span></div>
                {isOpen && DEVICES.filter(d => d.group === group).map(dev => (
                  <div key={dev.type} onClick={() => addDevice(dev.type)} style={{ padding: '6px 8px', borderRadius: 4, cursor: 'pointer', background: '#0d0f10', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {dev.img ? <img src={dev.img} alt={dev.label} style={{ maxWidth: 28, maxHeight: 28 }} /> : dev.svgIcon === 'vpn' ? <VpnIcon size={24}/> : <FirewallIcon size={24}/>}
                    </div>
                    <span style={{ color: '#ccc', fontSize: 11 }}>{dev.label}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Top header like original */}
        <div style={{ height: 38, background: '#f5f5f6', borderBottom: '1px solid #e6e6e6', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 13, color: '#666' }}>
          <div style={{ fontWeight: 700, color: '#333' }}>Protocolo: {prot?.parent || prot?.label}</div>
          <div style={{ marginLeft: 12, color: '#999' }}>{nodes.length} dispositivos · {connections.length} conexões</div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: '#999', fontSize: 12 }}>Clique no label para editar · Arraste para mover</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={exportImage} style={{ padding: '6px 12px', background: '#009999', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Salvar imagem</button>
              {selectedConn && <button onClick={(e) => { e.stopPropagation(); console.log('delete-click', selectedConn); deleteConn(selectedConn) }} style={{ padding: '6px 12px', background: '#cc3300', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Excluir cabo</button>}
            </div>
          </div>
        </div>

        {/* Canvas area */}
        <div onClick={onCanvasClick} onMouseMove={onMouseMove} onMouseUp={onMouseUp} ref={canvasRef} style={{ position: 'relative', flex: 1, overflow: 'auto' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Large inner area with grid background */}
            <div ref={innerRef} style={{ position: 'absolute', left: 0, top: 0, width: 4000, height: 3000, backgroundColor: '#f8f9fa', backgroundImage: "linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px)", backgroundSize: '24px 24px, 24px 24px' }}>

              {/* SVG connections layer */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}>
                <defs>
                  {PROTOCOLS.map(p => (
                    <marker key={p.id} id={`arr_${p.id}`} markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L7,3 z" fill={p.color} />
                    </marker>
                  ))}
                </defs>
                {connections.map(conn => {
                  const from = nodes.find(n => n.id === conn.from)
                  const to = nodes.find(n => n.id === conn.to)
                  if(!from || !to) return null
                  const p = PROTOCOLS.find(x => x.id === conn.protocol) || PROTOCOLS[0]
                  const fx = from.x + 36, fy = from.y + 36 + 36
                  const tx = to.x + 36, ty = to.y + 36 + 36
                  const mx = (fx + tx) / 2, my = (fy + ty) / 2
                  const dash = p.dash !== 'none' ? p.dash : undefined
                  const markerEnd = `url(#arr_${p.id})`
                  const parentLabel = p.parent || ''
                  const textLabel = parentLabel ? `${parentLabel} — ${p.label}` : p.label
                  const labelWidth = Math.max(60, (textLabel.length || 10) * 7 + 16)
                  return (
                    <g key={conn.id} onClick={(e) => { e.stopPropagation(); console.log('select-conn', conn.id); setSelectedConn(conn.id); }} onDoubleClick={(e) => { e.stopPropagation(); console.log('double-delete', conn.id); deleteConn(conn.id); }} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
                      <line x1={fx} y1={fy} x2={tx} y2={ty} stroke={p.color} strokeWidth={p.width} strokeDasharray={dash} markerEnd={markerEnd} opacity={selectedConn === conn.id ? 1 : 0.95} />
                      <rect x={mx - labelWidth/2} y={my - 24} width={labelWidth} height={20} rx={10} fill="#ffffff" stroke={p.color} strokeWidth={1} />
                      <text x={mx} y={my - 10} fill={p.color} fontSize={11} fontWeight={700} textAnchor="middle" style={{ fontFamily: 'DM Sans, sans-serif', pointerEvents: 'none' }}>{textLabel}</text>
                      {selectedConn === conn.id && (
                        <g transform={`translate(${mx + labelWidth/2 + 8}, ${my - 14})`} style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); deleteConn(conn.id); }}>
                          <circle cx={0} cy={0} r={8} fill="#cc3300" />
                          <text x={0} y={4} textAnchor="middle" fontSize={10} fill="#fff">×</text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* nodes */}
              {nodes.map(node => (
                <DeviceNode key={node.id} node={node} selected={selectedNode === node.id} connecting={connecting} onMouseDown={onMouseDown} onConnect={setConnecting} onCompleteConnect={(targetId) => { if (connecting && connecting !== targetId) setConnections(c => [...c, { id: `c${nextId.current++}`, from: connecting, to: targetId, protocol: selectedProtocol }]); setConnecting(null); }} onDelete={deleteNode} onLabelChange={updateLabel} />
              ))}

              {/* placeholder when empty */}
              {nodes.length === 0 && (
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', color: '#9aa', pointerEvents: 'none' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, border: '2px solid #ddd', borderRadius: 4 }} />
                    <div style={{ width: 36, height: 36, border: '2px solid #ddd', borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Adicione dispositivos do painel</div>
                  <div style={{ fontSize: 12, color: '#b0b6bb', marginTop: 6 }}>Clique → selecione → '+ Conectar' → clique destino</div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
