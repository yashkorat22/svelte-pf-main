<!-- UserPopover.svelte -->
<script lang="ts">
  import { Link } from "svelte-routing";
  import { pfUser } from "./stores/localDataStore";
  import { signout } from "./api/auth";
  import { onDestroy } from "svelte";

  let displayName = "";

  // Subscribe to the user store
  const unsubscribe = pfUser.subscribe((userInfo) => {
    displayName = userInfo ? userInfo.email || userInfo.username : "";
  });

  let showPopover = false;
  let timeout: number;

  function show() {
    clearTimeout(timeout);
    showPopover = true;
  }

  function hide() {
    timeout = setTimeout(() => {
      showPopover = false;
    }, 100);
  }

  // Clean up the subscription on destroy
  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="relative" on:mouseleave={hide} role="button" tabindex="0">
  <div
    class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-700"
    role="button"
    tabindex="0"
    on:mouseenter={show}
  >
    {displayName}
  </div>

  {#if showPopover}
    <div
      class="absolute bottom-full left-0 mb-2 w-full bg-white py-2 shadow-lg transition"
      role="menu"
      tabindex="0"
      on:mouseenter={show}
      on:mouseleave={hide}
    >
      <Link
        to="/profile"
        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >Profile</Link
      >
      <a
        href="#"
        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        on:click|preventDefault={signout}>Signout</a
      >
    </div>
  {/if}
</div>

<style>
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .transition {
    transition: all 0.2s ease;
  }
</style>
