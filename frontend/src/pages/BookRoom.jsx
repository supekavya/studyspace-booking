import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { roomApi, bookingApi } from '../services/api.js'
import { AMENITY_ICONS, TIME_SLOTS } from '../styles.js'
import { useAuth } from '../hooks/useAuth.jsx'

export default function BookRoom() {
  const { user } = useAuth()
  const location = useLocation()
  const [rooms, setRooms] = useState([])
  const [slots, setSlots] = useState({}) // {roomId: [slotStatus]}
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterCap, setFilterCap] = useState(0)
  const [filterFloor, setFilterFloor] = useState(0)
  const [bookingModal, setBookingModal] = useState(null)
  const [form, setForm] = useState({ startTime:'', endTime:'', purpose:'' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(null)

  useEffect(() => { loadRooms() }, [filterCap, filterFloor])
  useEffect(() => { if (rooms.length) loadSlots() }, [rooms, selectedDate])

  async function loadRooms() {
    setLoading(true)
    try {
      const params = {}
      if (filterCap > 0) params.capacity = filterCap
      if (filterFloor > 0) params.floor = filterFloor
      const res = await roomApi.getAll(params)
      setRooms(res.data)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function loadSlots() {
    const results = await Promise.all(rooms.map(r => roomApi.getSlots(r.id, selectedDate)))
    const map = {}
    rooms.forEach((r,i) => { map[r.id] = results[i].data })
    setSlots(map)
  }

  function getSlot(roomId, time) {
    return slots[roomId]?.find(s => s.time === time)
  }

  async function handleBook() {
    if (!form.startTime || !form.endTime || !form.purpose.trim()) {
      window.showToast?.('Please fill all fields.', 'error'); return
    }
    setSubmitting(true)
    try {
      await bookingApi.create({ roomId: bookingModal.roomId, date: selectedDate, startTime: form.startTime, endTime: form.endTime, purpose: form.purpose })
      window.showToast?.('Room booked successfully! 🎉')
      setBookingModal(null)
      setForm({ startTime:'', endTime:'', purpose:'' })
      await loadSlots()
    } catch(err) {
      const msg = err.response?.data?.error || 'Booking failed.'
      window.showToast?.(msg, 'error')
    } finally { setSubmitting(false) }
  }

  async function handleCancelMyBooking(bookingId) {
    try {
      await bookingApi.cancel(bookingId)
      window.showToast?.('Booking cancelled.')
      setConfirmCancel(null)
      await loadSlots()
    } catch { window.showToast?.('Failed to cancel.', 'error') }
  }

  return (
    <div className="fade-up">
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,letterSpacing:'-0.02em' }}>Book a Room</div>
          <div style={{ color:'#555',fontSize:14,marginTop:4 }}>Click a green slot to reserve it</div>
        </div>
        <div style={{ display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' }}>
          <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]}
            onChange={e=>setSelectedDate(e.target.value)} className="input-field" style={{ width:160,padding:'9px 12px' }} />
          <select className="input-field" style={{ width:130 }} value={filterFloor} onChange={e=>setFilterFloor(Number(e.target.value))}>
            <option value={0}>All Floors</option>
            <option value={1}>Floor 1</option>
            <option value={2}>Floor 2</option>
            <option value={3}>Floor 3</option>
          </select>
          <select className="input-field" style={{ width:150 }} value={filterCap} onChange={e=>setFilterCap(Number(e.target.value))}>
            <option value={0}>Any Capacity</option>
            <option value={2}>2+ people</option>
            <option value={4}>4+ people</option>
            <option value={6}>6+ people</option>
            <option value={8}>8+ people</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex',gap:20,marginBottom:20 }}>
        {[['#4ADE80','rgba(74,222,128,0.12)','Available'],['#60A5FA','rgba(96,165,250,0.15)','Your Booking'],['#444','rgba(255,255,255,0.04)','Booked']].map(([c,bg,label])=>(
          <div key={label} style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:28,height:22,borderRadius:5,background:bg,border:`1px solid ${c}44` }} />
            <span style={{ fontSize:12,color:'#666' }}>{label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300 }}>
          <div className="spinner" style={{ width:36,height:36 }} />
        </div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse',minWidth:700 }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left',padding:'8px 12px',color:'#555',fontSize:12,fontWeight:500,width:80 }}>TIME</th>
                {rooms.map(room => (
                  <th key={room.id} style={{ textAlign:'center',padding:'8px 8px',fontSize:12,fontWeight:600,color:room.color,whiteSpace:'nowrap' }}>
                    <div>{room.name}</div>
                    <div style={{ color:'#444',fontWeight:400,fontSize:11 }}>Cap. {room.capacity}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, si) => (
                <tr key={slot} style={{ borderTop:'1px solid #0F0F1A' }}>
                  <td style={{ padding:'5px 12px',color:'#555',fontSize:12,fontWeight:500 }}>{slot}</td>
                  {rooms.map(room => {
                    const s = getSlot(room.id, slot)
                    const isMine = s && !s.available && s.bookedBy === user?.fullName
                    return (
                      <td key={room.id} style={{ padding:'4px 6px',textAlign:'center' }}>
                        {!s || s.available ? (
                          <button className="slot-btn slot-free" onClick={() => {
                            setBookingModal({ roomId: room.id, roomName: room.name, roomColor: room.color })
                            setForm({ startTime: slot, endTime: TIME_SLOTS[Math.min(si+2, TIME_SLOTS.length-1)], purpose: '' })
                          }}>Free</button>
                        ) : isMine ? (
                          <button className="slot-btn slot-mine" title={s.purpose}
                            onClick={()=>setConfirmCancel({ bookingId: s.bookingId, slot, roomName: room.name })}>
                            Mine ✕
                          </button>
                        ) : (
                          <div className="slot-btn slot-booked" title={`${s.bookedBy} — ${s.purpose}`}>●</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setBookingModal(null)}>
          <div className="modal-box">
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:bookingModal.roomColor }}>{bookingModal.roomName}</div>
                <div style={{ color:'#555',fontSize:13,marginTop:4 }}>📅 {selectedDate}</div>
              </div>
              <button onClick={()=>setBookingModal(null)} style={{ background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:22,lineHeight:1 }}>×</button>
            </div>

            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
                <div>
                  <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>Start Time</label>
                  <select className="input-field" value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))}>
                    {TIME_SLOTS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>End Time</label>
                  <select className="input-field" value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))}>
                    {TIME_SLOTS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>Purpose</label>
                <input className="input-field" placeholder="e.g. Group Project, Study Session…" value={form.purpose}
                  onChange={e=>setForm(f=>({...f,purpose:e.target.value}))} />
              </div>
            </div>

            <div style={{ display:'flex',gap:10,marginTop:24 }}>
              <button className="secondary-btn" style={{ flex:1 }} onClick={()=>setBookingModal(null)}>Cancel</button>
              <button className="primary-btn" style={{ flex:2 }} onClick={handleBook} disabled={submitting}>
                {submitting?<span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><span className="spinner"/>Booking…</span>:'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {confirmCancel && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setConfirmCancel(null)}>
          <div className="modal-box" style={{ maxWidth:340,textAlign:'center' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>⚠️</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,marginBottom:8 }}>Cancel Booking?</div>
            <div style={{ color:'#666',fontSize:14,marginBottom:24 }}>{confirmCancel.roomName} at {confirmCancel.slot}</div>
            <div style={{ display:'flex',gap:10 }}>
              <button className="secondary-btn" style={{ flex:1 }} onClick={()=>setConfirmCancel(null)}>Keep it</button>
              <button className="danger-btn" style={{ flex:1 }} onClick={()=>handleCancelMyBooking(confirmCancel.bookingId)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
