import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { globalStyles } from '../styles.js'

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', fullName:'' })
  const { register, loading } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.username||!form.email||!form.password||!form.fullName) { setError('All fields required.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    const res = await register(form)
    if (res.success) { setSuccess(true); setTimeout(()=>navigate('/login'),1500) }
    else setError(res.error)
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight:'100vh',background:'#0A0A0F',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
        <div style={{ position:'fixed',inset:0,pointerEvents:'none',opacity:0.025,
          backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'40px 40px' }} />

        <div className="fade-up" style={{ width:'100%',maxWidth:400 }}>
          <div style={{ textAlign:'center',marginBottom:40 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#4ADE80,#22C55E)',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 16px' }}>🏛</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,letterSpacing:'-0.03em' }}>StudySpace</div>
            <div style={{ color:'#555',fontSize:14,marginTop:4 }}>Create your account</div>
          </div>

          <div className="card" style={{ padding:32 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,marginBottom:24 }}>Register</div>

            {error && <div className="error-msg" style={{ marginBottom:16 }}>{error}</div>}
            {success && <div style={{ background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)',color:'#4ADE80',borderRadius:10,padding:'12px 16px',fontSize:13,marginBottom:16 }}>
              ✅ Registered! Redirecting to login…
            </div>}

            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {[['fullName','Full Name','text','John Doe'],['username','Username','text','johndoe'],
                ['email','Email','email','john@university.edu'],['password','Password','password','Min. 6 characters']].map(([k,label,type,ph])=>(
                <div key={k}>
                  <label style={{ fontSize:12,color:'#666',display:'block',marginBottom:6 }}>{label}</label>
                  <input type={type} className="input-field" placeholder={ph} value={form[k]}
                    onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                </div>
              ))}
            </div>

            <button className="primary-btn" style={{ width:'100%',marginTop:24 }} onClick={handleSubmit} disabled={loading||success}>
              {loading?<span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}><span className="spinner"/>Creating…</span>:'Create Account'}
            </button>

            <div style={{ textAlign:'center',marginTop:20,fontSize:13,color:'#555' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#4ADE80',fontWeight:500 }}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
