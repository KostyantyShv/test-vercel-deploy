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
    const apiKey = process.env.SVIX_API_KEY
    console.log('SVIX_API_KEY exists:', !!apiKey)
    console.log('SVIX_API_KEY length:', apiKey?.length)
    console.log('SVIX_API_KEY prefix:', apiKey?.substring(0, 4))
    
    if (!apiKey) {
      throw new Error('SVIX_API_KEY is not defined')
    }
    
    if (!apiKey.startsWith('test_')) {
      throw new Error('SVIX_API_KEY should start with test_')
    }

    console.log('API Key validation passed')
    
    const { Svix } = await import('svix')
    const svix = new Svix(apiKey)

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
      code: error.code
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