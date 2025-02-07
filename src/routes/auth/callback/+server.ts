import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')
  console.log(`callback retrieved code: ${code} sending to token endpoint`)
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  const sessionData = await supabase.auth.getSession()
  // console.log('Callback: Provider:')
  // console.log(sessionData.data.session?.user.app_metadata.provider)
  // console.log('Callback: User_Metadata:')
  // console.table(sessionData.data.session?.user.user_metadata)


  // CHECK FOR AN EXISTING USER IN THE USER_INFO SUPABASE TABLE
  if (sessionData.data.session) {
    const userId = sessionData.data.session.user.id
    let fName = ""
    let lName = ""

    // Google metatadata contains a name Github does not but does contain a user_name and a preferred_username
    if (sessionData.data.session?.user.app_metadata.provider?.toLowerCase() === 'google') {
      console.log('Callback: Provider is google')
      fName = sessionData.data.session.user.user_metadata.name.split(" ")[0]
      lName = sessionData.data.session.user.user_metadata.name.split(" ")[1]
    } else {
      console.log('Callback: Provider is github')
      fName = sessionData.data.session.user.user_metadata.preferred_username
    }

    const { data: existingUser, error: selectError } = await supabase
      .from("user_info")
      .select("first_name")
      .eq("user_id", userId)
      .single()
  
    if (selectError && selectError.code !== 'PGRST116') {
      return new Response("Failed to check for existing user", { status: 500 })
    }

    // INSERT INTO SUPABASE ONLY WHEN THERE'S NO EXISTING USER
    if (!existingUser) {
      const { error: insertError} = await supabase
        .from("user_info")
        .insert([
          { 
            user_id: userId, 
            first_name: fName,
            last_name: lName
          }
        ])
      
      if (insertError) {
        return new Response("Failed to insert user name", { status: 500 })
      }
    }

    throw redirect(303, "/home")
  }

  return new Response("Session data not found", { status: 400 })
}