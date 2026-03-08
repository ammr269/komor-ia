const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const models = [
  {
    name: 'Press-AI',
    slug: 'press-ai',
    description:
      "Modèle de résumé et analyse d'articles de presse en temps réel",
    domaine: 'NLP',
    version: '1.0.0',
    status: 'production',
    endpoint: '/api/v1/press-ai',
    icon: 'FileText',
    color: 'blue',
    isPublic: true,
    features: {
      summarization: true,
      sentiment_analysis: true,
      entity_extraction: true,
    },
    pricing: {
      free: { requests: 100, price: 0 },
      pro: { requests: 10000, price: 49 },
    },
  },
  {
    name: 'Wazir',
    slug: 'wazir',
    description:
      'Assistant conversationnel intelligent pour répondre aux questions',
    domaine: 'Chatbot',
    version: '2.1.0',
    status: 'production',
    endpoint: '/api/v1/wazir',
    icon: 'Bot',
    color: 'green',
    isPublic: true,
    features: {
      multilingual: true,
      context_aware: true,
      voice_support: false,
    },
    pricing: {
      free: { requests: 50, price: 0 },
      pro: { requests: 5000, price: 29 },
    },
  },
  {
    name: 'Translate-AI',
    slug: 'translate-ai',
    description: 'Traduction automatique français-comorien',
    domaine: 'Translation',
    version: '0.5.0',
    status: 'beta',
    endpoint: '/api/v1/translate',
    icon: 'Languages',
    color: 'purple',
    isPublic: false,
    features: {
      french_to_comorian: true,
      comorian_to_french: false,
      batch_translation: true,
    },
    pricing: {
      beta: { requests: 1000, price: 0 },
    },
  },
]

async function main() {
  console.log('🌱 Début du seed des modèles...\n')

  for (const modelData of models) {
    try {
      const existing = await prisma.modele.findUnique({
        where: { slug: modelData.slug },
      })

      if (existing) {
        console.log(
          `  ⚠️  ${modelData.name} existe déjà (slug: ${modelData.slug})`,
        )
        continue
      }

      const model = await prisma.modele.create({
        data: modelData,
      })

      console.log(`  ✅ ${model.name} créé (${model.status})`)
    } catch (error) {
      console.error(`  ❌ Erreur pour ${modelData.name}:`, error.message)
    }
  }

  console.log('\n✅ Seed terminé !')
  console.log(`📊 ${models.length} modèles traités\n`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur globale:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
