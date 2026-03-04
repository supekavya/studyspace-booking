import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { roomApi, bookingApi } from '../services/api.js'
import { AMENITY_ICONS } from '../styles.js'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    Promise.all([roomApi.getAll(), bookingApi.getStats(), bookingApi.getToday()])
      .then(([rRes, sRes, bRes]) => {
        setRooms(rRes.data)
        setStats(sRes.data)
        setBookings(bRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:400 }}>
      <div className="spinner" style={{ width:40,height:40 }} />
    </div>
  )

  return (
    <div className="fade-up">
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,letterSpacing:'-0.03em',lineHeight:1.1 }}>
          Good {greeting}, {user?.fullName?.split(' ')[0]} 👋
        </div>
        <div style={{ color:'#666',marginTop:8,fontSize:15 }}>Here's your campus study space overview.</div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32 }}>
        {[
          { label:'Total Rooms', val: rooms.length, icon:'🏠', color:'#4ADE80' },
          { label:'Today\'s Bookings', val: stats?.activeBookingsToday ?? 0, icon:'📅', color:'#60A5FA' },
          { label:'My Bookings', val: stats?.myBookings ?? 0, icon:'🎓', color:'#F472B6' },
          { label:'Floors', val: [...new Set(rooms.map(r=>r.floor))].length, icon:'🏢', color:'#FACC15' },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:24 }}>
            <div style={{ fontSize:24,marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,color:s.color,lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:13,color:'#666',marginTop:6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Room cards */}
      <div style={{ marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20 }}>Study Rooms</div>
        <button className="primary-btn" style={{ padding:'9px 20px',fontSize:14 }} onClick={()=>navigate('/book')}>
          + Book a Room
        </button>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16 }}>
        {rooms.map((room,ri) => {
          const roomBookings = bookings.filter(b=>b.roomId===room.id)
          const pct = Math.min(100, Math.round((roomBookings.length / 5) * 100))
          return (
            <div key={room.id} className="card" style={{ padding:20,cursor:'pointer',position:'relative',overflow:'hidden',transition:'all 0.25s' }}
              onClick={()=>navigate('/book',{state:{roomId:room.id}})}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.4)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
              <div style={{ position:'absolute',top:0,left:0,right:0,height:3,
                background:`linear-gradient(90deg,${room.color},transparent)`,borderRadius:'16px 16px 0 0' }} />
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:room.color }}>{room.name}</div>
                  <div style={{ fontSize:12,color:'#555',marginTop:2 }}>Floor {room.floor} · Up to {room.capacity} people</div>
                </div>
                <div style={{ background:roomBookings.length===0?'rgba(74,222,128,0.12)':'rgba(250,204,21,0.12)',
                  color:roomBookings.length===0?'#4ADE80':'#FACC15',
                  border:`1px solid ${roomBookings.length===0?'rgba(74,222,128,0.25)':'rgba(250,204,21,0.25)'}`,
                  borderRadius:8,padding:'4px 10px',fontSize:12,fontWeight:600 }}>
                  {roomBookings.length===0?'Available':'Busy'}
                </div>
              </div>
              <div style={{ background:'#1A1A2A',borderRadius:4,height:6,marginBottom:12 }}>
                <div style={{ width:`${pct}%`,height:'100%',borderRadius:4,background:room.color,transition:'width 0.6s ease' }} />
              </div>
              <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                {room.amenities?.slice(0,3).map(a=>(
                  <span key={a} className="badge">{AMENITY_ICONS[a]||'•'} {a}</span>
                ))}
                {(room.amenities?.length||0)>3 && <span className="badge">+{room.amenities.length-3}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
