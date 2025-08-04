export interface WritingStyleExample {
  id: string
  title: string
  content: string
  type: 'headline' | 'subheading' | 'cta' | 'body' | 'email'
  createdAt: string
}

export interface OfferData {
  // Avatar fields
  niche: string
  income: string
  age: string
  traits: string
  primaryGoal1: string
  primaryGoal2: string
  primaryGoal3: string
  secondaryGoal1: string
  secondaryGoal2: string
  secondaryGoal3: string
  complaint1: string
  complaint2: string
  complaint3: string
  fear: string
  falseSolution: string
  mistakenBelief: string
  objection1: string
  objection2: string
  objection3: string
  expensiveAlternative1: string
  expensiveAlternative2: string
  expensiveAlternative3: string
  avatarStory: string
  
  // Transformation and core offer
  who: string
  outcome: string
  method: string
  timeframe: string
  guarantee: string
  
  // Activation points
  activationPoint1: string
  activationPoint2: string
  activationPoint3: string
  activationPoint4: string
  activationPoint5: string
  
  // Mechanisms
  mechanismPoint1: string
  mechanismPoint2: string
  mechanismPoint3: string
  mechanismPoint4: string
  mechanismPoint5: string
  
  // Case studies
  caseStudies?: Array<{
    name: string
    description: string
    result: string
  }>
}

export interface GeneratedCopy {
  headline: string
  subheadline: string
  heroText: string
  ctaText: string
  offerDescription: string
  guaranteeText: string
  pageTitle: string
  metaDescription: string
  emailSubject: string
  emailPreview: string
}

const STORAGE_KEY = 'ascension-writing-examples'

export class OpenAIService {
  private static instance: OpenAIService

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService()
    }
    return OpenAIService.instance
  }

  // Training functions using API (which uses Supabase)
  async addWritingExample(example: Omit<WritingStyleExample, 'id' | 'createdAt'>): Promise<WritingStyleExample> {
    try {
      const response = await fetch('/api/writing-examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '00000000-0000-0000-0000-000000000000', ...example })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save writing example')
      }
      
      const data = await response.json()
      return data.example
    } catch (error) {
      console.error('Error adding writing example:', error)
      // Fallback to localStorage
      return this.addWritingExampleLocal(example)
    }
  }

  async getWritingExamples(): Promise<WritingStyleExample[]> {
    try {
      const response = await fetch('/api/writing-examples?userId=00000000-0000-0000-0000-000000000000')
      
      if (!response.ok) {
        throw new Error('Failed to fetch writing examples')
      }
      
      const data = await response.json()
      return data.examples || []
    } catch (error) {
      console.error('Error getting writing examples:', error)
      // Fallback to localStorage
      return this.getWritingExamplesLocal()
    }
  }

  async removeWritingExample(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/writing-examples?userId=00000000-0000-0000-0000-000000000000&exampleId=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete writing example')
      }
    } catch (error) {
      console.error('Error removing writing example:', error)
      // Fallback to localStorage
      this.removeWritingExampleLocal(id)
    }
  }

  // Fallback localStorage methods
  private addWritingExampleLocal(example: Omit<WritingStyleExample, 'id' | 'createdAt'>): WritingStyleExample {
    const newExample: WritingStyleExample = {
      ...example,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    const examples = this.getWritingExamplesLocal()
    examples.push(newExample)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(examples))
    }
    
    return newExample
  }

  private getWritingExamplesLocal(): WritingStyleExample[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private removeWritingExampleLocal(id: string): void {
    const examples = this.getWritingExamplesLocal().filter(example => example.id !== id)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(examples))
    }
  }

  // Copy generation function that calls API route
  async generateCopy(offerData: OfferData, templateType: 'trigger' | 'gateway' = 'trigger'): Promise<GeneratedCopy> {
    try {
      const writingExamples = this.getWritingExamples()
      
      const response = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerData,
          templateType,
          writingExamples
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data.copy
    } catch (error) {
      console.error('Error generating copy:', error)
      // Return fallback copy
      return {
        headline: `Transform Your ${offerData.niche} Business with Our Proven ${offerData.method}`,
        subheadline: `Join successful ${offerData.who} who achieved ${offerData.outcome} in just ${offerData.timeframe}`,
        heroText: `Stop struggling with ${offerData.complaint1}. Our proven system helps ${offerData.who} achieve ${offerData.outcome} using our unique ${offerData.method} approach.`,
        ctaText: "Get Started Now",
        offerDescription: `Complete ${offerData.method} system designed to help ${offerData.who} achieve ${offerData.outcome} in ${offerData.timeframe}.`,
        guaranteeText: offerData.guarantee || "30-day money-back guarantee",
        pageTitle: `${offerData.outcome} - Proven ${offerData.method} for ${offerData.niche}`,
        metaDescription: `Discover how ${offerData.who} are achieving ${offerData.outcome} with our proven ${offerData.method}. ${offerData.guarantee}`,
        emailSubject: `Ready to achieve ${offerData.outcome}?`,
        emailPreview: `Your journey to ${offerData.outcome} starts here...`
      }
    }
  }

  async generateEmailSequence(offerData: OfferData): Promise<Array<{ subject: string; content: string; day: number }>> {
    try {
      const writingExamples = this.getWritingExamples()
      
      const response = await fetch('/api/ai/generate-email-sequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerData,
          writingExamples
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.emails || []
    } catch (error) {
      console.error('Error generating email sequence:', error)
      return []
    }
  }
}

export const openaiService = OpenAIService.getInstance() 