import { Svix } from 'svix'

export const config = {
  runtime: 'edge',
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

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers })
  }

  try {
    const svix = new Svix(process.env.VITE_SVIX_API_KEY)
    const result = await svix.application.list()
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Svix error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }), 
      { 
        status: 500,
        headers,
      }
    )
  }
} 