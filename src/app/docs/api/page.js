'use client'

import { useState } from 'react'
import { Code, Copy, Check, Terminal, Key, Zap } from 'lucide-react'

export default function ApiDocsPage() {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  //   const endpoints = [
  //     {
  //       method: 'POST',
  //       path: '/api/v1/chat',
  //       description: 'Générer une réponse conversationnelle',
  //       example: `curl -X POST https://komor-ia.vercel.app/api/v1/chat \\
  //   -H "Authorization: Bearer VOTRE_CLE_API" \\
  //   -H "Content-Type: application/json" \\
  //   -d '{
  //     "message": "Bonjour, comment allez-vous ?",
  //     "max_tokens": 500
  //   }'`,
  //     },
  //     {
  //       method: 'POST',
  //       path: '/api/v1/translate',
  //       description: 'Traduire un texte',
  //       example: `curl -X POST https://komor-ia.vercel.app/api/v1/translate \\
  //   -H "Authorization: Bearer VOTRE_CLE_API" \\
  //   -H "Content-Type: application/json" \\
  //   -d '{
  //     "text": "Hello world",
  //     "from": "en",
  //     "to": "fr"
  //   }'`,
  //     },
  //     {
  //       method: 'POST',
  //       path: '/api/v1/summarize',
  //       description: 'Résumer un texte',
  //       example: `curl -X POST https://komor-ia.vercel.app/api/v1/summarize \\
  //   -H "Authorization: Bearer VOTRE_CLE_API" \\
  //   -H "Content-Type: application/json" \\
  //   -d '{
  //     "text": "Votre long texte ici...",
  //     "max_length": 200
  //   }'`,
  //     },
  //   ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-3 mb-6">
            <Terminal className="w-8 h-8" />
            <h1 className="text-5xl font-bold">API Reference</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Documentation complète de l'API Komor-IA. Intégrez nos modèles IA en
            quelques lignes de code.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Démarrage rapide
            </h2>
          </div>

          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Obtenez votre clé API
                </h3>
                <p className="text-gray-600">
                  Connectez-vous à votre dashboard et générez une nouvelle clé
                  API
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Faites votre première requête
                </h3>
                <p className="text-gray-600">
                  Utilisez curl, fetch, ou votre librairie HTTP préférée
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Intégrez dans votre application
                </h3>
                <p className="text-gray-600">
                  Utilisez nos SDKs ou appelez directement l'API REST
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Endpoints */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Endpoints</h2>

        {/* <div className="space-y-8">
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-mono rounded">
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono text-gray-900">
                      {endpoint.path}
                    </code>
                  </div>
                </div>
                <p className="text-gray-600">{endpoint.description}</p>
              </div>

              <div className="bg-gray-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm font-mono">
                    Exemple de requête
                  </span>
                  <button
                    onClick={() => copyToClipboard(endpoint.example, index)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm">Copier</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  {endpoint.example}
                </pre>
              </div>
            </div>
          ))}
        </div> */}
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Zap className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-blue-100 mb-8">
            Créez votre compte gratuitement et obtenez votre clé API en quelques
            secondes
          </p>

          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Créer un compte gratuit
          </a>
        </div>
      </section>
    </div>
  )
}
