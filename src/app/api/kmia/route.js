import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // const startups = await prisma.kMIA.findMany() // <-- KMIA avec K majuscule
    const startups = await prisma.kMIA.findMany()
    console.log('notre startup', startups)
    return NextResponse.json({ startups })
  } catch (error) {
    console.error('Erreur lors de la récupération des startups KMIA :', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
