<script lang="ts">
  import { TasksForm, TasksList } from "$components";
  import { getUserState } from "$lib/state/user-state.svelte";
  import type { Filter } from "$todotypes/database.types";
  import type { UpdateableTaskFields } from "$lib/state/user-state.svelte";

  let message = "ToDo's";
  let edit = $state(false);

  let currentFilter = $state<Filter>("all");
  // let tasks = $state<Task[]>([]);
  let userContext = getUserState();
  let { allTasks } = $derived(userContext);

  let totalDone = $derived(
    allTasks.reduce((total, task) => total + Number(task.done), 0)
  );

  let filteredTasks = $derived.by(() => {
    switch (currentFilter) {
      case "all": {
        return allTasks;
      }
      case "done": {
        return allTasks.filter((task) => task.done);
      }
      case "todo": {
        return allTasks.filter((task) => !task.done);
      }
    }
    return allTasks;
  });

  const toggleDone = (task: UpdateableTaskFields) => {
    task.done = !task.done;
  };

  const toggleEdit = () => {
    edit = !edit;
  };

  const removeTask = async (id: number) => {
    await userContext.deleteTaskFromDB(id);
  };
</script>

{#snippet filterButton(filter: Filter)}
  <button
    onclick={() => (currentFilter = filter)}
    class:contrast={currentFilter === filter}
    class="secondary capitalize"
    >{filter}
  </button>
{/snippet}

<main>
  <div class="flex justify-center bg-gray-100 mb-4">
    <strong>What do you need TODO?</strong>
  </div>

  <h1>{message}</h1>
  <TasksForm />
  <p>
    {#if allTasks.length}
      {totalDone} / {allTasks.length} tasks completed
    {:else}
      Add a task to get started
    {/if}
  </p>
  {#if allTasks.length}
    <div class="flex justify-end gap-2 mb-4">
      {@render filterButton("all")}
      {@render filterButton("todo")}
      {@render filterButton("done")}
    </div>
  {/if}
  <TasksList {edit} {toggleDone} {toggleEdit} {removeTask} tasks={allTasks} />
</main>

<style>
  main {
    margin: 1rem auto;
    max-width: 800px;
  }
</style>
