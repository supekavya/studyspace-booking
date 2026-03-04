import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { globalStyles } from '../styles.js'
import { useState, useEffect } from 'react'

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  // Expose toast globally via window for child pages
  useEffect(() => { window.showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000) } }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0F', position: 'relative' }}>
        {/* Background grid */}
        <div style={{ position:'fixed',inset:0,pointerEvents:'none',opacity:0.025,
          backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize:'40px 40px' }} />
        <div style={{ position:'fixed',top:-200,left:'50%',transform:'translateX(-50%)',width:600,height:400,
          background:'radial-gradient(ellipse,rgba(74,222,128,0.06) 0%,transparent 70%)',pointerEvents:'none' }} />

        {/* Header */}
        <header style={{ position:'sticky',top:0,zIndex:50,background:'rgba(10,10,15,0.88)',backdropFilter:'blur(16px)',
          borderBottom:'1px solid #1A1A2A',padding:'0 24px' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:64 }}>
            <NavLink to="/" style={{ display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#4ADE80,#22C55E)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🏛</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17,lineHeight:1,letterSpacing:'-0.02em' }}>StudySpace</div>
                <div style={{ fontSize:10,color:'#555',letterSpacing:'0.08em',textTransform:'uppercase' }}>Smart Booking</div>
              </div>
            </NavLink>

            <nav style={{ display:'flex',gap:4 }}>
              <NavLink to="/" end className={({isActive})=>`nav-btn${isActive?' active':''}`}>📊 Dashboard</NavLink>
              <NavLink to="/book" className={({isActive})=>`nav-btn${isActive?' active':''}`}>🗓 Book a Room</NavLink>
              <NavLink to="/my-bookings" className={({isActive})=>`nav-btn${isActive?' active':''}`}>📋 My Bookings</NavLink>
              {isAdmin && <NavLink to="/admin" className={({isActive})=>`nav-btn${isActive?' active':''}`}>⚙️ Admin</NavLink>}
            </nav>

            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:'#4ADE80',boxShadow:'0 0 8px #4ADE80' }} />
              <span style={{ fontSize:13,color:'#666' }}>{user?.fullName}</span>
              <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#60A5FA,#A78BFA)',
                display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:700,cursor:'pointer' }}
                title={`${user?.username} (${user?.role})`}>
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <button onClick={handleLogout} className="secondary-btn" style={{ padding:'7px 14px',fontSize:13 }}>Logout</button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth:1200,margin:'0 auto',padding:'32px 24px',minHeight:'calc(100vh - 64px)' }}>
          <Outlet />
        </main>

        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed',bottom:28,right:28,zIndex:200,
            background:toast.type==='error'?'#1A0A0A':'#0A1A0E',
            border:`1px solid ${toast.type==='error'?'rgba(239,68,68,0.4)':'rgba(74,222,128,0.4)'}`,
            borderRadius:12,padding:'14px 20px',fontSize:14,fontWeight:500,
            color:toast.type==='error'?'#F87171':'#4ADE80',
            boxShadow:'0 8px 32px rgba(0,0,0,0.5)',animation:'toastIn 0.3s ease forwards',
            display:'flex',alignItems:'center',gap:10,maxWidth:320 }}>
            {toast.type==='error'?'❌':'✅'} {toast.msg}
          </div>
        )}
      </div>
    </>
  )
}
