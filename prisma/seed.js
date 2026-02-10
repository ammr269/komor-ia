const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Press-AI
  await prisma.modele.upsert({
    where: { slug: 'press-ai' },
    update: {},
    create: {
      name: 'Press-AI',
      slug: 'press-ai',
      description: "Chatbot intelligent pour l'analyse d'articles de presse",
      domaine: 'NLP',
      version: '1.0.0',
      status: 'production',
      icon: 'MessageSquare',
      color: 'blue',
      isPublic: true,
      features: JSON.stringify([
        "Classification d'articles",
        'Génération de résumés',
        'Interface conversationnelle',
      ]),
      pricing: JSON.stringify({
        free: { requests: 100, rateLimit: '10/min' },
        pro: { price: 29, requests: 10000, rateLimit: '100/min' },
      }),
    },
  })

  // Wazir
  await prisma.modele.upsert({
    where: { slug: 'wazir' },
    update: {},
    create: {
      name: 'Wazir',
      slug: 'wazir',
      description: 'Assistant conversationnel général en français',
      domaine: 'NLP',
      version: '1.0.0',
      status: 'production',
      icon: 'Bot',
      color: 'green',
      isPublic: true,
      features: JSON.stringify([
        'Réponses en français',
        'Contexte conversationnel',
        'Polyvalent',
      ]),
      pricing: JSON.stringify({
        free: { requests: 50, rateLimit: '5/min' },
        pro: { price: 19, requests: 5000, rateLimit: '50/min' },
      }),
    },
  })

  console.log('✅ Seed terminé')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
