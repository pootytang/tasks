import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { PUBLIC_FRONTEND_URL } from "$env/static/public";

type ReturnObject = {
  success: boolean
  email: string
  password: string
  errors: string[]
}


export const actions: Actions = {
  passwordLogin: async ({ request, locals: { supabase} }) => {
    console.log('Login default action')
    const formData = await request.formData()

    const email = formData.get('email') as string
    const password = formData.get('password') as string


    const returnObj: ReturnObject = {
      success: true,
      email,
      password,
      errors: [],
    }

    
    if (!email.length) {
      console.log('Email not entered')
      returnObj.errors.push("Email is required")
    }

    if (!password.length) {
      console.log('Password not entered')
      returnObj.errors.push("Password is required")
    }

    if (returnObj.errors.length) {
      returnObj.success = false
      return returnObj
    }


    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      console.log("There has been an error")
      console.log(error)
      returnObj.success = false
      
      return fail(400, returnObj)
    }

    const userId = data.user.id
      await supabase.from("user_info").insert([
        {
          user_id: userId,
        }
      ])

    redirect(303, "/home")

  },
  google: async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:`${PUBLIC_FRONTEND_URL}/auth/callback`,
      }
    })

    if (error) {
      return fail(400, {
        message: 'Something went wrong with Google login'
      })
    }

    throw redirect(303, data.url)
  },
  github: async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo:`${PUBLIC_FRONTEND_URL}/auth/callback`,
      }
    })

    if (error) {
      return fail(400, {
        message: 'Something went wrong with Github login'
      })
    }

    throw redirect(303, data.url)
  }, 
};