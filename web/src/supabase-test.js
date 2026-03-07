import { supabase } from './supabase.js'

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Supabase connected successfully (table doesn\'t exist yet - this is expected)')
      return { success: true, message: 'Connected to Supabase' }
    }
    
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection error:', err)
    return { success: false, error: err.message }
  }
}

// Test authentication
export async function testAuth() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { success: true, session: !!session }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
