<script lang="ts">
  import type { PageProps } from "./$types.js";
  import Icon from "@iconify/svelte";

  let { form }: PageProps = $props();
</script>

<div
  class="h-screen flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm"
>
  <div class="flex justify-center">
    <h1>LOGIN</h1>
  </div>
  <div>
    {#if form && form.errors?.length}
      {#each form.errors as error}
        <div><p class="text-red-500">{error}</p></div>
      {/each}
    {/if}
  </div>
  <form method="post" action="?/passwordLogin">
    <fieldset class="grid mb-0">
      <input
        name="email"
        placeholder="Email"
        aria-label="Email"
        autocomplete="username"
        value={form?.email || ""}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        aria-label="Password"
        autocomplete="current-password"
        value={form?.password || ""}
      />
      <input type="submit" value="Login" />
    </fieldset>
    <div class="flex justify-end">
      <span
        >click <a href="/auth/signup" class="text-orange-500">here</a> to register</span
      >
    </div>
  </form>
  <div class="inline-flex items-center justify-center w-full">
    <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    <span
      class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"
      >or</span
    >
  </div>

  <div class="flex flex-col justify-center items-center">
    <form method="post">
      <button class="btn bg-transparent border-none" formaction="?/google">
        <Icon icon="logos:google-icon" class="h-8 w-8" />
      </button>
      <button class="btn bg-transparent border-none" formaction="?/github">
        <Icon icon="skill-icons:github-dark" class="h-8 w-8" />
      </button>
    </form>
  </div>
</div>
