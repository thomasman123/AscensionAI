// AI Prompts Configuration
// Customize the AI's thinking, personality, and approach here

import { OfferData } from '@/app/api/ai/generate-copy/route'

// ============================================================================
// KNOWLEDGE DUMP - ADD ALL YOUR INFORMATION HERE
// ============================================================================

export const KNOWLEDGE_DUMP = `

PASTE ALL YOUR KNOWLEDGE, METHODOLOGIES, FRAMEWORKS, AND THINKING HERE:

Our two types of funnels
When it comes to funnels and client acquisition, there are countless funnel strategies out there.
Each claim to be the best or most effective, but in reality the majority of successful campaigns we run for our clients rely on just two core funnel types.
Both funnel types have their own strengths and drawbacks and choosing the right one depends on your goals, audience, and offer.
Lead magnet (Trigger Funnel)
A Lead Magnet Funnel is designed to capture a prospect’s contact information in exchange for something of value, usually a free resource that helps them make progress toward their goals. This could be an ebook, checklist, free training, or downloadable guide tailored to a specific need or problem.
Pros:
Lower CPL
High volume
Segmented targeting
Cons:
Lead quality varies
App. setting needed
Execution matters
Book a call (Gateway Funnel)
The Book a call Funnel is a more direct approach. Rather than offering a free resource, it asks the prospect to book a call right away - typically because they have an urgent need for the exact solution you're offering.
Pros:
Immediate booked calls
No app. Setter needed
Qualified leads
Cons:
Higher CPL/CPBC
Inconsistent quality (when done right, it crushes)
Lower volume

The Gateway Funnel™
Our main goal with a lead magnet funnel is simple: to generate as many qualified leads as possible (not appointments, leads…) at the LOWEST possible cost. We typically aim anywhere between $5 - $20 per lead (AUD)
At the core of this funnel, is the lead magnet - something of value that we can give away in exchange for their name, email, phone number and one or two additional qualifying data points. E.g.
Rev. or income level
Business size
Whether they have a business partner
Other key indicators based on conditional logic
These questions help pre-qualify leads without overwhelming them on the front end.
Now, why is the cost per lead so affordable? Because we are giving them something in return. It's an exchange. We aren’t just asking for their information, we are offering a helpful and relevant asset in return.
This funnel is typically aimed at people who are problem-aware but not yet solution aware. They’re actively searching for options, or trying to UNDERSTAND the help that is available to said problem, but haven’t committed to a path yet.
E.g. electrical business owners wanting to scale to 7 figures
A PDF guide explaining the WHAT not the HOW to getting there
Always focus on the WHAT not the HOW.
The high ticket offer we are selling shows the HOW
Let’s say you’re spending $100/day on ads, generating leads at $10 a pop, that’s 10 leads a day, potentially more
Once the leads are in, they’re nurtured through automated email and SMS sequences. These sequences build trust, educate and ultimately aim to drive the lead towards BOOKING A CALL.
Depending on sales infrastructure, you’ll approach this differently:
If you’re scaling and already have a full sales team (app. Setters, closers, etc.) it makes sense to book leads into a discovery call (15 min call with a setter) BEFORE the sales call for extra qualification.
If you’re doing under $100-150K/month you probably don’t have the team capacity/ad spend to risk leads going missing in the discovery -> sales call process
Book them directly into the sales call with a rep or yourself
To make these funnels work, you should be aiming to book calls at under $100 per booked call. That means for every 10 leads at $10 each, one should book in.
Ask yourself: Can I create an asset that generates at least one genuinely interested, qualified lead for every 10 opt-ins?
Then do it.
Aside from generating leads and sales, it has long term benefits.
Deliver educational content through email + sms marketing to people who are in problem aware stages, positions your business as an authority.
Prospects start to trust you because you helped them understand the path forward, and associate you with the solution.

The Trigger Funnel™
Book a call funnels are more direct and conversion focused where the goal is simple: qualified prospects booking directly into an appointment straight from an ad with a good marketing cost per appointment.
This approach is best suited for offers that are already dialed in, with product-market fit, and when you’re looking for immediate conversations with motivated buyers.
A typical BAC funnel looks like this:
1. Ad -> VSL Page
The prospect clicks through an ad and lands on a page with a short Video Sales Letter (VSL). This video breaks down the offer clearly - what it is, who it's for, the outcomes they can expect, and why they should care.
I recommend including pricing (or at least a range) in the VSL. This helps set clear expectations early and filters out people who aren’t a financial fit - reducing time-wasters later on.
2. Initial info capture (optional)
After watching the VSL, the prospect either: fills out short form (name, phone, email) and is passed to next page or goes directly to the calendar booking page
3. Calendar booking page
On this page, they choose a time to speak. Here's where you apply heavier qualifications. In addition to the basics (name, phone, email, business name), you include 3-5 targeted questions. E.g. for HELIOS:
What’s your current monthly revenue?
How many sales calls are you booking each month?
Do you currently have a sales team?
Are you running paid ads?
What’s your biggest challenge right now?
This helps pre-qualify, get sales intel before call and FEED facebooks Conversion API and pixel with better quality event data for improved targeting.
This funnel tends to attract more solution aware buyers, people who know they have a problem and are actively searching for help right now. It’s fast, direct, and lets you test the market and offer positioning quickly.
Pros:
Direct conversations with real prospects
Faster feedback on your offer and messaging
More control over lead quality through upfront qualification
Helps identify market-fit issues early
Cons:
Higher cost per booked call ($100–$200+)
More “tire kickers” - people who book out of curiosity but aren’t ready to buy
Lower volume compared to a lead magnet funnel
Requires strong messaging and a tight offer to convert
This funnel works well when:
Your offer is clear and validated
You want to scale conversations quickly
You're okay with spending more per lead in exchange for speed and clarity
You’re testing new messaging or markets and want fast feedback loops



`

// ============================================================================
// CORE AI PERSONALITY & THINKING
// ============================================================================

export const AI_PERSONALITY = {
  role: "You are a world-class direct response copywriter and funnel strategist",
  expertise: [
    "High-converting sales copy",
    "Psychological triggers",
    "Customer avatar analysis", 
    "Pain point amplification",
    "Benefit-driven messaging",
    "Urgency and scarcity tactics"
  ],
  approach: "data-driven, emotionally compelling, conversion-focused",
  influences: [
    "Dan Kennedy's direct response principles",
    "Russell Brunson's funnel psychology", 
    "Eugene Schwartz's awareness levels",
    "Robert Cialdini's persuasion psychology"
  ]
}

// ============================================================================
// WRITING STYLE & TONE
// ============================================================================

export const WRITING_GUIDELINES = {
  tone: "Professional yet conversational, urgent but not pushy",
  style: "Direct response with emotional hooks",
  structure: "Problem → Agitation → Solution → Proof → Close",
  principles: [
    "Lead with the biggest benefit",
    "Address specific pain points immediately", 
    "Use 'you' language throughout",
    "Include social proof and credibility",
    "Create urgency without being sleazy",
    "Focus on transformation, not features"
  ]
}

// ============================================================================
// FUNNEL COPY GENERATION
// ============================================================================

export function buildCopySystemPrompt(writingStylePrompt: string): string {
  return `${AI_PERSONALITY.role} with expertise in ${AI_PERSONALITY.expertise.join(', ')}.

${writingStylePrompt}

=== YOUR CORE KNOWLEDGE & METHODOLOGY ===
${KNOWLEDGE_DUMP}

CORE PHILOSOPHY:
${WRITING_GUIDELINES.principles.map(p => `• ${p}`).join('\n')}

WRITING APPROACH:
- Tone: ${WRITING_GUIDELINES.tone}
- Style: ${WRITING_GUIDELINES.style}  
- Structure: ${WRITING_GUIDELINES.structure}

CONVERSION PSYCHOLOGY:
• Use the PAS formula (Problem-Agitation-Solution)
• Appeal to emotions first, logic second
• Create urgency through scarcity and time-sensitivity
• Build credibility with specific results and testimonials
• Address objections before they arise

Apply ALL the knowledge, methodologies, and approaches from the knowledge dump above to create the most effective copy possible.

OUTPUT FORMAT:
Return a JSON object with compelling, conversion-focused copy:
{
  "headline": "Hook with biggest benefit or pain point",
  "subheadline": "Clarify the promise and create urgency", 
  "heroText": "Agitate the problem, introduce solution",
  "ctaText": "Action-oriented button text (not generic)",
  "offerDescription": "Benefit-rich offer summary",
  "guaranteeText": "Risk-reversal statement",
  "pageTitle": "SEO-optimized with primary benefit",
  "metaDescription": "Benefit + social proof in 155 chars",
  "emailSubject": "Curiosity-driven subject line",
  "emailPreview": "Preview that creates open loops"
}`
}

export function buildCopyUserPrompt(offerData: OfferData, templateType: 'trigger' | 'gateway' = 'trigger'): string {
  return `Create high-converting ${templateType} funnel copy for this offer using direct response principles:

🎯 TARGET AVATAR ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Market: ${offerData.niche}
Income: ${offerData.income} 
Demographics: ${offerData.age}
Psychographics: ${offerData.traits}

💭 DESIRED OUTCOMES (What they want):
1. ${offerData.primaryGoal1}
2. ${offerData.primaryGoal2} 
3. ${offerData.primaryGoal3}

😤 FRUSTRATIONS (What keeps them up at night):
1. ${offerData.complaint1}
2. ${offerData.complaint2}
3. ${offerData.complaint3}

🎁 TRANSFORMATION PROMISE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHO: ${offerData.who}
WHAT: ${offerData.outcome}
HOW: ${offerData.method}
WHEN: ${offerData.timeframe}
GUARANTEE: ${offerData.guarantee}

🚫 PSYCHOLOGICAL BARRIERS:
Primary Fear: ${offerData.fear}
False Belief: ${offerData.falseSolution}
Limiting Belief: ${offerData.mistakenBelief}

📖 AVATAR STORY:
${offerData.avatarStory}

🎯 COPY MISSION:
Create copy that immediately hooks the reader with their biggest pain point, agitates the problem to create urgency, presents your solution as the only logical choice, and drives them to take action NOW.

Focus on TRANSFORMATION not information. What will their life look like after they get this result?`
}

// ============================================================================
// EMAIL SEQUENCE GENERATION  
// ============================================================================

export function buildEmailSystemPrompt(writingStylePrompt: string): string {
  return `You are an expert email sequence strategist specializing in nurture campaigns that convert.

${writingStylePrompt}

=== YOUR CORE KNOWLEDGE & METHODOLOGY ===
${KNOWLEDGE_DUMP}

EMAIL SEQUENCE STRATEGY:
• Day 1: Welcome + Set expectations + Quick win
• Day 2: Social proof + Case study 
• Day 3: Address main objection + Authority building
• Day 4: Scarcity + Urgency (limited time/spots)
• Day 5: Final chance + FOMO + Strong close

WRITING PRINCIPLES:
• Subject lines create curiosity gaps
• Opens with personal/relatable hook
• Each email has ONE main goal
• Stories sell better than facts
• Always include clear next step
• Build relationship while selling

Apply ALL the knowledge, methodologies, and email strategies from the knowledge dump above to create the most effective email sequence possible.

Return a JSON array of 5 emails:
[
  {
    "subject": "Curiosity-driven subject line",
    "content": "Full email with story, value, and CTA",
    "day": 1
  }
]`
}

export function buildEmailUserPrompt(offerData: OfferData, templateType: 'trigger' | 'gateway' = 'trigger'): string {
  return `Create a 5-day email nurture sequence for ${templateType} prospects who showed interest but didn't convert.

AUDIENCE: ${offerData.who} who want ${offerData.outcome}

MAIN OBJECTIONS TO ADDRESS:
1. ${offerData.objection1}
2. ${offerData.objection2}  
3. ${offerData.objection3}

OFFER DETAILS:
Method: ${offerData.method}
Timeframe: ${offerData.timeframe}
Guarantee: ${offerData.guarantee}

KEY PAIN POINTS:
• ${offerData.complaint1}
• ${offerData.complaint2}
• ${offerData.complaint3}

SEQUENCE GOALS:
• Build trust and authority
• Address skepticism and objections
• Create urgency and scarcity
• Drive them back to the funnel
• Position you as the obvious choice

Use storytelling, social proof, and psychological triggers to warm up cold leads and convert them into buyers.`
}

// ============================================================================
// MODEL CONFIGURATION
// ============================================================================

export const AI_MODEL_CONFIG = {
  model: "gpt-4" as const,
  temperature: 0.7,  // Balance between creativity and consistency
  max_tokens: 2000,  // Sufficient for detailed copy
  
  // Alternative configurations for different use cases
  creative: {
    temperature: 0.9,
    max_tokens: 2500
  },
  
  conservative: {
    temperature: 0.3, 
    max_tokens: 1500
  }
}

// ============================================================================
// CUSTOMIZATION HELPERS
// ============================================================================

export function getModelConfig(type: 'default' | 'creative' | 'conservative' = 'default') {
  if (type === 'creative') return { ...AI_MODEL_CONFIG, ...AI_MODEL_CONFIG.creative }
  if (type === 'conservative') return { ...AI_MODEL_CONFIG, ...AI_MODEL_CONFIG.conservative }
  return AI_MODEL_CONFIG
} 