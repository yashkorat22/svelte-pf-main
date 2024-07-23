<!-- Library.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { libraryLoadAutomations } from './api/loadAutomationLibrary';

  import getLogger from "./utils/logger";
  const logger = getLogger("Library.svelte");

  let selectedAutomation: string = '';
  let automations: any[] = [];
  let automationDetails: any = null; // State to hold details for the selected automation
  let sortOrder: { [key: string]: 'asc' | 'desc' } = {
    name: 'asc',
    status: 'asc',
    runtime: 'asc'
  };


  // Function to open the sidebar with selected automation details
  function openSidebar(name: string, details: any) {
    selectedAutomation = name;
    automationDetails = details;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.width = '500px';
      sidebar.style.display = 'block';
    }
  }

  // Function to close the sidebar
  function closeSidebar() {
    selectedAutomation = '';
    automationDetails = null;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.width = '0';
      sidebar.style.display = 'none';
    }
  }

  function navigateToEdit(id: string) {
    window.location.href = `/automations/${id}`;
  }

  function sortTable(col: keyof typeof sortOrder) {
    sortOrder[col] = sortOrder[col] === 'asc' ? 'desc' : 'asc';
    const order = sortOrder[col];

    automations = [...automations].sort((a, b) => {
      let aValue = a[col];
      let bValue = b[col];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onMount(async () => {
    try {
      automations = await libraryLoadAutomations();
    } catch (error) {
      console.error('Failed to load automations:', error);
    }
  });
</script>

<style>
  .hover-highlight:hover {
    background-color: #f1f1f1;
  }

  #sidebar {
    overflow-y: auto;
    transition: width 0.3s ease-in-out, display 0s ease-in-out;
  }
</style>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold">Library Page</h1>
  <p class="mt-2">This is the library page.</p>

  <div class="overflow-x-auto mt-4">
    <table class="min-w-full bg-white">
      <thead class="bg-gray-800 text-white">
        <tr>
          <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm cursor-pointer" on:click={() => sortTable('name')}>Name</th>
          <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
          <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm">Version</th>
          <th class="w-1/6 text-left py-3 px-4 uppercase font-semibold text-sm cursor-pointer" on:click={() => sortTable('versionDate')}>Version Date</th>
        </tr>
      </thead>
      <tbody class="text-gray-700">
        {#each automations as automation}
          <tr class="hover-highlight cursor-pointer" on:click={() => openSidebar(automation.name, automation)}>
            <td class="w-1/6 text-left py-3 px-4">{automation.name}</td>
            <td class="w-1/6 text-left py-3 px-4">{automation.description}</td>
            <td class="w-1/6 text-left py-3 px-4">{automation.version}</td>
            <td class="w-1/6 text-left py-3 px-4">{new Date(automation.versionDate).toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div id="sidebar" class="fixed top-0 right-0 h-full bg-gray-100 shadow-lg p-6 transition-width duration-300 ease-in-out z-50 resize-x" style="width: 0; display: none;">
    <h2 class="text-xl font-semibold mb-4">{selectedAutomation ? selectedAutomation : 'Sidebar'}</h2>
    {#if automationDetails}
      <div>
        <p><strong>Name:</strong> {automationDetails.name}</p>
        <p><strong>Description:</strong> {automationDetails.description}</p>
        <p><strong>Version:</strong> {automationDetails.version}</p>
        <p><strong>Version Date:</strong> {new Date(automationDetails.versionDate).toLocaleString()}</p>
        <button on:click={() => navigateToEdit(automationDetails.id)} class="mt-4 text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">Edit</button> <!-- Added Edit button -->
      </div>
    {/if}
    <button on:click={() => closeSidebar()} class="mt-4 text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded">Close</button>
  </div>
</div>