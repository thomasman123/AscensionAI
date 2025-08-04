import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { 
  buildCopySystemPrompt, 
  buildCopyUserPrompt, 
  getModelConfig 
} from '@/lib/ai-prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

function generateFallbackCopy(offerData: OfferData): GeneratedCopy {
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

export async function POST(request: NextRequest) {
  try {
    const { offerData, templateType, writingExamples } = await request.json()

    if (!offerData) {
      return NextResponse.json({ error: 'Offer data is required' }, { status: 400 })
    }

    // Build writing style prompt
    let writingStylePrompt = "Write in a professional, compelling marketing style."
    
    if (writingExamples && writingExamples.length > 0) {
      const examplesByType = writingExamples.reduce((acc: any, example: any) => {
        if (!acc[example.type]) acc[example.type] = []
        acc[example.type].push(example.content)
        return acc
      }, {})

      writingStylePrompt = "Please write in the following style based on these examples:\n\n"
      
      Object.entries(examplesByType).forEach(([type, examples]: [string, any]) => {
        writingStylePrompt += `${type.toUpperCase()} Examples:\n`
        examples.forEach((example: string, index: number) => {
          writingStylePrompt += `${index + 1}. ${example}\n`
        })
        writingStylePrompt += "\n"
      })
    }

    // Build prompts using centralized configuration
    const systemPrompt = buildCopySystemPrompt(writingStylePrompt)
    const userPrompt = buildCopyUserPrompt(offerData, templateType)

    try {
      const modelConfig = getModelConfig('default')
      const completion = await openai.chat.completions.create({
        model: modelConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      try {
        const generatedCopy = JSON.parse(response) as GeneratedCopy
        return NextResponse.json({ copy: generatedCopy })
      } catch (parseError) {
        // Fallback if JSON parsing fails
        const fallbackCopy = generateFallbackCopy(offerData)
        return NextResponse.json({ copy: fallbackCopy })
      }
    } catch (error) {
      console.error('Error calling OpenAI:', error)
      const fallbackCopy = generateFallbackCopy(offerData)
      return NextResponse.json({ copy: fallbackCopy })
    }
  } catch (error) {
    console.error('Error in generate-copy API:', error)
    return NextResponse.json({ error: 'Failed to generate copy' }, { status: 500 })
  }
} 