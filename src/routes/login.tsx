import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import '../styles.css'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (field: 'email' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = formData.email.trim().toLowerCase()
    const password = formData.password

    if (!email || !password) {
      toast.error('Silakan lengkapi email dan password.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message || 'Email atau password salah. Silakan cek kembali atau register terlebih dahulu.')
      return
    }

    toast.success('Login berhasil.')
    navigate({ to: '/' })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-banner">
          <div className="brand">
            <div className="brand-logo">P</div>
            <div>
              <h2>PocketWise</h2>
              <span>PAPER-LEDGER MONEY</span>
            </div>
          </div>

          <div className="banner-content">
            <h1>
              Kelola Keuangan
              <br />
              dengan Lebih Bijak
            </h1>

            <p>
              Pantau pengeluaran, atur anggaran,
              dan capai tujuan finansialmu
              bersama PocketWise.
            </p>
          </div>

          <div className="finance-illustration">
            <div className="wallet">
              <span>P</span>
            </div>

            <div className="coin coin-one">Rp</div>
            <div className="coin coin-two">Rp</div>

            <div className="paper paper-one">
              <div></div>
              <div></div>
              <div></div>
            </div>

            <div className="paper paper-two">
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
              <div className="chart-bar"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-form">
          <div className="form-decoration">✦</div>

          <h1>Welcome Back</h1>

          <p className="form-subtitle">
            Masuk ke akun kamu untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email atau Username</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={16} strokeWidth={2} />
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Email atau Username"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={16} strokeWidth={2} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>

              <a href="#">Lupa password?</a>
            </div>

            <button type="submit" className="auth-button">
              Login
              <span>→</span>
            </button>
          </form>

          <div className="divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button className="google-button">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.62l6.8-6.8C35.94 2.75 30.5 0 24 0 14.62 0 6.44 5.38 2.5 13.2l7.98 6.18C12.5 13.77 17.59 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.55c0-1.64-.15-3.2-.42-4.71H24v8.91h12.73c-.55 2.97-2.25 5.49-4.78 7.19l7.75 6.01c4.5-4.15 7.8-10.27 7.8-17.4z"/>
              <path fill="#FBBC05" d="M24 47c6.48 0 11.92-2.14 15.89-5.81l-7.75-6.01c-2.15 1.45-4.91 2.3-8.14 2.3-6.4 0-11.82-4.27-13.76-10.05l-7.98 6.18C6.44 42.62 14.62 47 24 47z"/>
              <path fill="#34A853" d="M10.24 30.43A14.64 14.64 0 0 1 9.5 24c0-1.6.28-3.14.78-4.57L2.5 13.2A23.89 23.89 0 0 0 0 24c0 3.79.91 7.37 2.5 10.53l7.74-6.1z"/>
            </svg>
            <span>Login with Google</span>
          </button>

          <p className="switch-account">
            Belum punya akun?{' '}
            <Link to="/register">Register</Link>
          </p>
        </div>

      </div>
    </div>
  )
}