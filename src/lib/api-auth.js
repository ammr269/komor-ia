import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Vérifie et authentifie une clé API
 * @param {string} apiKey - La clé API à vérifier
 * @returns {Object} - { valid, user, apiKey, modele }
 */
export async function validateApiKey(apiKey) {
  try {
    if (!apiKey || !apiKey.startsWith('kmia_')) {
      return { valid: false, error: 'Clé API invalide ou manquante' }
    }

    // Récupérer la clé API avec les relations
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        modele: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    })

    if (!key) {
      return { valid: false, error: 'Clé API non trouvée' }
    }

    if (!key.isActive) {
      return { valid: false, error: 'Clé API désactivée' }
    }

    if (key.expiresAt && new Date() > key.expiresAt) {
      return { valid: false, error: 'Clé API expirée' }
    }

    return {
      valid: true,
      user: key.user,
      apiKey: key,
      modele: key.modele,
    }
  } catch (error) {
    console.error('Erreur validation API key:', error)
    return { valid: false, error: 'Erreur serveur' }
  }
}

/**
 * Middleware pour protéger les routes API
 * Usage dans une route:
 *
 * const auth = await authenticateApiRequest(req)
 * if (!auth.valid) {
 *   return NextResponse.json({ error: auth.error }, { status: 401 })
 * }
 */
export async function authenticateApiRequest(request) {
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!apiKey) {
    return { valid: false, error: 'Clé API manquante' }
  }

  return await validateApiKey(apiKey)
}
