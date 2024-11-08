import { Svix } from 'svix'

export async function handler() {
  try {
    const svix = new Svix('test_key')
    const result = await svix.application.list()
    return { statusCode: 200, body: JSON.stringify(result) }
  } catch (error) {
    console.error('Svix error:', error)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    }
  }
} 