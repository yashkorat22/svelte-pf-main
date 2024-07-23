<!-- SideNav.svelte -->
<script lang="ts">
  import { Link } from "svelte-routing";
  import { writable } from "svelte/store";
  import { onDestroy } from "svelte";
  import { onMount } from "svelte";
  import UserPopover from "./UserPopover.svelte";
  import Profile from "./Profile.svelte";

  export let initialWidth = 256; // Default width
  const navWidth = writable(initialWidth);

  let isDragging = false;
  let initialX = 0;

  function handleMouseDown(event: MouseEvent) {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains("resize-handle-side")
    ) {
      isDragging = true;
      initialX =
        event.clientX -
        parseInt(getComputedStyle(event.target.parentNode).width, 10);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      event.preventDefault();
    }
  }

  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      const newWidth = Math.max(event.clientX - initialX, 50); // Ensure a minimum width of 50px
      navWidth.set(newWidth);
    }
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }

  function toggleNav() {
    navWidth.update((width) => (width === 50 ? 256 : 50)); // Ensure a minimum width of 50px when toggling
  }

  // Add event listener for mousedown only when component mounts
  function addMouseDownListener() {
    window.addEventListener("mousedown", handleMouseDown);
  }

  // Clean up event listener on component destroy
  onDestroy(() => {
    window.removeEventListener("mousedown", handleMouseDown);
  });

  // Ensure mousedown listener is added on component mount
  addMouseDownListener();
</script>

<div
  class="bg-custom-sidebar text-white relative h-full flex-shrink-0 flex flex-col justify-between"
  style="width: {$navWidth}px; overflow: hidden;"
>
  <div>
    <div class="flex justify-between items-center p-4 bg-gray-900">
      <h2 class="text-lg font-semibold">Menu</h2>
      <button on:click={toggleNav} class="text-white">Toggle</button>
    </div>
    <nav class="p-4">
      <Link to="/automations" class="block py-2 hover:bg-gray-700 rounded"
        >Automations</Link
      >
      <Link to="/monitor" class="block py-2 hover:bg-gray-700 rounded"
        >Monitor</Link
      >
      <Link to="/library" class="block py-2 hover:bg-gray-700 rounded"
        >Library</Link
      >
      <Link to="/connections" class="block py-2 hover:bg-gray-700 rounded"
        >Connections</Link
      >
    </nav>
  </div>
  <div class="p-4">
    <UserPopover email="user@example.com" />
  </div>
  <div class="resize-handle-side bg-gray-700"></div>
</div>

<style>
  .resize-handle-side {
    position: absolute;
    height: 100%;
    width: 10px;
    top: 0;
    right: -5px;
    cursor: ew-resize;
    z-index: 10;
  }
</style>
