import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

type ReturnObject = {
  success: boolean
  fName: string
  lName: string
  email: string
  password: string
  passwordConfirmation: string
  city: string
  state: string
  zip: string
  errors: string[]
}


export const actions: Actions = {
  default: async ({ request, locals: { supabase} }) => {
    console.log('Signup default action')
    const formData = await request.formData()

    const fName = formData.get('fName') as string
    const lName = formData.get('lName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordConfirmation = formData.get('cPassword') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string || ""
    const zip = formData.get('zip') as string

    const returnObj: ReturnObject = {
      success: true,
      fName,
      lName,
      email,
      password,
      passwordConfirmation,
      city,
      state,
      zip,
      errors: [],
    }

    if (fName.length < 3) {
      console.log('First name not at least 3 characters')
      returnObj.errors.push("First Name has to be at least 3 characters")
    }

    if (lName.length < 2) {
      console.log('Last name not at least 3 characters')
      returnObj.errors.push("Last Name has to be at least 3 characters")
    }

    if (!email.length) {
      console.log('Email not entered')
      returnObj.errors.push("Email is required")
    }

    if (!password.length) {
      console.log('Password not entered')
      returnObj.errors.push("Password is required")
    }

    if (password !== passwordConfirmation) {
      console.log('Passwords mismatch')
      returnObj.errors.push("Passwords do not match")
    }

    if (!city.length) {
      console.log('Optional City not provided')
    }

    if (!state.length) {
      console.log('Optional State not provided')
    }

    if (!zip.length) {
      console.log('Optional Zip code not provided')
    }

    if (returnObj.errors.length) {
      returnObj.success = false
      return returnObj
    }


    const creds: SignUpWithPasswordCredentials = {
      email,
      password,
      options: {
        data: {display_name: `${fName} ${lName}`}
      }
    }
    const {data, error} = await supabase.auth.signUp(creds)

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
          first_name: fName,
          last_name: lName,
          city, state, zip
        }
      ])

    redirect(303, "/home")

  },

};