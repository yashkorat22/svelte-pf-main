<!-- AutomationEditor.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { getAutomationById } from "./api/getAutomationById";
  import { getAutomationCodeByStep } from "./api/getAutomationCodeByStep";
  import { getAutomationResultsByStep } from "./api/getAutomationResultsByStep";
  import getLogger from "./utils/logger";
  import StepSideNav from "./StepSideNav.svelte"; // Import the new component
  const logger = getLogger("AutomationEditor.svelte");

  let automationId: string = "";
  let automationDetails: any = {};
  let url: string = "";
  let stepsCode: any = {};
  let stepsResults: any = {};
  let steps: any[] = []; // Define steps array

  onMount(async () => {
    try {
      // Get the current URL and extract the automationId
      url = window.location.href; // e.g., /automations/cq46c8s015nc761okptg OR automations/cqcomvgamn9s705dgujg#step-1
      automationId = url.split("/").pop() || "";
      //take off hash if there
      automationId = automationId.split("#")[0];

      // Fetch automation details
      automationDetails = await getAutomationById(automationId);
      steps = automationDetails.steps; // Initialize steps
    } catch (error) {
      console.error("Failed to load automation details:", error);
    }
  });

  async function toggleVisibility(stepIndex: number, type: "code" | "results") {
    const element = document.getElementById(`${type}-${stepIndex}`);
    if (element) {
      element.classList.toggle("hidden");

      if (!element.classList.contains("hidden")) {
        // Fetch code or results each time the section is expanded
        if (type === "code") {
          await fetchStepCode(stepIndex);
        } else if (type === "results") {
          await fetchStepResults(stepIndex);
        }
      }
    }
  }

  async function fetchStepCode(stepIndex: number) {
    try {
      stepsCode[stepIndex] = "Loading Code..."; // Display loading message
      const step = steps.find((s) => s.index === stepIndex);
      if (step) {
        const codeObj = await getAutomationCodeByStep(
          automationId,
          step.index,
          automationDetails.version
        );
        const codeObjData = JSON.parse(codeObj);

        if (codeObjData && codeObjData.code) {
          stepsCode[step.index] = codeObjData.code;
        } else {
          stepsCode[step.index] = "Code not available";
        }
      }
    } catch (stepError) {
      console.error(`Failed to load code for step ${stepIndex}:`, stepError);
      stepsCode[stepIndex] = "Failed to load code";
    }
  }

  async function fetchStepResults(stepIndex: number) {
    try {
      stepsResults[stepIndex] = "Loading Results..."; // Display loading message
      const step = steps.find((s) => s.index === stepIndex);
      if (step) {
        const resultsData = await getAutomationResultsByStep(
          automationId,
          step.index,
          automationDetails.version
        );
        const resultsObjData = JSON.parse(resultsData);

        stepsResults[step.index] = resultsObjData[0] || {};
      }
    } catch (stepError) {
      console.error(`Failed to load results for step ${stepIndex}:`, stepError);
      stepsResults[step.index] = "Failed to load results";
    }
  }

  function navigateBack() {
    navigate("/automations");
  }

  // Add new step when event is dispatched from StepSideNav
  function addStep() {
    const newIndex = steps.length
      ? Math.max(...steps.map((s) => s.index)) + 1
      : 0;
    steps = [
      ...steps,
      {
        index: newIndex,
        agentId: "new-agent", // Default value
        prompt: "Untitled step",
        version: "1.0",
        versionDate: new Date().toISOString(),
      },
    ];
  }

  function handlePromptChange(event: Event, stepIndex: number) {
    const target = event.target as HTMLTextAreaElement;
    const updatedSteps = steps.map((step) =>
      step.index === stepIndex ? { ...step, prompt: target.value } : step
    );
    steps = updatedSteps;
  }

  function runStep(stepIndex: number) {
    const step = steps.find((s) => s.index === stepIndex);
    if (step) {
      logger.info(`Running step ${stepIndex}:`, step);
      // Placeholder for actual step execution logic
    }
  }
</script>

<div id="automationEditorContainer" class="container mx-auto p-0 flex h-screen">
  <!-- Include the StepSideNav component, passing the steps as a prop -->
  <StepSideNav {steps} initialWidth={256} on:addStep={addStep} />

  <div class="flex-1 overflow-auto p-4">
    <h1 class="text-2xl font-bold">Automation Details</h1>
    {#if automationDetails && automationDetails.name}
      <div>
        <p><strong>Name:</strong> {automationDetails.name}</p>
        <p><strong>Description:</strong> {automationDetails.description}</p>
        <p><strong>Version:</strong> {automationDetails.version}</p>
        <p>
          <strong>Version Date:</strong>
          {new Date(automationDetails.versionDate).toLocaleString()}
        </p>
      </div>
      <div class="mt-4">
        <h2 class="text-xl font-semibold">Steps</h2>
        <div class="steps-container">
          {#if Array.isArray(automationDetails.steps) && automationDetails.steps.length > 0}
            {#each steps as step}
              <div class="step border-b py-2" id={`step-${step.index}`}>
                <p><strong>Step Index:</strong> {step.index}</p>
                <p><strong>Agent ID:</strong> {step.agentId}</p>
                <label for={`prompt-${step.index}`}
                  ><strong>Prompt:</strong></label
                >
                <textarea
                  id={`prompt-${step.index}`}
                  on:input={(e) => handlePromptChange(e, step.index)}
                  class="w-full p-2 border rounded">{step.prompt}</textarea
                >
                <button
                  on:click={() => runStep(step.index)}
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Run step
                </button>
                <p><strong>Version:</strong> {step.version}</p>
                <p>
                  <strong>Version Date:</strong>
                  {new Date(step.versionDate).toLocaleString()}
                </p>
                <a
                  href="javascript:void(0);"
                  on:click={() => toggleVisibility(step.index, "code")}
                  class="text-blue-500 underline cursor-pointer">View Code</a
                >
                <pre
                  id={`code-${step.index}`}
                  class="hidden bg-gray-100 p-2 border rounded my-2"><code
                    >{stepsCode[step.index] || ""}</code
                  ></pre>

                <a
                  href="javascript:void(0);"
                  on:click={() => toggleVisibility(step.index, "results")}
                  class="text-blue-500 underline cursor-pointer">View Results</a
                >
                <pre
                  id={`results-${step.index}`}
                  class="hidden bg-gray-100 p-2 border rounded my-2"><code
                    >{#if typeof stepsResults[step.index] === "string" && stepsResults[step.index].startsWith("Loading Results")}
                      {stepsResults[step.index]}
                    {:else if stepsResults[step.index]}
                      <div><strong>Standard Output:</strong><pre>{stepsResults[
                            step.index
                          ]
                            .stdout}</pre></div>
                      <div><strong
                          >Error Output:</strong
                        ><pre>{stepsResults[step.index]
                            .stderr}</pre></div>
                      <div><strong
                          >Exit Code:</strong
                        > {stepsResults[step.index]
                          .exitCode}</div>
                      <div><strong
                          >Signal:</strong
                        > {stepsResults[step.index]
                          .signal}</div>
                      <div><strong
                          >Error:</strong
                        > {stepsResults[step.index]
                          .error}</div>
                      <div><strong
                          >Duration:</strong
                        > {stepsResults[step.index].duration} ms</div>
                    {:else}
                      Results not available
                    {/if}</code
                  ></pre>
              </div>
            {/each}
          {:else}
            <div>No steps available.</div>
          {/if}
        </div>
      </div>
    {:else}
      <p>Loading...</p>
    {/if}
  </div>
</div>

<style>
  .hidden {
    display: none;
  }
  .steps-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: scroll;
  }
  .step {
    flex: 0 0 100vh; /* Make each step take the full height of the viewport */
    overflow-y: auto; /* Add vertical scroll for long content in a step */
  }
  pre {
    white-space: pre-wrap; /* Ensures content wraps within the container */
    overflow-x: auto; /* Adds horizontal scroll for very long lines */
  }
  code {
    font-family: Menlo, Monaco, "Courier New", Courier, monospace; /* Use a monospaced font for code blocks */
  }
</style>
