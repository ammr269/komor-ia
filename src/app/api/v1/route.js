import { NextResponse } from 'next/server'

/**
 * GET /api/v1
 * Documentation de l'API
 */
export async function GET() {
  return NextResponse.json({
    name: 'Komor-IA API',
    version: '1.0.0',
    description: "API pour accéder aux modèles d'IA de Komor-IA",
    documentation: 'https://docs.komor-ia.com',

    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer YOUR_API_KEY',
      note: 'Obtenez votre clé API sur https://komor-ia.com/dashboard',
    },

    endpoints: [
      {
        path: '/api/v1/chat',
        method: 'POST',
        description: 'Chat conversationnel avec Wazir',
        model: 'Wazir',
      },
      {
        path: '/api/v1/summarize',
        method: 'POST',
        description: 'Résumé automatique de texte',
        model: 'Press-AI',
      },
      {
        path: '/api/v1/translate',
        method: 'POST',
        description: 'Traduction de texte',
        model: 'Translate-AI',
      },
      {
        path: '/api/v1/classify',
        method: 'POST',
        description: 'Classification de texte par catégorie',
        model: 'Press-AI',
      },
      {
        path: '/api/v1/complete',
        method: 'POST',
        description: 'Complétion de texte',
        model: 'Wazir',
      },
    ],

    example_request: {
      url: 'https://api.komor-ia.com/api/v1/chat',
      method: 'POST',
      headers: {
        Authorization: 'Bearer kmia_your_api_key_here',
        'Content-Type': 'application/json',
      },
      body: {
        prompt: 'Bonjour, comment ça va ?',
        max_tokens: 500,
      },
    },

    example_response: {
      success: true,
      response: 'Je suis Wazir, votre assistant IA...',
      usage: {
        total_tokens: 45,
        model: 'Wazir',
      },
    },

    rate_limits: {
      free: '1,000 requêtes/mois',
      pro: '10,000 requêtes/mois',
      enterprise: 'Illimité',
    },

    support: {
      email: 'support@komor-ia.com',
      docs: 'https://docs.komor-ia.com',
    },
  })
}
