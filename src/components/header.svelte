<script lang="ts">
  import { getUserState } from "$lib/state/user-state.svelte";

  let userContext = getUserState();
  let { user, first_name } = $derived(userContext);

  let displayName = $derived.by(() => {
    // Password signup has a display_name
    if (user?.user_metadata.display_name) {
      return user.user_metadata.display_name.split(" ")[0] + "'s";
    }

    // Google OAuth login has a name
    if (user?.user_metadata.name) {
      return user.user_metadata.name.split(" ")[0] + "'s";
    }

    // Github OAuth login has a preferred_username
    if (user?.user_metadata.preferred_username) {
      return user.user_metadata.preferred_username + "'s";
    }
    console.log("Header: Metadata");
    console.table(user?.user_metadata);
    return "Your";
  });
</script>

<nav class="bg-slate-900 px-6">
  <ul class="text-gray-200">
    <li><a href="/" class="secondary">Gelanez</a></li>
  </ul>
  {#if user}
    <ul class="text-gray-200">
      <li><strong>{displayName} TASKS</strong></li>
    </ul>
    <ul>
      <li>
        <button
          onclick={() => userContext.logout()}
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >Logout</button
        >
      </li>
    </ul>
  {:else}
    <ul class="text-gray-200">
      <li><strong>Login to create TASKS</strong></li>
    </ul>
    <ul>
      <li>
        <a
          href="/auth/login"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >Login</a
        >
      </li>
    </ul>
  {/if}
</nav>
