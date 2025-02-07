<script lang="ts">
  import { getUserState } from "$lib/state/user-state.svelte";
  import { onMount } from "svelte";

  let userContext = getUserState();

  let title = $state("");
  let start = $state("");
  let desc = $state("");

  let charCount = $derived(desc.length);
  // let start_date = $derived(Math.round(Date.parse(start) / 1000));
  let start_date = $derived.by(() => {
    let ts = new Date().getUTCDate();
    if (start !== "") {
      ts = Date.parse(start);
    }
    const dt = new Date(ts).toISOString();
    console.log(`TaskForm: setting start_date to ${dt}`);
    return dt;
  });

  function onclick() {
    console.log(
      `TaskForm adding a Task: ${title}, ${start_date.toString()}, ${desc}`
    );
    userContext.addTask({
      title,
      start_date: start_date.toString(),
      description: desc,
      done: false
    });

    title = "";
    desc = "";
    start = "";
  }

  // This is not great because the user-agent can be spoofed
  let ffBrowser = $state(false);
  function detectFF() {
    ffBrowser = navigator.userAgent.includes("Firefox");
  }

  onMount(() => {
    detectFF();
  });
</script>

<form class="mb-4">
  <!-- <form onsubmit={addTask} class="mb-4"> -->
  <div>
    <label class="text-orange-500">
      Task Title
      <input name="newTask" bind:value={title} />
    </label>
    <label class="text-orange-500">
      {#if !ffBrowser}
        Start Date and Time
        <input
          type="datetime-local"
          name="datetime-local"
          aria-label="Datetime local"
          bind:value={start}
        />
      {:else}
        Start Date
        <input type="date" name="date" aria-label="Date" bind:value={start} />
      {/if}
    </label>
    <label class="text-orange-500">
      Short Description ({charCount} of 100 characters)
      <textarea
        name="description"
        maxlength="100"
        placeholder="Optional"
        aria-label="Brief descriptionm"
        bind:value={desc}
      ></textarea>
    </label>
  </div>

  <div class="button-container">
    <button {onclick}>Add</button>
  </div>
</form>

<style>
  .button-container {
    display: flex;
    justify-content: end;
  }
</style>
