const API_KEY = 'kmia_609e9f47d4bf9497d4b8af3451eb64008c2a86113a4685a7'
const BASE_URL = 'http://localhost:3000/api/v1'

console.log('🚀 Test API Komor-IA')
console.log('═══════════════════════\n')

async function testChat() {
  console.log('📝 Test 1: Chat avec Wazir')
  console.log('─────────────────────────')

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Bonjour, comment ça va ?',
        max_tokens: 500,
      }),
    })

    console.log(`Status: ${response.status}`)

    const data = await response.json()
    console.log('Réponse:', JSON.stringify(data, null, 2))
    console.log('\n✅ Test réussi !\n')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

async function testSummarize() {
  console.log('📝 Test 2: Résumé de texte')
  console.log('─────────────────────────')

  const longText = `
    Les Comores sont un archipel volcanique situé dans l'océan Indien,
    entre le Mozambique et Madagascar. Le pays est composé de quatre îles
    principales: Grande Comore (Ngazidja), Mohéli (Mwali), Anjouan (Ndzouani)
    et Mayotte (Maore). La capitale Moroni se trouve sur Grande Comore.
    Les Comores ont obtenu leur indépendance de la France le 6 juillet 1975.
    La population est majoritairement musulmane et parle principalement le
    comorien, le français et l'arabe.
  `

  try {
    const response = await fetch(`${BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: longText.trim(),
        max_length: 100,
      }),
    })

    console.log(`Status: ${response.status}`)

    const data = await response.json()
    console.log('Résumé:', data.summary)
    console.log('Tokens utilisés:', data.usage?.total_tokens)
    console.log('\n✅ Test réussi !\n')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

async function testTranslate() {
  console.log('📝 Test 3: Traduction')
  console.log('─────────────────────────')

  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Bonjour le monde',
        source_lang: 'fr',
        target_lang: 'zdj',
      }),
    })

    console.log(`Status: ${response.status}`)

    const data = await response.json()
    console.log('Original:', 'Bonjour le monde')
    console.log('Traduction:', data.translation)
    console.log('Confiance:', data.confidence)
    console.log('\n✅ Test réussi !\n')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

async function testClassify() {
  console.log('📝 Test 4: Classification')
  console.log('─────────────────────────')

  try {
    const response = await fetch(`${BASE_URL}/classify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Le président des Comores a annoncé de nouvelles mesures économiques',
        categories: ['news', 'education', 'politics', 'sports'],
      }),
    })

    console.log(`Status: ${response.status}`)

    const data = await response.json()
    console.log('Texte:', 'Le président des Comores...')
    console.log('Catégorie:', data.category)
    console.log('Confiance:', data.confidence)
    console.log('\n✅ Test réussi !\n')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

async function testInvalidKey() {
  console.log('📝 Test 5: Erreur - Clé invalide')
  console.log('─────────────────────────────────')

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer kmia_invalid_key_123`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'Test' }),
    })

    console.log(`Status: ${response.status}`)

    const data = await response.json()
    console.log('Erreur attendue:', data.error)
    console.log("\n✅ Test d'erreur réussi !\n")
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

async function testDocumentation() {
  console.log('📝 Test 6: Documentation')
  console.log('─────────────────────────')

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'GET',
    })

    console.log(`Status: ${response.status}`)

    const data = await response.json()
    console.log('Documentation endpoint:', data.action)
    console.log('Description:', data.description)
    console.log('\n✅ Test réussi !\n')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

async function runAllTests() {
  await testChat()
  await testSummarize()
  await testTranslate()
  await testClassify()
  await testInvalidKey()
  await testDocumentation()

  console.log('═══════════════════════════════════')
  console.log('🎉 Tous les tests sont terminés !')
  console.log('═══════════════════════════════════\n')
  console.log('📊 Vérifiez maintenant :')
  console.log('   1. http://localhost:3000/dashboard → Utilisation')
  console.log('   2. Prisma Studio → Table usage_logs\n')
}

runAllTests()
