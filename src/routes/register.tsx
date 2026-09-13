import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'
import '../styles.css'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleInputChange = (field: 'name' | 'email') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextName = formData.name.trim()
    const nextEmail = formData.email.trim().toLowerCase()
    const nextPassword = password.trim()
    const nextConfirmPassword = confirmPassword.trim()

    if (!nextName || !nextEmail || !nextPassword || !nextConfirmPassword) {
      toast.error('Silakan lengkapi semua field sebelum register.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(nextEmail)) {
      toast.error('Format email tidak valid.')
      return
    }

    // Tolak domain email sekali pakai / sampah, tapi domain lain bebas dipakai
    const disposableDomains = [
      'mailinator.com',
      'tempmail.com',
      'temp-mail.org',
      '10minutemail.com',
      'guerrillamail.com',
      'yopmail.com',
      'trashmail.com',
      'throwawaymail.com',
      'sharklasers.com',
      'getnada.com',
      'dispostable.com',
      'fakeinbox.com',
      'mailnesia.com',
      'maildrop.cc',
    ]

    const emailDomain = nextEmail.split('@')[1]?.toLowerCase()

    if (!emailDomain || disposableDomains.includes(emailDomain)) {
      toast.error('Gunakan email pribadi yang valid, bukan email sekali pakai/sampah.')
      return
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

    if (!passwordRegex.test(nextPassword)) {
      toast.error('Password terlalu lemah! Gunakan minimal 6 karakter dengan kombinasi huruf dan angka.')
      return
    }

    if (nextPassword !== nextConfirmPassword) {
      toast.error('Konfirmasi password tidak cocok.')
      return
    }

    if (!hasSupabaseConfig) {
      toast.error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email: nextEmail,
      password: nextPassword,
      options: {
        data: {
          fullname: nextName,
        },
      },
    })

    if (error) {
      toast.error(error.message || 'Register gagal. Silakan coba kembali.')
      return
    }

    toast.success('Register berhasil. Silakan login.')
    navigate({ to: '/login' })
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
              Mulai Langkah Pertama
              <br />
              Menuju Keuangan yang
              <br />
              Lebih Baik
            </h1>

            <p>
              Buat akun sekarang dan nikmati
              kemudahan mengelola keuangan
              pribadi Anda.
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

          <h1>Create Account</h1>

          <p className="form-subtitle">
            Register your new PocketWise account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <UserRound size={16} strokeWidth={2} />
                </span>

                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={16} strokeWidth={2} />
                </span>

                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email"
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
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

            <div className="input-group">
              <label>Confirm Password</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={16} strokeWidth={2} />
                </span>

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-button">
              Register
              <span>→</span>
            </button>
          </form>

          <div className="divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <button className="google-button">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 9.5c3.54 0 6.7 1.22 9.2 3.62l6.8-6.8C35.94 2.75 30.5 0 24 0 14.62 0 6.44 5.38 2.5 13.2l7.98 6.18C12.5 13.77 17.59 9.5 24 9.5z"/>
              <path d="M46.5 24.55c0-1.64-.15-3.2-.42-4.71H24v8.91h12.73c-.55 2.97-2.25 5.49-4.78 7.19l7.75 6.01c4.5-4.15 7.8-10.27 7.8-17.4z"/>
              <path d="M24 47c6.48 0 11.92-2.14 15.89-5.81l-7.75-6.01c-2.15 1.45-4.91 2.3-8.14 2.3-6.4 0-11.82-4.27-13.76-10.05l-7.98 6.18C6.44 42.62 14.62 47 24 47z"/>
              <path d="M10.24 30.43A14.64 14.64 0 0 1 9.5 24c0-1.6.28-3.14.78-4.57L2.5 13.2A23.89 23.89 0 0 0 0 24c0 3.79.91 7.37 2.5 10.53l7.74-6.1z"/>
            </svg>
            <span>Register with Google</span>
          </button>

          <p className="switch-account">
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </div>

      </div>
    </div>
  )
}