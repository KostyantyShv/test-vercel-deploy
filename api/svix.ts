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
    const apiKey = process.env.SVIX_API_KEY
    
    if (!apiKey?.startsWith('testsk_')) {
      throw new Error('Invalid API key format')
    }

    // 1. Отримаємо список додатків
    const listAppsResponse = await fetch('https://api.eu.svix.com/api/v1/app/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })

    const listAppsResult = await listAppsResponse.json()
    const app = listAppsResult.data?.[0]
    
    if (!app) {
      throw new Error('No applications found')
    }

    // 2. Створимо новий ендпоінт
    const createEndpointResponse = await fetch(`https://api.eu.svix.com/api/v1/app/${app.id}/endpoint/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: 'https://test-vercel-deploy-nine-steel.vercel.app/api/webhook',
        description: 'Test webhook endpoint',
        version: 1,
        rateLimit: 100,
        uid: `endpoint-${Date.now()}`,
        disabled: false
      })
    })

    const createEndpointResult = await createEndpointResponse.json()
    console.log('Create endpoint response:', {
      status: createEndpointResponse.status,
      body: createEndpointResult
    })

    // 3. Отримаємо список всіх ендпоінтів
    const endpointsResponse = await fetch(`https://api.eu.svix.com/api/v1/app/${app.id}/endpoint/`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })

    const endpointsResult = await endpointsResponse.json()
    
    // Надсилаємо тестове повідомлення
    const messageResponse = await fetch(`https://api.eu.svix.com/api/v1/app/${app.id}/msg/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        eventType: 'test.event',
        payload: {
          message: 'Hello from Svix!',
          timestamp: new Date().toISOString(),
          data: {
            test: true,
            value: Math.random()
          }
        }
      })
    })

    const messageResult = await messageResponse.json()
    console.log('Message sent:', messageResult)

    return new Response(JSON.stringify({
      success: true,
      application: app,
      newEndpoint: createEndpointResult,
      allEndpoints: endpointsResult.data || []
    }), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data
    })
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.response?.data
      }), 
      { 
        status: error.code || 500,
        headers,
      }
    )
  }
} 