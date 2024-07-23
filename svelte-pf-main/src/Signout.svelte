<script lang="ts">
    import { onMount } from 'svelte';
  
    onMount(() => {
      // You can add signout logic here, for example:
      // Perform logout actions and redirect to the login page:
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    });
  </script>
  
  <div class="flex items-center justify-center h-full">
    <h1 class="text-3xl">You have been signed out. Redirecting...</h1>
  </div>
  
  <style>
    .h-full {
      height: 100%;
    }
  </style>