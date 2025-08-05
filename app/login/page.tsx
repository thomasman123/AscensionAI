'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
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

          {/* Testimonial */}
          <div className="space-y-6">
            <blockquote className="text-lg leading-relaxed text-muted-foreground">
              "Ascension AI transformed how we manage our marketing operations. The fully automated funnel creation and AI-powered campaigns are game-changers."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">SD</span>
              </div>
              <div>
                <div className="font-medium">Sofia Davis</div>
                <div className="text-muted-foreground text-sm">VP of Marketing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
            <h2 className="text-3xl font-bold mb-3">Welcome back</h2>
            <p className="text-muted-foreground">Enter your email to sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email || !password}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">Don't have an account?</span>
                </div>
              </div>

              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full">
                  Create free account
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
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