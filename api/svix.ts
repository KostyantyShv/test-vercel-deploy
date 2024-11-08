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
    const testToken = process.env.SVIX_API_KEY?.replace('.eu', '') || 'test_key'
    
    const { Svix } = await import('svix')
    const svix = new Svix(testToken)
    const result = await svix.application.list()
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Svix error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        token: process.env.SVIX_API_KEY ? 'Token exists' : 'No token found'
      }), 
      { 
        status: 500,
        headers,
      }
    )
  }
} 