'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function login(formData: FormData) {
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  let email = identifier

  // If identifier doesn't contain @, assume it's a username
  if (!identifier.includes('@')) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single()
      
    if (profile && profile.email) {
      email = profile.email
    } else {
      return { error: 'No se encontró una cuenta con ese usuario' }
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciales incorrectas' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
