import { useState, useEffect } from 'react'
import { roomApi, bookingApi } from '../services/api.js'

export default function AdminPanel() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('bookings')
  const [loading, setLoading] = useState(true)
  const [newRoom, setNewRoom] = useState({ name:'',capacity:'',floor:'',description:'',color:'#4ADE80',amenities:'' })
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [rRes, bRes] = await Promise.all([roomApi.getAll(), bookingApi.getAll()])
      setRooms(rRes.data)
      setBookings(bRes.data)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleCancelBooking(id) {
    try {
      await bookingApi.cancel(id)
      window.showToast?.('Booking removed.')
      setBookings(prev => prev.filter(b => b.id !== id))
    } catch { window.showToast?.('Failed.', 'error') }
  }

  async function handleAddRoom() {
    if (!newRoom.name||!newRoom.capacity||!newRoom.floor) { window.showToast?.('Fill required fields.','error'); return }
    setSaving(true)
    try {
      await roomApi.create({ ...newRoom, capacity: Number(newRoom.capacity), floor: Number(newRoom.floor),
        amenities: newRoom.amenities.split(',').map(s=>s.trim()).filter(Boolean) })
      window.showToast?.('Room created!')
      setShowRoomForm(false)
      setNewRoom({ name:'',capacity:'',floor:'',description:'',color:'#4ADE80',amenities:'' })
      const res = await roomApi.getAll()
      setRooms(res.data)
    } catch { window.showToast?.('Failed to create room.','error') }
    finally { setSaving(false) }
  }

  async function handleDeactivateRoom(id) {
    try {
      await roomApi.delete(id)
      window.showToast?.('Room deactivated.')
      setRooms(prev => prev.filter(r => r.id !== id))
    } catch { window.showToast?.('Failed.','error') }
  }

  // Utilization per room
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === today && b.status === 'ACTIVE')

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:400 }}>
      <div className="spinner" style={{ width:36,height:36 }} />
    </div>
  )

  return (
    <div className="fade-up">
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,letterSpacing:'-0.02em' }}>Admin Panel</div>
        <div style={{ color:'#555',fontSize:14,marginTop:4 }}>Manage rooms and all reservations</div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32 }}>
        {[
          { label:'Total Rooms', val:rooms.length, color:'#4ADE80' },
          { label:'Total Bookings', val:bookings.length, color:'#60A5FA' },
          { label:'Active Today', val:todayBookings.length, color:'#FACC15' },
          { label:'Unique Users', val:[...new Set(bookings.map(b=>b.userId))].length, color:'#F472B6' },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:'20px 24px' }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:s.color }}>{s.val}</div>
            <div style={{ fontSize:13,color:'#666',marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex',gap:4,marginBottom:20,borderBottom:'1px solid #1A1A2A',paddingBottom:0 }}>
        {[['bookings','All Bookings'],['rooms','Manage Rooms'],['utilization','Utilization']].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{ background:'none',border:'none',cursor:'pointer',padding:'10px 16px',
            fontSize:14,fontWeight:500,color:tab===key?'#E8E8F0':'#555',borderBottom:`2px solid ${tab===key?'#4ADE80':'transparent'}`,
            transition:'all 0.2s',marginBottom:-1 }}>{label}</button>
        ))}
      </div>

      {/* Bookings tab */}
      {tab === 'bookings' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #1E1E2E' }}>
                {['Room','Date','Time','User','Purpose','Status',''].map(h=>(
                  <th key={h} style={{ padding:'12px 16px',textAlign:'left',fontSize:11,color:'#555',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.slice().reverse().map((b,i)=>{
                const colors = {Atlas:'#4ADE80',Meridian:'#60A5FA',Zenith:'#F472B6',Vertex:'#FACC15',Solstice:'#FB923C',Equinox:'#A78BFA'}
                const color = colors[b.roomName]||'#888'
                return (
                  <tr key={b.id} style={{ borderTop:i>0?'1px solid #0F0F1A':'none' }}>
                    <td style={{ padding:'12px 16px' }}><span style={{ color,fontWeight:600 }}>{b.roomName}</span></td>
                    <td style={{ padding:'12px 16px',color:'#888',fontSize:13 }}>{b.date}</td>
                    <td style={{ padding:'12px 16px',color:'#888',fontSize:13 }}>{b.startTime}–{b.endTime}</td>
                    <td style={{ padding:'12px 16px',fontSize:13 }}>{b.userFullName}</td>
                    <td style={{ padding:'12px 16px',color:'#666',fontSize:13 }}>{b.purpose}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ fontSize:11,padding:'3px 8px',borderRadius:6,fontWeight:500,
                        background:b.status==='ACTIVE'?'rgba(74,222,128,0.12)':'rgba(239,68,68,0.1)',
                        color:b.status==='ACTIVE'?'#4ADE80':'#F87171' }}>{b.status}</span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      {b.status==='ACTIVE' && <button className="danger-btn" style={{ padding:'5px 12px',fontSize:12 }} onClick={()=>handleCancelBooking(b.id)}>Remove</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rooms tab */}
      {tab === 'rooms' && (
        <div>
          <div style={{ display:'flex',justifyContent:'flex-end',marginBottom:16 }}>
            <button className="primary-btn" style={{ padding:'9px 20px',fontSize:14 }} onClick={()=>setShowRoomForm(v=>!v)}>
              {showRoomForm?'✕ Close':'+ Add Room'}
            </button>
          </div>

          {showRoomForm && (
            <div className="card" style={{ padding:24,marginBottom:20 }}>
              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,marginBottom:20 }}>New Room</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                {[['name','Room Name*','text'],['capacity','Capacity*','number'],['floor','Floor*','number'],['description','Description','text'],['color','Color (hex)','text'],['amenities','Amenities (comma-separated)','text']].map(([k,label,type])=>(
                  <div key={k} style={{ gridColumn: k==='amenities'?'1/-1':'auto' }}>
                    <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>{label}</label>
                    <input type={type} className="input-field" value={newRoom[k]} onChange={e=>setNewRoom(f=>({...f,[k]:e.target.value}))} />
                  </div>
                ))}
              </div>
              <div style={{ display:'flex',gap:10,marginTop:20 }}>
                <button className="secondary-btn" onClick={()=>setShowRoomForm(false)}>Cancel</button>
                <button className="primary-btn" onClick={handleAddRoom} disabled={saving}>
                  {saving?'Saving…':'Create Room'}
                </button>
              </div>
            </div>
          )}

          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
            {rooms.map(room => (
              <div key={room.id} className="card" style={{ padding:20,position:'relative',overflow:'hidden' }}>
                <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${room.color||'#4ADE80'},transparent)`,borderRadius:'16px 16px 0 0' }} />
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:room.color||'#888',marginBottom:6 }}>{room.name}</div>
                <div style={{ fontSize:13,color:'#666',marginBottom:12 }}>Floor {room.floor} · Cap. {room.capacity}</div>
                <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:16 }}>
                  {room.amenities?.map(a=><span key={a} className="badge">{a}</span>)}
                </div>
                <button className="danger-btn" style={{ width:'100%',padding:'8px',fontSize:12,textAlign:'center' }} onClick={()=>handleDeactivateRoom(room.id)}>
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Utilization tab */}
      {tab === 'utilization' && (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16 }}>
          {rooms.map(room => {
            const roomBookings = bookings.filter(b=>b.roomId===room.id&&b.status==='ACTIVE')
            const todayCount = todayBookings.filter(b=>b.roomId===room.id).length
            const pct = Math.min(100, Math.round((todayCount/13)*100))
            return (
              <div key={room.id} className="card" style={{ padding:24 }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:room.color||'#888' }}>{room.name}</div>
                    <div style={{ fontSize:12,color:'#555',marginTop:2 }}>Floor {room.floor} · {room.capacity} seats</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:room.color||'#888' }}>{pct}%</div>
                    <div style={{ fontSize:11,color:'#555' }}>today</div>
                  </div>
                </div>
                <div style={{ background:'#1A1A2A',borderRadius:6,height:10,marginBottom:12 }}>
                  <div style={{ width:`${pct}%`,height:'100%',borderRadius:6,background:room.color||'#4ADE80',transition:'width 0.6s ease' }} />
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'#555' }}>
                  <span>{todayCount} slots used today</span>
                  <span>{roomBookings.length} total bookings</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
