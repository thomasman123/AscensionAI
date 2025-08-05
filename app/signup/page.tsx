'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('Check your email for the confirmation link!')
      setLoading(false)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex">
      {/* Left Side - Brand/Logo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-primary-foreground" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold">Ascension AI</h1>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Transform Your Marketing</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle size={12} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">AI-Powered Funnels</p>
                    <p className="text-muted-foreground text-sm">Generate complete marketing funnels in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle size={12} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Automated Campaigns</p>
                    <p className="text-muted-foreground text-sm">Smart ad copy and targeting for maximum ROI</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle size={12} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Real-Time Analytics</p>
                    <p className="text-muted-foreground text-sm">Track performance and optimize in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-primary-foreground" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold">Ascension AI</h1>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-3">Create your account</h2>
            <p className="text-muted-foreground">Start your 14-day free trial</p>
          </div>

          {/* Signup Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/20 bg-green-500/5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-400">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email || !password}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Sign in instead
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 