'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Salut! Je suis Press-AI, ton assistant. Envoie moi ton article pour l'analyser",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingArticle, setPendingArticle] = useState(null)
  const [manualCategory, setManualCategory] = useState('')
  const [summaryInput, setSummaryInput] = useState('')
  const [showSummaryInput, setShowSummaryInput] = useState(false)
  const [waitingForCategory, setWaitingForCategory] = useState(false) // Nouvel état
  const [typingText, setTypingText] = useState('')

  // Scroll auto
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingText])

  const typeMessage = async (text, delay = 30) => {
    setTypingText('')
    for (let i = 0; i <= text.length; i++) {
      await new Promise((res) => setTimeout(res, delay))
      setTypingText(text.slice(0, i))
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const currentInput = inputValue
    setInputValue('')

    const userMessage = {
      id: Date.now(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(
        'https://web-production-e2559.up.railway.app/classify-article',
        // 'https://article-svm-api-production-ce29.up.railway.app/classify-article',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentInput }),
        }
      )

      const data = await response.json()

      let replyText = '❌ Erreur lors de la classification.'
      let showFeedback = false
      let predictedCategory = ''

      if (data.prediction_svm) {
        const [category] = data.prediction_svm.split('|')
        predictedCategory = category.trim()
        replyText = `📂 Cet article appartient à la rubrique : **${predictedCategory}**.\n\nEst-ce correct ?`
        showFeedback = true

        setPendingArticle({
          contenu: currentInput,
          categorie: predictedCategory,
          resume: '',
        })
      } else if (data.error) {
        replyText = `⚠️ Erreur : ${data.error}`
      }

      await typeMessage(replyText)
      setTypingText('')

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: replyText,
          sender: 'bot',
          timestamp: new Date(),
          showFeedbackButtons: showFeedback,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          content: "🚫 Une erreur est survenue lors de l'analyse.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Gestion des réponses Oui / Non à "Est-ce correct ?"
  const handleFeedback = async (messageId, feedback) => {
    if (!pendingArticle) return

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, showFeedbackButtons: false } : msg
      )
    )

    if (feedback === 'yes') {
      // On propose directement le résumé optionnel
      setShowSummaryInput(true)
      setManualCategory('') // reset au cas où
      setWaitingForCategory(false)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content:
            '📝 Souhaitez-vous ajouter un résumé ? Sinon, cliquez simplement sur "Soumettre".',
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    } else {
      // L'utilisateur doit saisir la bonne catégorie d'abord
      setShowSummaryInput(false)
      setWaitingForCategory(true)
      setManualCategory('')

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content:
            '❓ Quelle est la bonne catégorie ? Veuillez la saisir ci-dessous puis cliquez sur "Envoyer".',
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    }
  }

  // Envoi de la catégorie corrigée par l'utilisateur
  const handleManualCategorySubmit = async () => {
    if (!manualCategory.trim() || !pendingArticle) return

    // On met à jour la catégorie de pendingArticle
    setPendingArticle((prev) => ({
      ...prev,
      categorie: manualCategory.trim(),
    }))

    setWaitingForCategory(false)
    setShowSummaryInput(true) // Ensuite, on affiche le résumé

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content:
          '📝 Souhaitez-vous ajouter un résumé ? Sinon, cliquez simplement sur "Soumettre".',
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
  }

  // Soumission du résumé et stockage final
  const handleSummarySubmit = async () => {
    if (!pendingArticle) return

    const articleToSend = {
      ...pendingArticle,
      resume: summaryInput.trim(),
    }

    try {
      const res = await fetch('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleToSend),
      })

      const result = await res.json()
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: summaryInput
              ? "✅ Merci ! L'article et son résumé ont été ajoutés. N'hésitez pas à me donner d'autres articles à analyser."
              : "✅ Merci ! L'article a été ajouté. N'hésitez pas à me donner d'autres articles à analyser.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ])
        setSummaryInput('')
        setShowSummaryInput(false)
        setPendingArticle(null)
        setManualCategory('')
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: '❌ Erreur lors de l’ajout de l’article.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    }
  }

  // Gestion de la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showSummaryInput) {
        handleSummarySubmit()
      } else if (waitingForCategory) {
        handleManualCategorySubmit()
      } else {
        handleSendMessage()
      }
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat Header */}
      <Link href="/">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Press-AI Chat
              </h3>
              <p className="text-sm text-gray-500">AI Assistant</p>
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
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>

              {message.showFeedbackButtons && (
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleFeedback(message.id, 'yes')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Oui
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, 'no')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Non
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing */}
        {typingText && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500 italic">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typingText}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Ancre scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Buttons selon contexte */}
      <div className="p-4 border-t border-gray-200">
        {/* Saisie catégorie manuelle */}
        {waitingForCategory && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={manualCategory}
              onChange={(e) => setManualCategory(e.target.value)}
              placeholder="Entrez la bonne catégorie"
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleManualCategorySubmit}
              disabled={isLoading || !manualCategory.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        )}

        {/* Saisie résumé */}
        {showSummaryInput && !waitingForCategory && (
          <div className="flex space-x-2">
            <textarea
              rows={2}
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              placeholder="Résumé (facultatif)"
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSummarySubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Soumettre
            </button>
          </div>
        )}

        {/* Saisie d'article initial */}
        {!showSummaryInput && !waitingForCategory && (
          <div className="flex space-x-2">
            <textarea
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre article ici..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
