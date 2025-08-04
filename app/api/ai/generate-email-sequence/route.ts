import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { OfferData } from '../generate-copy/route'
import { 
  buildEmailSystemPrompt, 
  buildEmailUserPrompt, 
  getModelConfig 
} from '@/lib/ai-prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { offerData, writingExamples } = await request.json()

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
    const systemPrompt = buildEmailSystemPrompt(writingStylePrompt)
    const userPrompt = buildEmailUserPrompt(offerData, 'trigger') // Default to trigger for now

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
        const emails = JSON.parse(response)
        return NextResponse.json({ emails })
      } catch (parseError) {
        // Fallback if JSON parsing fails
        const fallbackEmails = [
          {
            subject: `Still thinking about ${offerData.outcome}?`,
            content: `Hi there,\n\nI noticed you were interested in achieving ${offerData.outcome}.\n\nI wanted to reach out because I know how ${offerData.complaint1} can be frustrating.\n\nOur ${offerData.method} has helped many ${offerData.who} overcome this exact challenge.\n\nWould you like to learn more?\n\nBest regards,\nThe Team`,
            day: 1
          }
        ]
        return NextResponse.json({ emails: fallbackEmails })
      }
    } catch (error) {
      console.error('Error calling OpenAI for email sequence:', error)
      // Return fallback email sequence
      const fallbackEmails = [
        {
          subject: `Still thinking about ${offerData.outcome}?`,
          content: `Hi there,\n\nI noticed you were interested in achieving ${offerData.outcome}.\n\nI wanted to reach out because I know how ${offerData.complaint1} can be frustrating.\n\nOur ${offerData.method} has helped many ${offerData.who} overcome this exact challenge.\n\nWould you like to learn more?\n\nBest regards,\nThe Team`,
          day: 1
        }
      ]
      return NextResponse.json({ emails: fallbackEmails })
    }
  } catch (error) {
    console.error('Error in generate-email-sequence API:', error)
    return NextResponse.json({ error: 'Failed to generate email sequence' }, { status: 500 })
  }
} 