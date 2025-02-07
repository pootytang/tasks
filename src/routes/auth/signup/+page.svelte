<script lang="ts">
  import states from "$todotypes/tasks";
  import Icon from "@iconify/svelte";
  import type { PageProps } from "./$types";

  let { form }: PageProps = $props();
</script>

<div
  class="h-screen flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm"
>
  <div class="flex justify-center mb-4">
    <h1>REGISTER</h1>
  </div>
  <div>
    {#if form && form.errors?.length}
      {#each form.errors as error}
        <div class="text-red-400"><p>{error}</p></div>
      {/each}
    {/if}
  </div>
  <form class="w-full max-w-lg" method="post">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-first-name"
        >
          First Name
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id="grid-first-name"
          type="text"
          name="fName"
          placeholder="Jane"
          value={form?.fName || ""}
        />
        <!-- <p class="text-red-500 text-xs italic">Please fill out this field.</p> -->
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-last-name"
        >
          Last Name
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="text"
          name="lName"
          placeholder="Doe"
          value={form?.lName || ""}
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-email"
        >
          Email
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-password"
          type="email"
          name="email"
          placeholder="Email"
          value={form?.email || ""}
        />
      </div>
      <div class="w-full px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-password"
        >
          Password
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-password"
          type="password"
          name="password"
          placeholder="******************"
          value={form?.password || ""}
        />
      </div>
      <div class="w-full px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-cPassword"
        >
          Confirm Password
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-cPassword"
          type="password"
          name="cPassword"
          placeholder="******************"
          value={form?.passwordConfirmation || ""}
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-city"
        >
          City
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-city"
          type="text"
          name="city"
          placeholder="hood"
          value={form?.city || ""}
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-state"
        >
          State
        </label>
        <div class="relative">
          <select
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
            name="state"
            value={form?.state || ""}
          >
            {#each states as state}
              <option>{state}</option>
            {/each}
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              ><path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              /></svg
            >
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-zip"
        >
          Zip
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-zip"
          type="text"
          name="zip"
          placeholder="zip code"
          value={form?.zip || ""}
        />
      </div>
    </div>
    <div class="flex flex-col items-end">
      <button class="w-full bg-orange-500 hover:bg-orange-300">Signup</button>
      <p>
        click <a href="/auth/login" class="text-orange-600">here</a> to login
      </p>
    </div>
  </form>
  <div class="inline-flex items-center justify-center w-full">
    <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    <span
      class="absolute px-3 font-medium text-gray-400 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"
      >or signup with</span
    >
  </div>

  <div class="flex flex-col justify-center items-center">
    <form method="post">
      <button
        class="btn bg-transparent border-none"
        formaction="/auth/login/?/google"
      >
        <Icon icon="logos:google-icon" class="h-8 w-8" />
      </button>
      <button
        class="btn bg-transparent border-none"
        formaction="/auth/login/?/github"
      >
        <Icon icon="skill-icons:github-dark" class="h-8 w-8" />
      </button>
    </form>
  </div>
</div>
