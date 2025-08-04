import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  Target, 
  Rocket, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Settings
} from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-tier-950 via-tier-900 to-tier-800">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-tier-800/50 bg-tier-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold text-tier-50">Ascension AI</h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-tier-300 hover:text-tier-50 transition-colors">Features</a>
              <a href="#pricing" className="text-tier-300 hover:text-tier-50 transition-colors">Pricing</a>
              <a href="#docs" className="text-tier-300 hover:text-tier-50 transition-colors">Docs</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-tier-300 hover:text-tier-50" asChild>
                <a href="/login">Sign in</a>
              </Button>
              <Button className="bg-accent-500 hover:bg-accent-600" asChild>
                <a href="/signup">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-600/10 border border-accent-600/20 text-accent-400 text-sm font-medium">
                <Sparkles size={14} />
                Now in public beta
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="text-tier-50">AI-Powered Marketing</span>
                <br />
                <span className="text-tier-50">for </span>
                <span className="text-gradient">Modern Teams</span>
              </h1>
              <p className="text-xl text-tier-300 max-w-3xl mx-auto leading-relaxed">
                Transform your marketing operations with real-time analytics, AI-powered 
                insights, and seamless team collaboration. Built for performance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white font-semibold" asChild>
                <a href="/signup">
                  Get Started
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-tier-600 hover:border-tier-500 text-tier-300 hover:text-tier-50" asChild>
                <a href="/login">View Demo</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-800/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-tier-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-tier-50 mb-4">
              Everything you need to scale your marketing operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-tier-800/50 border-tier-700/50 hover:border-accent-600/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent-600/10 rounded-lg flex items-center justify-center">
                  <BarChart3 size={24} className="text-accent-400" />
                </div>
                <div>
                  <CardTitle className="text-tier-50">Real-time Analytics</CardTitle>
                  <CardDescription className="text-tier-300">
                    Monitor your sales performance with live dashboards and instant insights.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-tier-800/50 border-tier-700/50 hover:border-accent-600/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent-600/10 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-accent-400" />
                </div>
                <div>
                  <CardTitle className="text-tier-50">Team Collaboration</CardTitle>
                  <CardDescription className="text-tier-300">
                    Seamlessly manage sales reps and appointment setters in one platform.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-tier-800/50 border-tier-700/50 hover:border-accent-600/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent-600/10 rounded-lg flex items-center justify-center">
                  <Globe size={24} className="text-accent-400" />
                </div>
                <div>
                  <CardTitle className="text-tier-50">Global Coverage</CardTitle>
                  <CardDescription className="text-tier-300">
                    Multi-timezone support with automatic time zone detection and conversion.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-tier-800/50 border-tier-700/50 hover:border-accent-600/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent-600/10 rounded-lg flex items-center justify-center">
                  <Settings size={24} className="text-accent-400" />
                </div>
                <div>
                  <CardTitle className="text-tier-50">Enterprise Security</CardTitle>
                  <CardDescription className="text-tier-300">
                    Bank-grade security with end-to-end encryption and compliance standards.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-tier-800/50 border-tier-700/50 hover:border-accent-600/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent-600/10 rounded-lg flex items-center justify-center">
                  <Zap size={24} className="text-accent-400" />
                </div>
                <div>
                  <CardTitle className="text-tier-50">Smart Automation</CardTitle>
                  <CardDescription className="text-tier-300">
                    AI-powered workflow automation to streamline your sales processes.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-tier-800/50 border-tier-700/50 hover:border-accent-600/30 transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent-600/10 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-accent-400" />
                </div>
                <div>
                  <CardTitle className="text-tier-50">Multi-tenant</CardTitle>
                  <CardDescription className="text-tier-300">
                    Manage multiple clients or teams with isolated data and customizable branding.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-accent-950/20 to-tier-900">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-tier-50">
              Ready to transform your sales operations?
            </h2>
            <p className="text-xl text-tier-300 max-w-2xl mx-auto">
              Join thousands of sales teams already using our platform to accelerate their growth.
            </p>
            
            <div className="space-y-4">
              <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white font-semibold" asChild>
                <a href="/signup">
                  <Zap size={20} className="mr-2" />
                  Get Started for Free
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
              <p className="text-sm text-tier-400">
                No credit card required • Setup in under 5 minutes • 14-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-tier-800 bg-tier-950 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-tier-50">Ascension AI</span>
            </div>
            <p className="text-center text-tier-400 text-sm">
              © 2024 Ascension AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
} 