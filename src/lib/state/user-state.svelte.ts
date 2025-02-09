import { goto } from "$app/navigation";
import type { Database } from "$todotypes/database.types";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";

interface UserStateProps {
  session: Session | null
  supabase: SupabaseClient | null
  user: User | null
}

export type Task = {
  id: number;
  user_id: string
  title: string;
  description?: string | null;
  start_date: string;
  done: boolean | null
  created_at: string
}

export type UpdateableTaskFields = Omit<Task, "id" | "user_id" | "created_at">

export class UserState {
  session = $state<Session | null>(null)
  supabase = $state<SupabaseClient<Database> | null>(null)
  user = $state<User | null>(null)
  allTasks = $state<Task[]>([])
  first_name = $state<string | null>(null)

  constructor(data: UserStateProps) {
    this.updateState(data)
  }

  // Called during initialization and on updates
  updateState(data: UserStateProps) {
    this.session = data.session
    this.supabase = data.supabase
    this.user = data.user
    this.fetchUserTasks()
  }

  async addTask(newTask: UpdateableTaskFields) {
    console.log('UserState: addTask called with the following newTask')
    console.table(newTask)

    if (!this.supabase) {
      console.log('UserState:addTask did not find a db connection')
      return 
    }

    const userId = this.user?.id || ""

    const { error } = await this.supabase.from("tasks").insert(newTask)
    if (error) {
      throw new Error(error.message)
    } else {
      const { data } = await this.supabase.from("tasks").select("*").eq('user_id', userId)

      if (!data) {
        throw new Error("Could not retrieve all tasks from db")
      }

      this.allTasks = data
    }
    
  };

  async deleteTaskFromDB(taskId: number) {
    console.log(`UserState: deleting task with id: ${taskId}`)
    if (!this.supabase) {
      console.log('UserState: deleteTaskFromDB did not find a db connection')
      return 
    }

    const {error, status} = await this.supabase.from('tasks').delete().eq('id', taskId)
    if (!error && status === 204) {
      this.allTasks = this.allTasks.filter((task) => task.id !== taskId)
    }

    goto("/home")
  }

  async updateTask(taskId: number, updateObj: Partial<UpdateableTaskFields>) {
    console.log(`UserState: updating task with id: ${taskId}`)
    if (!this.supabase) {
      console.log('User State: supabase not connected')
      return
    }

    const { status, error } = await this.supabase?.from('tasks').update(updateObj).eq('id', taskId) || {}
    if (status !== 204 ) {
      console.log(`UserState: updateTask failed with a status code of: ${status}`)
      console.log(error)
    } else {
      // make sure the ui is updated with the latest changes
      this.allTasks = this.allTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updateObj,
          }
        } else {
          return task
        }
      })
    }
    
  }

  async fetchUserTasks() {
    if (!this.user || !this.supabase) {
      return;
    }

    const userId = this.user.id

    // Instead of writing multiple async calls, make them a sequence with Promise.all
    // first is the tasks request so that is first in the sequence
    // next is the user_info request so that is 2nd in the sequence
    const [tasksResponse, userInfoResponse] = await Promise.all([
      this.supabase.from('tasks').select('*').eq("user_id", userId),
      this.supabase.from("user_info").select("first_name").eq("user_id", userId).single()
    ])

    if (tasksResponse.error || !tasksResponse.data || userInfoResponse.error || !userInfoResponse.data) {
      console.log("User State: error fetching all tasks for user")
      console.log({
        tasksError: tasksResponse.error,
        tasksData: tasksResponse.data,
        userError: userInfoResponse.error,
        userData: userInfoResponse.data
      })
      return;
    }

    this.allTasks = tasksResponse.data
    this.first_name = userInfoResponse.data.first_name
  }

  async logout() {
    await this.supabase?.auth.signOut();
    goto("/auth/login");
  }
}

// Using the context api to ensure the UserState will be the same user state throughout all pages e.g. Global State

// A symbol ensures a unique value
const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
  return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
  return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}

