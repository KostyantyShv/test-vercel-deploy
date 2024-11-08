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
    // Замість використання Svix API, повернемо тестові дані
    const mockData = {
      success: true,
      message: "Test response without Svix",
      timestamp: new Date().toISOString()
    }
    
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('API error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }), 
      { 
        status: 500,
        headers,
      }
    )
  }
} 