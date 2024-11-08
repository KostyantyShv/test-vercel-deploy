export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  try {
    const apiKey = process.env.SVIX_API_KEY?.replace('.eu', '')
    
    if (!apiKey?.startsWith('testsk_')) {
      throw new Error('Invalid API key format. Key should start with testsk_')
    }

    console.log('API Key validation:', {
      keyPrefix: apiKey.substring(0, 7),
      keyLength: apiKey.length
    })

    // Створюємо додаток через API
    const createAppResponse = await fetch('https://api.eu.svix.com/api/v1/app/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: 'My First App',
        uid: `app-${Date.now()}`, // Унікальний ідентифікатор
        rateLimit: 100 // Додаємо ліміт запитів
      })
    })

    const createAppResult = await createAppResponse.json()
    console.log('Create app response:', {
      status: createAppResponse.status,
      headers: Object.fromEntries(createAppResponse.headers.entries()),
      body: createAppResult
    })

    if (!createAppResponse.ok) {
      throw new Error(`Failed to create app: ${JSON.stringify(createAppResult)}`)
    }
    
    return new Response(JSON.stringify({
      success: true,
      application: createAppResult
    }), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Full error details:', {
      message: error.message,
      status: error.status,
      response: error.response,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.stack
      }), 
      { 
        status: error.code || 500,
        headers,
      }
    )
  }
} 