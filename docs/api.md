# Exemples d'utilisation de l'API Komor-IA

## 1. Chat avec Wazir

```bash
curl -X POST https://api.komor-ia.com/api/v1/chat \
  -H "Authorization: Bearer kmia_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explique-moi la photosynthèse",
    "max_tokens": 500
  }'
```

**Réponse:**

```json
{
  "success": true,
  "response": "La photosynthèse est le processus...",
  "usage": {
    "total_tokens": 123,
    "model": "Wazir"
  }
}
```

## 2. Résumer un article

```bash
curl -X POST https://api.komor-ia.com/api/v1/summarize \
  -H "Authorization: Bearer kmia_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Un long article de presse ici...",
    "max_length": 200
  }'
```

## 3. Traduire un texte

```bash
curl -X POST https://api.komor-ia.com/api/v1/translate \
  -H "Authorization: Bearer kmia_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour le monde",
    "source_lang": "fr",
    "target_lang": "zdj"
  }'
```

## 4. Classifier un texte

```bash
curl -X POST https://api.komor-ia.com/api/v1/classify \
  -H "Authorization: Bearer kmia_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Le président a annoncé de nouvelles mesures...",
    "categories": ["news", "politics", "sports"]
  }'
```

## En JavaScript (Node.js)

```javascript
const axios = require('axios')

async function chatWithWazir(prompt) {
  const response = await axios.post(
    'https://api.komor-ia.com/api/v1/chat',
    { prompt, max_tokens: 500 },
    {
      headers: {
        Authorization: 'Bearer kmia_your_api_key',
        'Content-Type': 'application/json',
      },
    },
  )

  return response.data
}

chatWithWazir('Bonjour !').then(console.log)
```

## En Python

```python
import requests

def chat_with_wazir(prompt):
    response = requests.post(
        'https://api.komor-ia.com/api/v1/chat',
        json={'prompt': prompt, 'max_tokens': 500},
        headers={
            'Authorization': 'Bearer kmia_your_api_key',
            'Content-Type': 'application/json'
        }
    )
    return response.json()

result = chat_with_wazir('Bonjour !')
print(result)
```
