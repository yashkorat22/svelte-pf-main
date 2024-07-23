<!-- Profile.svelte -->
<script lang="ts">
  import { pfUser } from "./stores/localDataStore"; // Adjust the import path as necessary
  import { onDestroy } from "svelte";

  let userData: User | null = null;

  // Subscribe to the user store
  const unsubscribe = pfUser.subscribe((value) => {
    userData = value;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<h1>Profile</h1>

{#if userData}
  <p>Welcome, {userData.username}!</p>
  <div>
    <h2>Your Information:</h2>
    <ul>
      {#each Object.entries(userData) as [key, value]}
        <li>{key}: {value}</li>
      {/each}
    </ul>
  </div>
{:else}
  <p>Loading...</p>
{/if}
