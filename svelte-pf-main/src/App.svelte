<!-- App.svelte -->
<script lang="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import Home from "./Home.svelte";
  import Library from "./Library.svelte";
  import Connections from "./Connections.svelte";
  import Automations from "./Automations.svelte";
  import AutomationEditor from "./AutomationEditor.svelte";
  import Monitor from "./Monitor.svelte";
  import Profile from "./Profile.svelte";
  import Signout from "./Signout.svelte";
  import Signin from "./Signin.svelte";
  import SideNav from "./SideNav.svelte";
  import { lastAttemptedPath, isAuthenticated } from "./stores/localDataStore";
  import getLogger from "./utils/logger";
  const logger = getLogger("App.svelte");
  import { fetchAllDefaultAgentSkills } from "./api/getAgentSkills";

  // Fetch skills for all default agents on app load
  fetchAllDefaultAgentSkills();

  $: authenticated = $isAuthenticated;
  $: path = window.location.pathname;

  const protectedRoutes = [
    { path: "/", component: Home },
    { path: "/automations", component: Automations },
    { path: "/automations/:id", component: AutomationEditor },
    { path: "/connections", component: Connections },
    { path: "/monitor", component: Monitor },
    { path: "/library", component: Library },
    { path: "/profile", component: Profile },
  ];

  const unprotectedRoutes = [
    { path: "/signout", component: Signout },
    { path: "/signin", component: Signin },
  ];

  // Watch for changes in isAuthenticated
  $: {
    if ($isAuthenticated) {
      logger.info(
        "App.svelte",
        "isAuthenticated changed",
        "User IS authenticated"
      );
      //if path is signin, signout, or empty, redirect to automations and reload
      if (path === "/signin" || path === "/signout" || path === "/") {
        navigate("/automations", { replace: true });
        //window.location.reload(); //sidebar doesnt show without reload TODO: fix this
      }
    } else {
      logger.info(
        "App.svelte",
        "isAuthenticated changed",
        "User IS NOT authenticated",
        path
      );
      //if path is one of the unprotected routes, capture the last attempted path and redirect to signin
      if (path === "/signin" || path === "/signout") {
        lastAttemptedPath.set(path);
        navigate("/signin", { replace: true });
      }
    }
  }

  const url = "";
</script>

<Router {url}>
  <div class="flex h-screen font-dm-sans">
    {#if authenticated && path !== "/signin" && path !== "/signout"}
      <SideNav initialWidth={256} />
    {/if}
    <div class="flex-1 overflow-auto">
      <main class="">
        {#each protectedRoutes as { path, component }}
          <Route {path}>
            {#if !authenticated}
              <Signin />
            {:else}
              <svelte:component this={component} />
            {/if}
          </Route>
        {/each}
        {#each unprotectedRoutes as { path, component }}
          <Route {path}><svelte:component this={component} /></Route>
        {/each}
      </main>
    </div>
  </div>
</Router>
