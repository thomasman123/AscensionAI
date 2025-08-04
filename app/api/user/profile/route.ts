import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export interface UserOfferProfile {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  data: {
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
  }
}

// GET - Retrieve user profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    // Use a consistent UUID for the default user
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    
    const { data: profiles, error } = await supabaseAdmin
      .from('user_offer_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to retrieve profiles' }, { status: 500 })
    }

    // Transform database rows to match the interface
    const transformedProfiles = profiles?.map(profile => ({
      id: profile.id,
      name: profile.name,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      data: {
        niche: profile.niche,
        income: profile.income,
        age: profile.age,
        traits: profile.traits,
        primaryGoal1: profile.primary_goal_1,
        primaryGoal2: profile.primary_goal_2,
        primaryGoal3: profile.primary_goal_3,
        secondaryGoal1: profile.secondary_goal_1,
        secondaryGoal2: profile.secondary_goal_2,
        secondaryGoal3: profile.secondary_goal_3,
        complaint1: profile.complaint_1,
        complaint2: profile.complaint_2,
        complaint3: profile.complaint_3,
        fear: profile.fear,
        falseSolution: profile.false_solution,
        mistakenBelief: profile.mistaken_belief,
        objection1: profile.objection_1,
        objection2: profile.objection_2,
        objection3: profile.objection_3,
        expensiveAlternative1: profile.expensive_alternative_1,
        expensiveAlternative2: profile.expensive_alternative_2,
        expensiveAlternative3: profile.expensive_alternative_3,
        avatarStory: profile.avatar_story,
        who: profile.who,
        outcome: profile.outcome,
        method: profile.method,
        timeframe: profile.timeframe,
        guarantee: profile.guarantee,
        activationPoint1: profile.activation_point_1,
        activationPoint2: profile.activation_point_2,
        activationPoint3: profile.activation_point_3,
        activationPoint4: profile.activation_point_4,
        activationPoint5: profile.activation_point_5,
        mechanismPoint1: profile.mechanism_point_1,
        mechanismPoint2: profile.mechanism_point_2,
        mechanismPoint3: profile.mechanism_point_3,
        mechanismPoint4: profile.mechanism_point_4,
        mechanismPoint5: profile.mechanism_point_5,
      }
    })) || []

    return NextResponse.json({ profiles: transformedProfiles })
  } catch (error) {
    console.error('Error retrieving profiles:', error)
    return NextResponse.json({ error: 'Failed to retrieve profiles' }, { status: 500 })
  }
}

// POST - Save user profile
export async function POST(request: NextRequest) {
  try {
    const { userId, name, data } = await request.json()

    if (!userId || !name || !data) {
      return NextResponse.json({ error: 'User ID, name and data are required' }, { status: 400 })
    }

    // Transform the data to match database columns
    const dbData = {
      user_id: userId,
      name,
      niche: data.niche,
      income: data.income,
      age: data.age,
      traits: data.traits,
      primary_goal_1: data.primaryGoal1,
      primary_goal_2: data.primaryGoal2,
      primary_goal_3: data.primaryGoal3,
      secondary_goal_1: data.secondaryGoal1,
      secondary_goal_2: data.secondaryGoal2,
      secondary_goal_3: data.secondaryGoal3,
      complaint_1: data.complaint1,
      complaint_2: data.complaint2,
      complaint_3: data.complaint3,
      fear: data.fear,
      false_solution: data.falseSolution,
      mistaken_belief: data.mistakenBelief,
      objection_1: data.objection1,
      objection_2: data.objection2,
      objection_3: data.objection3,
      expensive_alternative_1: data.expensiveAlternative1,
      expensive_alternative_2: data.expensiveAlternative2,
      expensive_alternative_3: data.expensiveAlternative3,
      avatar_story: data.avatarStory,
      who: data.who,
      outcome: data.outcome,
      method: data.method,
      timeframe: data.timeframe,
      guarantee: data.guarantee,
      activation_point_1: data.activationPoint1,
      activation_point_2: data.activationPoint2,
      activation_point_3: data.activationPoint3,
      activation_point_4: data.activationPoint4,
      activation_point_5: data.activationPoint5,
      mechanism_point_1: data.mechanismPoint1,
      mechanism_point_2: data.mechanismPoint2,
      mechanism_point_3: data.mechanismPoint3,
      mechanism_point_4: data.mechanismPoint4,
      mechanism_point_5: data.mechanismPoint5,
    }

    const { data: profile, error } = await supabaseAdmin
      .from('user_offer_profiles')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }

    // Transform back to interface format
    const transformedProfile = {
      id: profile.id,
      name: profile.name,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      data
    }

    return NextResponse.json({ profile: transformedProfile })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const { userId, profileId, name, data } = await request.json()

    if (!userId || !profileId || !name || !data) {
      return NextResponse.json({ error: 'User ID, profile ID, name and data are required' }, { status: 400 })
    }

    // Transform the data to match database columns
    const dbData = {
      name,
      niche: data.niche,
      income: data.income,
      age: data.age,
      traits: data.traits,
      primary_goal_1: data.primaryGoal1,
      primary_goal_2: data.primaryGoal2,
      primary_goal_3: data.primaryGoal3,
      secondary_goal_1: data.secondaryGoal1,
      secondary_goal_2: data.secondaryGoal2,
      secondary_goal_3: data.secondaryGoal3,
      complaint_1: data.complaint1,
      complaint_2: data.complaint2,
      complaint_3: data.complaint3,
      fear: data.fear,
      false_solution: data.falseSolution,
      mistaken_belief: data.mistakenBelief,
      objection_1: data.objection1,
      objection_2: data.objection2,
      objection_3: data.objection3,
      expensive_alternative_1: data.expensiveAlternative1,
      expensive_alternative_2: data.expensiveAlternative2,
      expensive_alternative_3: data.expensiveAlternative3,
      avatar_story: data.avatarStory,
      who: data.who,
      outcome: data.outcome,
      method: data.method,
      timeframe: data.timeframe,
      guarantee: data.guarantee,
      activation_point_1: data.activationPoint1,
      activation_point_2: data.activationPoint2,
      activation_point_3: data.activationPoint3,
      activation_point_4: data.activationPoint4,
      activation_point_5: data.activationPoint5,
      mechanism_point_1: data.mechanismPoint1,
      mechanism_point_2: data.mechanismPoint2,
      mechanism_point_3: data.mechanismPoint3,
      mechanism_point_4: data.mechanismPoint4,
      mechanism_point_5: data.mechanismPoint5,
    }

    const { data: profile, error } = await supabaseAdmin
      .from('user_offer_profiles')
      .update(dbData)
      .eq('id', profileId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Transform back to interface format
    const transformedProfile = {
      id: profile.id,
      name: profile.name,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      data
    }

    return NextResponse.json({ profile: transformedProfile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

// DELETE - Delete user profile
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    const profileId = searchParams.get('profileId')

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('user_offer_profiles')
      .delete()
      .eq('id', profileId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting profile:', error)
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
} 