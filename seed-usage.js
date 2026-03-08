const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Prix par token selon le modèle
const PRICING = {
  'press-ai': 0.00003, // 0.03€ pour 1000 tokens
  wazir: 0.00002, // 0.02€ pour 1000 tokens
  'translate-ai': 0.00001, // 0.01€ pour 1000 tokens
}

const ENDPOINTS = [
  '/api/v1/summarize',
  '/api/v1/chat',
  '/api/v1/translate',
  '/api/v1/classify',
  '/api/v1/complete',
]

const STATUS_CODES = [200, 200, 200, 200, 200, 200, 201, 400, 429, 500]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

async function main() {
  console.log("🌱 Seed des logs d'utilisation...\n")

  // Récupérer un utilisateur existant
  const user = await prisma.user.findFirst()
  if (!user) {
    console.error("❌ Aucun utilisateur trouvé. Créez un utilisateur d'abord.")
    process.exit(1)
  }

  // Récupérer les modèles
  const models = await prisma.modele.findMany()
  if (models.length === 0) {
    console.error("❌ Aucun modèle trouvé. Lancez seed-models.js d'abord.")
    process.exit(1)
  }

  // Récupérer ou créer une clé API
  let apiKey = await prisma.apiKey.findFirst({
    where: { userId: user.id },
  })

  if (!apiKey) {
    apiKey = await prisma.apiKey.create({
      data: {
        key: 'kmia_test_key_' + Math.random().toString(36).substring(7),
        name: 'Test API Key',
        userId: user.id,
        isActive: true,
      },
    })
  }

  // Générer 200 logs sur les 30 derniers jours
  const logsToCreate = []
  const now = new Date()

  for (let i = 0; i < 200; i++) {
    const model = randomElement(models)
    const tokens = randomInt(100, 5000)
    const pricing = PRICING[model.slug] || 0.00002
    const cost = tokens * pricing

    // Date aléatoire dans les 30 derniers jours
    const daysAgo = randomInt(0, 30)
    const hoursAgo = randomInt(0, 23)
    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - daysAgo)
    createdAt.setHours(createdAt.getHours() - hoursAgo)

    logsToCreate.push({
      userId: user.id,
      apiKeyId: apiKey.id,
      modeleId: model.id,
      endpoint: randomElement(ENDPOINTS),
      method: randomElement(['POST', 'GET']),
      statusCode: randomElement(STATUS_CODES),
      responseTime: randomInt(200, 3000),
      tokens: tokens,
      cost: parseFloat(cost.toFixed(4)),
      metadata: {
        userAgent: 'API Client/1.0',
        ip: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      },
      createdAt: createdAt,
    })
  }

  // Insérer par batch
  let created = 0
  for (const log of logsToCreate) {
    await prisma.usageLog.create({ data: log })
    created++
    if (created % 20 === 0) {
      console.log(`  ✓ ${created} logs créés...`)
    }
  }

  console.log(`\n✅ ${created} logs d'utilisation créés !`)
  console.log(`📊 Utilisateur: ${user.email}`)
  console.log(`🔑 Clé API: ${apiKey.name}`)
  console.log(`📅 Période: 30 derniers jours\n`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
