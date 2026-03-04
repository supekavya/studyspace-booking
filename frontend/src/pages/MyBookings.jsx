import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingApi } from '../services/api.js'

export default function MyBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmCancel, setConfirmCancel] = useState(null)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await bookingApi.getMy()
      setBookings(res.data)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleCancel(id) {
    try {
      await bookingApi.cancel(id)
      window.showToast?.('Booking cancelled.')
      setConfirmCancel(null)
      setBookings(prev => prev.filter(b => b.id !== id))
    } catch { window.showToast?.('Failed to cancel.', 'error') }
  }

  const upcoming = bookings.filter(b => b.date >= today && b.status === 'ACTIVE')
  const past = bookings.filter(b => b.date < today || b.status !== 'ACTIVE')

  if (loading) return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:400 }}>
      <div className="spinner" style={{ width:36,height:36 }} />
    </div>
  )

  return (
    <div className="fade-up">
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,letterSpacing:'-0.02em' }}>My Bookings</div>
        <div style={{ color:'#555',fontSize:14,marginTop:4 }}>{upcoming.length} upcoming · {past.length} past</div>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign:'center',padding:'80px 0',color:'#444' }}>
          <div style={{ fontSize:48,marginBottom:16 }}>📅</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,marginBottom:8 }}>No bookings yet</div>
          <div style={{ fontSize:14,marginBottom:24 }}>Reserve a study room to see it here</div>
          <button className="primary-btn" onClick={()=>navigate('/book')}>Book a Room</button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section style={{ marginBottom:32 }}>
              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:'#4ADE80',marginBottom:12,display:'flex',alignItems:'center',gap:8 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:'#4ADE80',boxShadow:'0 0 6px #4ADE80' }} />
                Upcoming
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                {upcoming.map(b => <BookingCard key={b.id} b={b} onCancel={setConfirmCancel} />)}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:'#555',marginBottom:12 }}>Past & Cancelled</div>
              <div style={{ display:'flex',flexDirection:'column',gap:10,opacity:0.5 }}>
                {past.map(b => <BookingCard key={b.id} b={b} readonly />)}
              </div>
            </section>
          )}
        </>
      )}

      {confirmCancel && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setConfirmCancel(null)}>
          <div className="modal-box" style={{ maxWidth:340,textAlign:'center' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>⚠️</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,marginBottom:8 }}>Cancel Booking?</div>
            <div style={{ color:'#666',fontSize:14,marginBottom:24 }}>
              {confirmCancel.roomName} · {confirmCancel.date} · {confirmCancel.startTime}–{confirmCancel.endTime}
            </div>
            <div style={{ display:'flex',gap:10 }}>
              <button className="secondary-btn" style={{ flex:1 }} onClick={()=>setConfirmCancel(null)}>Keep it</button>
              <button className="danger-btn" style={{ flex:1 }} onClick={()=>handleCancel(confirmCancel.id)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BookingCard({ b, onCancel, readonly }) {
  const colors = { Atlas:'#4ADE80', Meridian:'#60A5FA', Zenith:'#F472B6', Vertex:'#FACC15', Solstice:'#FB923C', Equinox:'#A78BFA' }
  const color = colors[b.roomName] || '#888'
  return (
    <div className="card" style={{ padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
      <div style={{ display:'flex',alignItems:'center',gap:18 }}>
        <div style={{ width:46,height:46,borderRadius:12,background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color }}>
          {b.roomName?.[0]}
        </div>
        <div>
          <div style={{ fontWeight:600,fontSize:16 }}>
            {b.roomName} <span style={{ color,fontSize:13,fontWeight:500 }}>Floor {b.roomFloor}</span>
          </div>
          <div style={{ color:'#666',fontSize:13,marginTop:2 }}>📅 {b.date} · ⏰ {b.startTime} – {b.endTime}</div>
          <div style={{ color:'#555',fontSize:12,marginTop:2 }}>📝 {b.purpose}</div>
        </div>
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:12 }}>
        <div style={{ fontSize:12,fontWeight:500,padding:'4px 10px',borderRadius:6,
          background:b.status==='ACTIVE'?'rgba(74,222,128,0.12)':b.status==='CANCELLED'?'rgba(239,68,68,0.1)':'rgba(255,255,255,0.06)',
          color:b.status==='ACTIVE'?'#4ADE80':b.status==='CANCELLED'?'#F87171':'#888' }}>
          {b.status}
        </div>
        {!readonly && b.status==='ACTIVE' && (
          <button className="danger-btn" style={{ padding:'6px 14px',fontSize:12 }} onClick={()=>onCancel(b)}>Cancel</button>
        )}
      </div>
    </div>
  )
}
