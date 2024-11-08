export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  console.log('Request received:', req.method)
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response(null, { status: 204, headers })
  }

  try {
    const rawApiKey = process.env.SVIX_API_KEY
    const apiKey = rawApiKey?.replace('.eu', '').trim()
    
    console.log('API Key details:', {
      exists: !!apiKey,
      length: apiKey?.length,
      prefix: apiKey?.substring(0, 5),
      suffix: rawApiKey?.slice(-3),
      originalLength: rawApiKey?.length,
      cleanedLength: apiKey?.length
    })
    
    if (!apiKey?.startsWith('test_')) {
      throw new Error('API key must start with test_')
    }

    const { Svix } = await import('svix')
    const svix = new Svix(apiKey, {
      region: 'eu',
      serverUrl: 'https://api.eu.svix.com'
    })

    const apps = await svix.application.list()
    console.log('Applications found:', apps.data?.length || 0)
    
    return new Response(JSON.stringify({
      success: true,
      applications: apps.data || []
    }), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      type: error.constructor.name,
      code: error.code,
      originalKey: process.env.SVIX_API_KEY
    })
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        type: error.constructor.name
      }), 
      { 
        status: error.code || 500,
        headers,
      }
    )
  }
} 