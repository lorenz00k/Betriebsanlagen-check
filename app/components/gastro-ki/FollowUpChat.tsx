'use client'

import { useState, useRef, useEffect } from 'react'

interface FormData {
  businessType: string
  size: number
  district: string
  outdoorSeating: boolean
  openingHours: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AnalysisResult {
  answer: string;
  [key: string]: unknown;
}

interface FollowUpChatProps {
  initialContext: FormData
  previousAnalysis: AnalysisResult
  onBack: () => void
}

export function FollowUpChat({ initialContext, previousAnalysis, onBack }: FollowUpChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ich habe Ihre Anforderungen analysiert. Haben Sie noch weitere Fragen zu Ihrer Betriebsanlagengenehmigung?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const suggestedQuestions = [
    'Wie lange dauert das Genehmigungsverfahren?',
    'Welche Kosten kommen auf mich zu?',
    'Brauche ich einen Architekten oder Sachverständigen?',
    'Was passiert bei einer UVP-Prüfung?',
    'Welche Unterlagen brauche ich konkret?',
    'Wie ist der genaue Ablauf des Verfahrens?',
  ]

  const handleSend = async (questionText?: string) => {
    const question = questionText || input.trim()
    if (!question) return

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Build context for follow-up
      const userContext = {
        betriebsart: initialContext.businessType,
        groesse: `${initialContext.size}m²`,
        bezirk: initialContext.district,
        aussengastronomie: initialContext.outdoorSeating,
        oeffnungszeiten: initialContext.openingHours,
        previousAnalysis: previousAnalysis.answer, // Include previous answer for context
        // Add the user's question as natural language context for Claude
        userQuestion: question,
      }

      // For follow-up questions, we keep them as natural language since they're typically
      // specific questions that benefit from semantic search
      // But we could also extract keywords here if needed
      console.log('💬 Follow-up question:', { question, userContext })

      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          userContext,
        }),
      })

      if (!response.ok) {
        throw new Error('Anfrage fehlgeschlagen')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Keine Antwort erhalten')
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.answer,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[ERROR] Follow-up failed:', error)
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler')

      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: `Entschuldigung, ich konnte Ihre Frage nicht beantworten. Fehler: ${error instanceof Error ? error.message : 'Unbekannt'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Follow-up Chat</h2>
              <p className="text-gray-600">Stellen Sie weitere Fragen zu Ihrer Situation</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors border border-gray-200"
          >
            ← Zurück
          </button>
        </div>

        {/* Context Reminder */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
            {initialContext.businessType}
          </span>
          <span className="px-3 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
            {initialContext.size}m²
          </span>
          <span className="px-3 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
            {initialContext.district}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                } rounded-2xl p-4 shadow-md`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-white/30' : 'bg-black/10'}`}>
                    {msg.role === 'user' ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>
                  <span className="font-semibold text-sm">
                    {msg.role === 'user' ? 'Sie' : 'KI-Assistent'}
                  </span>
                  <span className="text-xs opacity-70 ml-auto">
                    {msg.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-slideUp">
              <div className="bg-gray-100 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-black/10">
                    <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="font-semibold text-sm text-gray-900">KI-Assistent</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-6 pb-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-6 pb-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 mb-3 font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Häufige Fragen:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(question)}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors border border-blue-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Stellen Sie Ihre Frage..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <span className="flex items-center gap-2">
                {isLoading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Drücken Sie Enter zum Senden</p>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Alle Antworten basieren auf aktuellen Gesetzen und Verordnungen</p>
      </div>
    </div>
  )
}
