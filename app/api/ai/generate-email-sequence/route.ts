import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { OfferData } from '../generate-copy/route'

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

    const systemPrompt = `You are an expert email marketer. Create a 5-day email follow-up sequence.
    ${writingStylePrompt}
    
    Return a JSON array of email objects with this structure:
    [
      {
        "subject": "Email subject line",
        "content": "Full email content with proper formatting",
        "day": 1
      }
    ]`

    const userPrompt = `Create a 5-day email sequence for leads who didn't convert immediately.
    
    Target: ${offerData.who}
    Outcome: ${offerData.outcome}
    Method: ${offerData.method}
    Timeframe: ${offerData.timeframe}
    
    Address these objections:
    1. ${offerData.objection1}
    2. ${offerData.objection2}
    3. ${offerData.objection3}
    
    Include social proof from case studies if available.`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
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