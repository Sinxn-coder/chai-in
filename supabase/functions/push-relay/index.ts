import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  record: {
    user_id: string
    title: string
    message: string
    data: any
  }
}

async function getAccessToken(serviceAccount: any) {
  const iat = getNumericDate(0)
  const exp = getNumericDate(3600) // 1 hour expiry

  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp,
    iat,
  }

  const keyContents = serviceAccount.private_key
  const key = await crypto.subtle.importKey(
    'pkcs8',
    new TextEncoder().encode(keyContents),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const jwt = await create({ alg: 'RS256', typ: 'JWT' }, payload, key)

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const data = await response.json()
  return data.access_token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: WebhookPayload = await req.json()
    const { record } = payload
    const { user_id, title, message, data } = record

    console.log(`Processing push for user: ${user_id}`)

    // 1. Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch User FCM Tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('user_fcm_tokens')
      .select('fcm_token')
      .eq('user_id', user_id)

    if (tokenError || !tokens || tokens.length === 0) {
      console.log('No FCM tokens found for user:', user_id)
      return new Response(JSON.stringify({ message: 'No tokens found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 3. Get Firebase Service Account from Secret
    const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT secret is not set')
    }
    const serviceAccount = JSON.parse(serviceAccountJson)

    // 4. Get Access Token
    const accessToken = await getAccessToken(serviceAccount)

    // 5. Build and Send FCM Messages
    const results = await Promise.all(
      tokens.map(async (tokenObj) => {
        const fcmPayload = {
          message: {
            token: tokenObj.fcm_token,
            notification: {
              title: title,
              body: message,
            },
            data: {
              ...data,
              click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
          },
        }

        const res = await fetch(
          `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(fcmPayload),
          }
        )
        return res.json()
      })
    )

    console.log('FCM results:', results)

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
