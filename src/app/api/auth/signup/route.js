import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
// import prisma from '../../../../lib/prisma'

/**
 * POST /api/auth/signup
 * Créer un nouveau compte utilisateur
 */
export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 },
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Email invalide' }, { status: 400 })
    }

    // Validation mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 },
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un compte existe déjà avec cet email' },
        { status: 400 },
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashPassword: hashedPassword,
        role: 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Créer le profil associé
    await prisma.profil.create({
      data: {
        userId: user.id,
        status: 'private',
      },
    })

    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error)

    return NextResponse.json(
      {
        message: 'Erreur lors de la création du compte',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
