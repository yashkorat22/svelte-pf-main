<!-- StepSideNav.svelte -->
<script lang="ts">
  import { writable } from "svelte/store";
  import { onDestroy, createEventDispatcher } from "svelte";

  export let steps = []; // Expect an array of steps

  export let initialWidth = 256; // Default width
  const navWidth = writable(initialWidth);

  let isDragging = false;
  let initialX = 0;

  const dispatch = createEventDispatcher();

  function handleMouseDown(event: MouseEvent) {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains("resize-handle-step")
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

  // Add new step when the button is clicked
  function addNewStep() {
    dispatch("addStep");
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
      <h2 class="text-lg font-semibold">Steps</h2>
      <!-- Add step button -->
      <button
        on:click={addNewStep}
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        +
      </button>
    </div>
    <nav class="p-0 overflow-auto flex-1">
      <!-- Removed padding to align to the top -->
      {#each steps as step, index}
        <a
          href={`#step-${step.index}`}
          class="block px-4 py-2 text-sm hover:bg-gray-700 rounded truncate-description"
        >
          <span class="font-bold">{index + 1}.</span>
          {step.prompt}
        </a>
      {/each}
    </nav>
  </div>
  <div class="resize-handle-step bg-gray-700"></div>
</div>

<style>
  .resize-handle-step {
    position: absolute;
    height: 100%;
    width: 10px;
    top: 0;
    right: -5px;
    cursor: ew-resize;
    z-index: 10;
  }

  .truncate-description {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    max-height: calc(
      1.5em * 2
    ); /* Adjust line height to fit exactly two lines */
    line-height: 2.5em; /* Adjust as necessary for your design */
  }
</style>
