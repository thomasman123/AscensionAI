'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard-nav'
import { openaiService, WritingStyleExample } from '@/lib/openai-service'
import { Plus, Trash2, BookOpen, Lightbulb, Target, Mail, Type } from 'lucide-react'

const EXAMPLE_TYPES = [
  { value: 'headline', label: 'Headlines', icon: Type, color: 'bg-blue-500' },
  { value: 'subheading', label: 'Subheadings', icon: Target, color: 'bg-green-500' },
  { value: 'cta', label: 'Call to Actions', icon: Lightbulb, color: 'bg-yellow-500' },
  { value: 'body', label: 'Body Copy', icon: BookOpen, color: 'bg-purple-500' },
  { value: 'email', label: 'Email Copy', icon: Mail, color: 'bg-red-500' }
] as const

export default function TrainingPage() {
  const [examples, setExamples] = useState<WritingStyleExample[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newExample, setNewExample] = useState({
    title: '',
    content: '',
    type: 'headline' as WritingStyleExample['type']
  })

  useEffect(() => {
    const loadExamples = async () => {
      const writingExamples = await openaiService.getWritingExamples()
      setExamples(writingExamples)
    }
    loadExamples()
  }, [])

  const handleAddExample = async () => {
    if (!newExample.title.trim() || !newExample.content.trim()) return

    const example = await openaiService.addWritingExample(newExample)
    setExamples([...examples, example])
    setNewExample({ title: '', content: '', type: 'headline' })
    setIsAdding(false)
  }

  const handleRemoveExample = (id: string) => {
    openaiService.removeWritingExample(id)
    setExamples(examples.filter(example => example.id !== id))
  }

  const getTypeConfig = (type: WritingStyleExample['type']) => {
    return EXAMPLE_TYPES.find(t => t.value === type) || EXAMPLE_TYPES[0]
  }

  const examplesByType = examples.reduce((acc, example) => {
    if (!acc[example.type]) acc[example.type] = []
    acc[example.type].push(example)
    return acc
  }, {} as Record<WritingStyleExample['type'], WritingStyleExample[]>)

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                AI Writing Style Training
              </h1>
              <p className="text-lg text-tier-300">
                Upload examples of your writing style to fine-tune AI copy generation to match your voice and tone.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-5 mb-8">
              {EXAMPLE_TYPES.map((type) => {
                const count = examplesByType[type.value]?.length || 0
                const Icon = type.icon
                return (
                  <Card key={type.value} className="bg-tier-900 border-tier-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-tier-50">{count}</div>
                          <div className="text-xs text-tier-400">{type.label}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Add New Example */}
            <Card className="bg-tier-900 border-tier-800 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-tier-50">
                  Add Writing Example
                  {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-accent-500 hover:bg-accent-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Example
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              {isAdding && (
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-tier-200">
                        Title/Description
                      </label>
                      <Input
                        placeholder="e.g., High-converting headline for weight loss"
                        value={newExample.title}
                        onChange={(e) => setNewExample({ ...newExample, title: e.target.value })}
                        className="bg-tier-800 border-tier-700 text-tier-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-tier-200">
                        Type
                      </label>
                      <select
                        value={newExample.type}
                        onChange={(e) => setNewExample({ ...newExample, type: e.target.value as WritingStyleExample['type'] })}
                        className="w-full px-3 py-2 bg-tier-800 border border-tier-700 text-tier-50 rounded-md"
                      >
                        {EXAMPLE_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-tier-200">
                      Content
                    </label>
                    <Textarea
                      placeholder="Paste your example copy here..."
                      value={newExample.content}
                      onChange={(e) => setNewExample({ ...newExample, content: e.target.value })}
                      className="min-h-[120px] bg-tier-800 border-tier-700 text-tier-50 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleAddExample} className="bg-accent-500 hover:bg-accent-600">
                      Save Example
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAdding(false)}
                      className="border-tier-600 text-tier-300 hover:border-tier-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Examples by Type */}
            <div className="space-y-8">
              {EXAMPLE_TYPES.map((type) => {
                const typeExamples = examplesByType[type.value] || []
                const Icon = type.icon

                return (
                  <Card key={type.value} className="bg-tier-900 border-tier-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-tier-50">
                        <div className={`w-8 h-8 ${type.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        {type.label}
                        <Badge variant="outline" className="ml-auto">
                          {typeExamples.length} examples
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {typeExamples.length === 0 ? (
                        <div className="text-center py-8 text-tier-400">
                          No {type.label.toLowerCase()} examples yet. Add some to improve AI copy generation for this type.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {typeExamples.map((example) => (
                            <div key={example.id} className="p-4 bg-tier-800 rounded-lg border border-tier-700">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-tier-200">{example.title}</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveExample(example.id)}
                                  className="text-tier-400 hover:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-tier-300 text-sm leading-relaxed">
                                {example.content}
                              </p>
                              <div className="text-xs text-tier-500 mt-2">
                                Added {new Date(example.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Tips */}
            <Card className="bg-tier-900/50 border-tier-800 mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-tier-50 mb-4">💡 Tips for Better Training</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 text-sm text-tier-300">
                    <div>
                      <strong className="text-tier-200">Quality over Quantity:</strong> 5-10 high-quality examples per type work better than 50 mediocre ones.
                    </div>
                    <div>
                      <strong className="text-tier-200">Variety:</strong> Include examples from different industries and contexts within each type.
                    </div>
                    <div>
                      <strong className="text-tier-200">High-Performers:</strong> Focus on copy that has actually converted well for you.
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-tier-300">
                    <div>
                      <strong className="text-tier-200">Be Specific:</strong> Include context about why each example works well.
                    </div>
                    <div>
                      <strong className="text-tier-200">Regular Updates:</strong> Keep adding new examples as your style evolves.
                    </div>
                    <div>
                      <strong className="text-tier-200">Test Results:</strong> Monitor how AI-generated copy performs and adjust examples accordingly.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 