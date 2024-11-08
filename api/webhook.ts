import { Webhook } from 'svix'

export const config = {
  runtime: 'edge'
}

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, svix-id, svix-signature, svix-timestamp',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers
      })
    }

    const webhookSecret = process.env.SVIX_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('SVIX_WEBHOOK_SECRET is not configured')
    }

    const payload = await req.text()
    
    // Отримуємо заголовки для верифікації
    const svixId = req.headers.get('svix-id')
    const svixTimestamp = req.headers.get('svix-timestamp')
    const svixSignature = req.headers.get('svix-signature')

    console.log('Webhook received:', {
      id: svixId,
      timestamp: svixTimestamp,
      hasSignature: !!svixSignature,
      payloadPreview: payload.substring(0, 100) + '...'
    })

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new Error('Missing required Svix headers')
    }

    // Верифікуємо підпис
    const wh = new Webhook(webhookSecret)
    const evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    })

    console.log('Verified webhook event:', {
      type: evt.type,
      data: evt.data
    })

    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook received and verified',
      eventType: evt.type,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Webhook error:', {
      message: error.message,
      code: error.code,
      type: error.constructor.name
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