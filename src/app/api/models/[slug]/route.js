import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req, { params }) {
  try {
    const { slug } = await params

    const model = await prisma.modele.findUnique({
      where: { slug },
    })

    if (!model) {
      return NextResponse.json(
        { success: false, message: 'Modèle non trouvé' },
        { status: 404 },
      )
    }

    // Ne retourner que les modèles publics
    if (!model.isPublic) {
      return NextResponse.json(
        { success: false, message: 'Modèle non disponible' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      model: model,
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 },
    )
  }
}
