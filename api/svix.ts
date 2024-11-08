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
    console.log('SVIX_API_KEY exists:', !!process.env.SVIX_API_KEY)
    
    const { Svix } = await import('svix')
    console.log('Svix imported successfully')
    
    const svix = new Svix(process.env.SVIX_API_KEY || 'test_key', {
      serverUrl: 'https://api.eu.svix.com'
    })
    console.log('Svix instance created')

    // Спочатку спробуємо отримати список додатків
    const apps = await svix.application.list()
    console.log('Existing apps:', apps)

    // Якщо додатків немає, створимо новий
    if (!apps.data?.length) {
      console.log('No apps found, creating new one')
      const app = await svix.application.create({
        name: "Test Application",
        uid: "test-app-1"
      })
      console.log('New app created:', app)
    }
    
    return new Response(JSON.stringify({
      message: "Svix operation completed",
      apps: apps.data
    }), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Svix error details:', {
      message: error.message,
      code: error.code,
      body: error.body,
      headers: error.headers
    })
    
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