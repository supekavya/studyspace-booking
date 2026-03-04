import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { globalStyles } from '../styles.js'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const { login, loading } = useAuth()
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.username || !form.password) { setError('Please fill all fields.'); return }
    const res = await login(form.username, form.password)
    if (res.success) navigate('/')
    else setError(res.error)
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight:'100vh',background:'#0A0A0F',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
        <div style={{ position:'fixed',inset:0,pointerEvents:'none',opacity:0.025,
          backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize:'40px 40px' }} />
        <div style={{ position:'fixed',top:-100,left:'50%',transform:'translateX(-50%)',width:500,height:400,
          background:'radial-gradient(ellipse,rgba(74,222,128,0.08) 0%,transparent 70%)',pointerEvents:'none' }} />

        <div className="fade-up" style={{ width:'100%',maxWidth:400 }}>
          {/* Logo */}
          <div style={{ textAlign:'center',marginBottom:40 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#4ADE80,#22C55E)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 16px' }}>🏛</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,letterSpacing:'-0.03em' }}>StudySpace</div>
            <div style={{ color:'#555',fontSize:14,marginTop:4 }}>Smart Study Room Booking</div>
          </div>

          <div className="card" style={{ padding:32 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,marginBottom:24 }}>Sign In</div>

            {error && <div className="error-msg" style={{ marginBottom:16 }}>{error}</div>}

            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              <div>
                <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>Username</label>
                <input className="input-field" placeholder="Enter your username" value={form.username}
                  onChange={e=>setForm(f=>({...f,username:e.target.value}))}
                  onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
              </div>
              <div>
                <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>Password</label>
                <input type="password" className="input-field" placeholder="Enter your password" value={form.password}
                  onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                  onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
              </div>
            </div>

            <button className="primary-btn" style={{ width:'100%',marginTop:24 }} onClick={handleSubmit} disabled={loading}>
              {loading ? <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><span className="spinner"/>Signing in…</span> : 'Sign In'}
            </button>

            <div style={{ textAlign:'center',marginTop:20,fontSize:13,color:'#555' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#4ADE80',fontWeight:500 }}>Register</Link>
            </div>

            <div style={{ marginTop:20,padding:'12px 16px',background:'#0F0F1A',borderRadius:10,fontSize:12,color:'#555' }}>
              <strong style={{ color:'#888' }}>Demo admin:</strong> admin / admin123
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
