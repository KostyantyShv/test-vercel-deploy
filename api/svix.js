import { Svix } from 'svix'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const svix = new Svix(process.env.SVIX_API_KEY, {
      serverUrl: 'https://api.eu.svix.com'
    })
    const result = await svix.application.list()
    return res.status(200).json(result)
  } catch (error) {
    console.error('Svix error:', error)
    return res.status(500).json({ 
      error: error.message || 'Unknown error occurred' 
    })
  }
} 