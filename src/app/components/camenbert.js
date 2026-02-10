// 'use client'

// import { useState, useEffect, useRef } from 'react'

// export default function Camembert() {
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
//       const response = await fetch('http://localhost:5000/summarize', {
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

'use client'

import { useState, useEffect, useRef } from 'react'

export default function ResumeurArticle() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bienvenue ! Envoyez un article et nous vous fournirons un résumé généré par l'IA.",
      sender: 'system',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [summary, setSummary] = useState('')
  const [typingText, setTypingText] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingText, summary])

  const typeMessage = async (text, delay = 50) => {
    setTypingText('')
    for (let i = 0; i <= text.length; i++) {
      await new Promise((res) => setTimeout(res, delay))
      setTypingText(text.slice(0, i))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (inputText.trim().length < 200) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }

    setShowWarning(false)
    const newUserMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputText('')
    setIsAnalyzing(true)
    setSummary('')
    setTypingText('')

    await typeMessage('🧠 Génération du résumé en cours...')

    try {
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()

      if (data.error) {
        setIsAnalyzing(false)
        setTypingText('')
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            text: `Erreur : ${data.error}`,
            sender: 'system',
          },
        ])
        return
      }

      const resumeMsg = {
        id: Date.now() + 3,
        text: '📄 Résumé généré :',
        sender: 'system',
      }

      setMessages((prev) => [...prev, resumeMsg])
      setSummary(data.resume)
      setIsAnalyzing(false)
      setTypingText('')
    } catch (err) {
      setIsAnalyzing(false)
      setTypingText('')
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 4,
          text: '❌ Erreur lors de la requête au serveur.',
          sender: 'system',
        },
      ])
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="text-2xl font-bold mb-6 text-gray-800">
        🧠 Résumé d’Articles – K-MIA
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 animate-fade-in ${
              message.sender === 'user'
                ? 'bg-blue-50 ml-10 rounded-lg p-3 border border-blue-100'
                : 'bg-gray-50 mr-10 rounded-lg p-3 border border-gray-100'
            }`}
          >
            <div className="text-gray-800">{message.text}</div>
          </div>
        ))}

        {typingText && (
          <div className="mb-4 text-gray-500 italic animate-fade-in">
            {typingText}
          </div>
        )}

        {summary && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm animate-slide-in mt-4">
            <div className="text-gray-700 text-sm">
              <strong>Résumé :</strong> {summary}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showWarning && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
          <div className="text-red-800 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            Le texte doit contenir au moins 200 caractères pour être résumé.
            <span className="ml-2 text-xs text-red-600">
              ({inputText.length}/200)
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Collez ici votre article (minimum 200 caractères)..."
            disabled={isAnalyzing}
            className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {inputText.length}/200
          </div>
        </div>
        <button
          type="submit"
          disabled={isAnalyzing || inputText.length < 200}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Résumé...
            </>
          ) : (
            'Envoyer'
          )}
        </button>
      </form>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out both;
        }
        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out both;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out both;
        }
      `}</style>
    </div>
  )
}
