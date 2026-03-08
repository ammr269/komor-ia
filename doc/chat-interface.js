'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Copy } from 'lucide-react'
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
  const [waitingForCategory, setWaitingForCategory] = useState(false)
  const [typingText, setTypingText] = useState('')

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
      // const response = await fetch(
      //   'https://web-production-e2559.up.railway.app/classify-article',
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ text: currentInput }),
      //   }
      // )
      const response = await fetch('http://127.0.0.1:5000/classify-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentInput }),
      })

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

  const handleFeedback = async (messageId, feedback) => {
    if (!pendingArticle) return

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, showFeedbackButtons: false } : msg
      )
    )

    if (feedback === 'yes') {
      setShowSummaryInput(true)
      setManualCategory('')
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

  const handleManualCategorySubmit = async () => {
    if (!manualCategory.trim() || !pendingArticle) return

    setPendingArticle((prev) => ({
      ...prev,
      categorie: manualCategory.trim(),
    }))

    setWaitingForCategory(false)
    setShowSummaryInput(true)

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
          <MessageBubble
            key={message.id}
            message={message}
            handleFeedback={handleFeedback}
          />
        ))}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Buttons */}
      <div className="p-4 border-t border-gray-200">
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

// Composant séparé pour gérer copie + feedback
function MessageBubble({ message, handleFeedback }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Erreur lors de la copie', err)
    }
  }

  return (
    <div
      className={`flex items-start space-x-3 ${
        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
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
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900 relative">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>

        {/* Bouton copie */}
        <button
          onClick={handleCopy}
          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 flex items-center justify-center"
          title="Copier le texte"
        >
          <Copy className="w-4 h-4" />
        </button>

        {copied && (
          <span className="absolute top-1 right-8 text-xs text-green-600 font-medium">
            Copié !
          </span>
        )}

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
  )
}

// ------- Premiere version -----
// 'use client'

// import { useState, useEffect, useRef } from 'react'

// export default function ChatInterface() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Bienvenue ! Envoyez un article pour l'analyser avec nos modèles d'IA.",
//       sender: 'system',
//     },
//   ])
//   const [inputText, setInputText] = useState('')
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [showWarning, setShowWarning] = useState(false)
//   const [results, setResults] = useState([])

//   const messagesEndRef = useRef(null)

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages, results])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (inputText.trim().length < 200) {
//       setShowWarning(true)
//       setTimeout(() => setShowWarning(false), 3000)
//       return
//     }

//     setShowWarning(false)

//     const newUserMessage = {
//       id: Date.now(),
//       text: inputText,
//       sender: 'user',
//     }
//     setMessages((prev) => [...prev, newUserMessage])
//     setInputText('')
//     setIsAnalyzing(true)
//     setResults([])

//     // Message système "analyse en cours"
//     const analysisMessage = {
//       id: Date.now() + 1,
//       text: "🧠 Analyse de l'article en cours...",
//       sender: 'system',
//     }
//     setMessages((prev) => [...prev, analysisMessage])

//     try {
//       const response = await fetch('http://localhost:5000/classify-article', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: inputText }),
//       })

//       const data = await response.json()

//       if (data.error) {
//         setIsAnalyzing(false)
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now() + 2,
//             text: `Erreur : ${data.error}`,
//             sender: 'system',
//           },
//         ])
//         return
//       }

//       // Préparation des prédictions à afficher
//       const predictions = [
//         { model: 'Régression Logistique', prediction: data.prediction_lg },
//         { model: 'SVM', prediction: data.prediction_svm },
//         { model: 'Random Forest', prediction: data.prediction_rf },
//         { model: 'XGBoost', prediction: data.prediction_xgb },
//       ]

//       // Ajout message "Résultats"
//       const resultMessage = {
//         id: Date.now() + 3,
//         text: "Résultats de l'analyse :",
//         sender: 'system',
//       }
//       setMessages((prev) => [...prev, resultMessage])

//       // Affiche les résultats un par un avec délai (effet "streaming")
//       predictions.forEach((pred, index) => {
//         setTimeout(() => {
//           setResults((prev) => [...prev, pred])
//           if (index === predictions.length - 1) {
//             setIsAnalyzing(false)
//           }
//         }, 500 * (index + 1))
//       })
//     } catch (err) {
//       setIsAnalyzing(false)
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 4,
//           text: 'Erreur lors de la requête au serveur.',
//           sender: 'system',
//         },
//       ])
//     }
//   }

//   return (
//     <div className="flex flex-col h-full max-w-4xl mx-auto">
//       <div className="text-2xl font-bold mb-6 text-gray-800">
//         🔮 K-MIA - Analyse d'Articles
//       </div>

//       <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`mb-4 animate-fade-in ${
//               message.sender === 'user'
//                 ? 'bg-blue-50 ml-10 rounded-lg p-3 border border-blue-100'
//                 : 'bg-gray-50 mr-10 rounded-lg p-3 border border-gray-100'
//             }`}
//           >
//             <div className="text-gray-800">{message.text}</div>
//           </div>
//         ))}

//         {results.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden animate-fade-in">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Modèle
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Catégorie
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Confiance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {results.map((result, index) => {
//                   // Ta prédiction est supposée format "Catégorie|pourcentage"
//                   const [category, confidence] = (
//                     result.prediction || ''
//                   ).split('|')
//                   return (
//                     <tr
//                       key={index}
//                       className="border-b border-gray-100 hover:bg-gray-50 animate-slide-in"
//                     >
//                       <td className="px-4 py-3 text-gray-800">
//                         {result.model}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800">
//                         {category?.trim()}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800 font-medium">
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           {confidence ? confidence.trim() : '-'}
//                         </span>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {isAnalyzing && (
//           <div className="text-gray-500 italic mb-4">
//             🧠 Analyse de l'article en cours...
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {showWarning && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
//           <div className="text-red-800 text-sm flex items-center">
//             <span className="mr-2">⚠️</span>
//             Le texte doit contenir au moins 200 caractères pour être analysé.
//             <span className="ml-2 text-xs text-red-600">
//               ({inputText.length}/200)
//             </span>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="flex gap-3">
//         <div className="flex-1 relative">
//           <input
//             type="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             placeholder="Entrez votre article ici (minimum 200 caractères)..."
//             disabled={isAnalyzing}
//             className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//           />
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
//             {inputText.length}/200
//           </div>
//         </div>
//         <button
//           type="submit"
//           disabled={isAnalyzing || inputText.length < 200}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
//         >
//           {isAnalyzing ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Analyse...
//             </>
//           ) : (
//             'Envoyer'
//           )}
//         </button>
//       </form>

//       {/* Animations CSS */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-in-out both;
//         }
//         @keyframes slideIn {
//           from {
//             transform: translateX(-20px);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slideIn 0.4s ease-out both;
//         }
//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }
//         .animate-shake {
//           animation: shake 0.3s ease-in-out both;
//         }
//       `}</style>
//     </div>
//   )
// }

// ----- Deuxieme verion -----
// 'use client'

// import { useState, useEffect, useRef } from 'react'

// export default function ChatInterface() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Bienvenue ! Envoyez un article pour l'analyser avec nos modèles d'IA.",
//       sender: 'system',
//     },
//   ])
//   const [inputText, setInputText] = useState('')
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [showWarning, setShowWarning] = useState(false)
//   const [results, setResults] = useState([])

//   const messagesEndRef = useRef(null)

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // Mock analysis results
//   const mockResults = [
//     { model: 'Random Forest', category: 'Politique', confidence: 0.87 },
//     { model: 'SVM', category: 'Économie', confidence: 0.76 },
//     { model: 'Régression Logistique', category: 'Politique', confidence: 0.82 },
//     { model: 'XGBoost', category: 'Politique', confidence: 0.91 },
//   ]

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     if (inputText.trim().length < 200) {
//       setShowWarning(true)
//       setTimeout(() => setShowWarning(false), 3000)
//       return
//     }

//     setShowWarning(false)

//     // Add user message
//     const newUserMessage = {
//       id: Date.now(),
//       text: inputText,
//       sender: 'user',
//     }

//     setMessages((prev) => [...prev, newUserMessage])
//     setInputText('')

//     // Start analysis
//     setIsAnalyzing(true)
//     const analysisMessage = {
//       id: Date.now() + 1,
//       text: "🧠 Analyse de l'article en cours...",
//       sender: 'system',
//     }

//     setMessages((prev) => [...prev, analysisMessage])

//     // Simulate analysis completion after 3 seconds
//     setTimeout(() => {
//       setIsAnalyzing(false)
//       setResults([])

//       // Add result message
//       const resultMessage = {
//         id: Date.now() + 2,
//         text: "Résultats de l'analyse :",
//         sender: 'system',
//       }

//       setMessages((prev) => [...prev, resultMessage])

//       // Display results one by one with delay
//       mockResults.forEach((result, index) => {
//         setTimeout(() => {
//           setResults((prev) => [...prev, result])
//         }, 500 * (index + 1))
//       })
//     }, 3000)
//   }

//   return (
//     <div className="flex flex-col h-full max-w-4xl mx-auto">
//       <div className="text-2xl font-bold mb-6 text-gray-800">
//         🔮 K-MIA - Analyse d'Articles
//       </div>

//       {/* Messages area */}
//       <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`mb-4 animate-fade-in ${
//               message.sender === 'user'
//                 ? 'bg-blue-50 ml-10 rounded-lg p-3 border border-blue-100'
//                 : 'bg-gray-50 mr-10 rounded-lg p-3 border border-gray-100'
//             }`}
//           >
//             <div className="text-gray-800">{message.text}</div>
//           </div>
//         ))}

//         {/* Results table */}
//         {results.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden animate-fade-in">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Modèle
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Catégorie
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Confiance
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {results.map((result, index) => (
//                   <tr
//                     key={index}
//                     className="border-b border-gray-100 hover:bg-gray-50 animate-slide-in"
//                   >
//                     <td className="px-4 py-3 text-gray-800">{result.model}</td>
//                     <td className="px-4 py-3 text-gray-800">
//                       {result.category}
//                     </td>
//                     <td className="px-4 py-3 text-gray-800 font-medium">
//                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         {(result.confidence * 100).toFixed(1)}%
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Warning message */}
//       {showWarning && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
//           <div className="text-red-800 text-sm flex items-center">
//             <span className="mr-2">⚠️</span>
//             Le texte doit contenir au moins 200 caractères pour être analysé.
//             <span className="ml-2 text-xs text-red-600">
//               ({inputText.length}/200)
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Input area */}
//       <form onSubmit={handleSubmit} className="flex gap-3">
//         <div className="flex-1 relative">
//           <input
//             type="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             placeholder="Entrez votre article ici (minimum 200 caractères)..."
//             disabled={isAnalyzing}
//             className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//           />
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
//             {inputText.length}/200
//           </div>
//         </div>
//         <button
//           type="submit"
//           disabled={isAnalyzing || inputText.length < 200}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
//         >
//           {isAnalyzing ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Analyse...
//             </>
//           ) : (
//             'Envoyer'
//           )}
//         </button>
//       </form>
//     </div>
//   )
// }

// ---- Troisieme version ------

// 'use client'

// import { useState, useEffect, useRef } from 'react'

// export default function ChatInterface() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Bienvenue ! Envoyez un article pour l'analyser avec nos modèles d'IA.",
//       sender: 'system',
//     },
//   ])
//   const [inputText, setInputText] = useState('')
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [showWarning, setShowWarning] = useState(false)
//   const [results, setResults] = useState([])
//   const [typingText, setTypingText] = useState('')

//   const messagesEndRef = useRef(null)

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages, results, typingText])

//   const typeMessage = async (text, delay = 50) => {
//     setTypingText('')
//     for (let i = 0; i <= text.length; i++) {
//       await new Promise((res) => setTimeout(res, delay))
//       setTypingText(text.slice(0, i))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (inputText.trim().length < 200) {
//       setShowWarning(true)
//       setTimeout(() => setShowWarning(false), 3000)
//       return
//     }

//     setShowWarning(false)

//     const newUserMessage = {
//       id: Date.now(),
//       text: inputText,
//       sender: 'user',
//     }
//     setMessages((prev) => [...prev, newUserMessage])
//     setInputText('')
//     setIsAnalyzing(true)
//     setResults([])
//     setTypingText('')

//     // ⏳ Attente de 3 secondes
//     await new Promise((res) => setTimeout(res, 1000))

//     // 💬 Animation lettre par lettre du message système
//     const animatedText = "🧠 Analyse de l'article en cours..."
//     await typeMessage(animatedText)

//     // Envoie la requête une fois le texte animé fini
//     try {
//       const response = await fetch('http://localhost:5000/classify-article', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: inputText }),
//       })

//       const data = await response.json()

//       if (data.error) {
//         setIsAnalyzing(false)
//         setTypingText('')
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now() + 2,
//             text: `Erreur : ${data.error}`,
//             sender: 'system',
//           },
//         ])
//         return
//       }

//       const analysisDone = {
//         id: Date.now() + 3,
//         text: animatedText,
//         sender: 'system',
//       }
//       setMessages((prev) => [...prev, analysisDone])
//       setTypingText('')

//       const predictions = [
//         { model: 'Régression Logistique', prediction: data.prediction_lg },
//         { model: 'SVM', prediction: data.prediction_svm },
//         { model: 'Random Forest', prediction: data.prediction_rf },
//         { model: 'XGBoost', prediction: data.prediction_xgb },
//       ]

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 4,
//           text: "Résultats de l'analyse :",
//           sender: 'system',
//         },
//       ])

//       predictions.forEach((pred, index) => {
//         setTimeout(() => {
//           setResults((prev) => [...prev, pred])
//           if (index === predictions.length - 1) {
//             setIsAnalyzing(false)
//           }
//         }, 500 * (index + 1))
//       })
//     } catch (err) {
//       setIsAnalyzing(false)
//       setTypingText('')
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now() + 4,
//           text: 'Erreur lors de la requête au serveur.',
//           sender: 'system',
//         },
//       ])
//     }
//   }

//   return (
//     <div className="flex flex-col h-full max-w-4xl mx-auto">
//       <div className="text-2xl font-bold mb-6 text-gray-800">
//         🔮 K-MIA - Analyse d'Articles
//       </div>

//       <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`mb-4 animate-fade-in ${
//               message.sender === 'user'
//                 ? 'bg-blue-50 ml-10 rounded-lg p-3 border border-blue-100'
//                 : 'bg-gray-50 mr-10 rounded-lg p-3 border border-gray-100'
//             }`}
//           >
//             <div className="text-gray-800">{message.text}</div>
//           </div>
//         ))}

//         {typingText && (
//           <div className="mb-4 text-gray-500 italic animate-fade-in">
//             {typingText}
//           </div>
//         )}

//         {results.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden animate-fade-in">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Modèle
//                   </th>
//                   <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Catégorie
//                   </th>
//                   {/* <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
//                     Confiance
//                   </th> */}
//                 </tr>
//               </thead>

//               <tbody>
//                 {results.map((result, index) => {
//                   const [category, confidence] = (
//                     result.prediction || ''
//                   ).split('|')
//                   return (
//                     <tr
//                       key={index}
//                       className="border-b border-gray-100 hover:bg-gray-50 animate-slide-in"
//                     >
//                       <td className="px-4 py-3 text-gray-800">
//                         {result.model}
//                       </td>
//                       <td className="px-4 py-3 text-gray-800">
//                         {category?.trim()}
//                       </td>
//                       {/* <td className="px-4 py-3 text-gray-800 font-medium">
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           {confidence ? confidence.trim() : '-'}
//                         </span>
//                       </td> */}
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {showWarning && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
//           <div className="text-red-800 text-sm flex items-center">
//             <span className="mr-2">⚠️</span>
//             Le texte doit contenir au moins 200 caractères pour être analysé.
//             <span className="ml-2 text-xs text-red-600">
//               ({inputText.length}/200)
//             </span>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="flex gap-3">
//         <div className="flex-1 relative">
//           <input
//             type="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             placeholder="Entrez votre article ici (minimum 200 caractères)..."
//             disabled={isAnalyzing}
//             className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//           />
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
//             {inputText.length}/200
//           </div>
//         </div>
//         <button
//           type="submit"
//           disabled={isAnalyzing || inputText.length < 200}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
//         >
//           {isAnalyzing ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Analyse...
//             </>
//           ) : (
//             'Envoyer'
//           )}
//         </button>
//       </form>

//       {/* Animations CSS */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-in-out both;
//         }
//         @keyframes slideIn {
//           from {
//             transform: translateX(-20px);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slideIn 0.4s ease-out both;
//         }
//         @keyframes shake {
//           0%,
//           100% {
//             transform: translateX(0);
//           }
//           25% {
//             transform: translateX(-5px);
//           }
//           75% {
//             transform: translateX(5px);
//           }
//         }
//         .animate-shake {
//           animation: shake 0.3s ease-in-out both;
//         }
//       `}</style>
//     </div>
//   )
// }

// ----- Qurtieme version ----
