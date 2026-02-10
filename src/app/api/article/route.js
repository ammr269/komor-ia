// import { PrismaClient } from '@/src/generated/prisma'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  // const prisma = new PrismaClient()
  const body = await req.json()
  const { contenu, resume, categorie } = body

  if (!contenu || !categorie) {
    return NextResponse.json(
      { message: 'Veuillez inclure tous les champs nécessaires' },
      { status: 400 },
    )
  }

  try {
    const article = await prisma.article.create({
      data: { contenu, resume, categorie },
    })
    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Erreur lors de l'ajout de l'article." },
      { status: 500 },
    )
  }
}
