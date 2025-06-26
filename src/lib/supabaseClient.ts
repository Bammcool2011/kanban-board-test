import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mqlwjazxmiujdtcrkxdu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbHdqYXp4bWl1amR0Y3JreGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTE3NTAsImV4cCI6MjA2NjQyNzc1MH0.Gzx0lro6tbsxlHRkb2ADNbqeOgOO6ua6hUqfIjlY8wI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
