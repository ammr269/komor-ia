'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function SummaryChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '👋 Salut ! Donne-moi ton article pour te fournir un résumé.',
      sender: 'system',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState('')

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, typingText])

  const typeMessage = async (text, delay = 30) => {
    setTypingText('')
    for (let i = 0; i <= text.length; i++) {
      await new Promise((res) => setTimeout(res, delay))
      setTypingText(text.slice(0, i))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedText = inputText.trim()
    if (!trimmedText) return

    const newUserMessage = {
      id: Date.now(),
      text: trimmedText,
      sender: 'user',
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // 🔹 Changer l'URL vers notre API Flask /summarize
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmedText }),
      })

      if (!response.ok) {
        throw new Error('Erreur réseau ou serveur')
      }

      const data = await response.json()
      const summary =
        data.summary || '🤖 Désolé, impossible de générer le résumé.'

      await typeMessage(summary)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: summary,
          sender: 'system',
        },
      ])
    } catch (error) {
      const errorMsg = `⚠️ Erreur : ${error.message}`
      await typeMessage(errorMsg)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: errorMsg,
          sender: 'system',
        },
      ])
    } finally {
      setTypingText('')
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <Link href="/">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Press-IA</h3>
              <p className="text-sm text-gray-500">
                Assistant de génération de résumé
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user'
                ? 'flex-row-reverse space-x-reverse'
                : ''
            }`}
          >
            <div className="flex-shrink-0">
              {message.sender === 'user' ? (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900 whitespace-pre-wrap">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {typingText && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500 italic">
              {typingText}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 flex space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Colle ton article ici..."
          disabled={isTyping}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isTyping || !inputText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
