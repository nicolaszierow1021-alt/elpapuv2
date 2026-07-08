'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function signup(formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!username || !email || !password) {
    return { error: 'Todos los campos son obligatorios' }
  }

  // Comprobar si el usuario ya existe
  const { data: existingUser } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (existingUser) {
    return { error: 'Ese nombre de usuario ya está en uso' }
  }

  const supabase = await createClient()

  // 1. Crear el usuario en auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // 2. Insertar el perfil manualmente con service_role para asegurar que se crea
    // (A veces los triggers fallan o el cliente RLS falla)
    await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      email: authData.user.email,
      username: username,
      role: 'user'
    })
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}
