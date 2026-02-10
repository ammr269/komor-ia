import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

/**
 * Génère une clé API unique et sécurisée
 */
function generateApiKey() {
  const prefix = 'kmia_' // Komor-IA prefix
  const randomBytes = crypto.randomBytes(24).toString('hex')
  return `${prefix}${randomBytes}`
}

/**
 * GET /api/user/api-keys
 * Récupère les clés API de l'utilisateur connecté
 */
export async function GET(req) {
  try {
    // TODO: Récupérer l'ID de l'utilisateur depuis la session
    // Pour l'instant, on utilise un userId fixe pour les tests
    const userId = 1

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId,
      },
      include: {
        modele: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      keys: apiKeys,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des clés API:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des clés API.',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/user/api-keys
 * Crée une nouvelle clé API pour l'utilisateur
 */
export async function POST(req) {
  try {
    const body = await req.json()
    const { name, modeleId, rateLimit = 1000 } = body

    // TODO: Récupérer l'ID de l'utilisateur depuis la session
    const userId = 1

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Le nom de la clé est requis.',
        },
        { status: 400 },
      )
    }

    // Générer une clé unique
    let apiKey
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      apiKey = generateApiKey()
      const existing = await prisma.apiKey.findUnique({
        where: { key: apiKey },
      })
      if (!existing) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return NextResponse.json(
        {
          success: false,
          message: 'Impossible de générer une clé unique. Veuillez réessayer.',
        },
        { status: 500 },
      )
    }

    // Créer la clé API
    const newApiKey = await prisma.apiKey.create({
      data: {
        key: apiKey,
        name: name.trim(),
        userId,
        modeleId: modeleId || null,
        rateLimit,
      },
      include: {
        modele: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        key: apiKey, // On renvoie la clé en clair UNE SEULE FOIS
        apiKey: newApiKey, // Les détails de la clé
        message: 'Clé API créée avec succès.',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Erreur lors de la création de la clé API:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la création de la clé API.',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/user/api-keys/[id]
 * Supprime une clé API
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = params
    const userId = 1 // TODO: Récupérer depuis la session

    // Vérifier que la clé appartient à l'utilisateur
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    })

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: 'Clé API non trouvée.',
        },
        { status: 404 },
      )
    }

    // Supprimer la clé
    await prisma.apiKey.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Clé API supprimée avec succès.',
    })
  } catch (error) {
    console.error('Erreur lors de la suppression de la clé API:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la suppression de la clé API.',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
