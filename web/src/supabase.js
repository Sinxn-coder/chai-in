import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://axitmdzhuwllrgbzxlzq.supabase.co'
const supabaseAnonKey = 'sb_publishable_s3H1Bl16De43nODemXRNYw_rGDvfghZ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
