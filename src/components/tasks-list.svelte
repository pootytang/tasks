<script lang="ts">
  import { fade } from "svelte/transition";
  import type {
    UpdateableTaskFields,
    Task
  } from "$lib/state/user-state.svelte";

  interface TaskListProps {
    tasks: Task[];
    toggleDone: (task: UpdateableTaskFields) => void;
    toggleEdit: () => void;
    removeTask: (id: number) => void;
    edit: Boolean;
  }

  let { edit, tasks, toggleDone, toggleEdit, removeTask }: TaskListProps =
    $props();
</script>

<section>
  {#each tasks as task}
    <article transition:fade>
      <div class="w-full flex justify-center items-center text-orange-500">
        <header class:line-through={task.done}>{task.title}</header>
      </div>

      <div class="flex justify-between items-center">
        {#if edit}
          <div
            class="flex w-full cursor-pointer justify-center items-center gap-2"
          >
            <input
              type="text"
              name="edit-todo-title"
              bind:value={task.title}
              class="mt-4 rounded-md bg-zinc-700"
            />
            <button onclick={() => toggleEdit()} class="outline">Done</button>
          </div>
        {:else}
          <div class="flex-none">
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onchange={() => toggleDone(task)}
              />
              <span>completed</span>
            </label>
          </div>
          <div class="flex w-64 cursor-pointer justify-center items-center">
            <button onclick={() => toggleEdit()} class="edit-button"
              >edit</button
            >
          </div>
          <div class="flex-initial">
            <button onclick={() => removeTask(task.id)} class="outline"
              >Remove</button
            >
          </div>
        {/if}
      </div>
    </article>
  {/each}
</section>

<style>
  .edit-button {
    justify-content: center;
    align-items: middle;
    padding: 10px 20px;
    background-color: transparent;
    border: none;
    color: #3d3c3c;
    font-size: 16px;
  }
</style>
