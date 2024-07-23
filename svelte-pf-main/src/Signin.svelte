<!-- Signin.svelte -->
<script lang="ts">
  import {
    isAuthenticated,
    pfUser,
    lastAttemptedPath,
  } from "./stores/localDataStore";
  import { signIn } from "./api/auth";
  import infoicon from "./assets/infoicon.svg"
  import getLogger from "./utils/logger";
  import { navigate } from "svelte-routing";
  import { Icon, LockClosed } from "svelte-hero-icons";
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  const logger = getLogger("Signin.svelte");


  let isRegistered: boolean = true;
  let showMessage:string = "";
  let rotating:boolean = false;
  let username: string = "";
  let password: string = "";
  let showicon: boolean=false
  let showEmailError: boolean = false;
  let showPasswordError: boolean = false;


  async function handleSignIn(event: Event) {
    event.preventDefault();
    showicon=true
    rotating = true;
    // showMessage = "";
    showEmailError = !username;
    showPasswordError = !password;

    if (!username || !password) {
      rotating = false;
      showicon = false;
      return;
    }
    try {
      logger.info("Signin.svelte", "handleSignIn", "Attempting to sign in");
        
      await signIn(username, password);
      logger.info("Signin.svelte", "handleSignIn", "Sign in successful");
      showMessage = "success";
      // rotating = false;

    } catch (error) {
      logger.error("Signin.svelte", "handleSignIn", "Sign in failed", error);
        showMessage = "error";
       
    } finally{
      showicon=false
      rotating = false;
    }
  }

  async function signInWithGoogle() {
    logger.info(
      "Signin.svelte",
      "signInWithGoogle",
      "Sign in with Google attempted"
    );
  }
</script>

<div class="flex flex-col items-center justify-center h-[100vh]">
  <div
    class=" flex flex-col items-center justify-center border-2 rounded-lg px-10 py-8 gap-2 w-[400px]"
  >
    <Icon src={LockClosed} size="32" />

    <div class="flex flex-col items-center justify-center mb-3">
      <div class="text-[25px]">Welcome back!</div>
      <div class="text-gray-400">
        Don't have an account? <span class="text-[#12A6E8]">Sign up.</span>
      </div>
    </div>

    <form on:submit={handleSignIn} class="w-full max-w-sm">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm mb-2" for="username">
          Email
        </label>
        <input
        class="shadow appearance-none border rounded-lg text-sm w-full py-[6px] px-[10px] text-gray-700 leading-tight font-dm-sans focus:outline-[#12A6E8] focus:shadow-outline {showEmailError ? 'border-red-500' : ''}"
        id="username"
        type="text"
        bind:value={username}
        placeholder="Enter your email"
      />
      {#if showEmailError}
        <p class="text-red-500 text-sm font-normal mt-1 font-dm-sans">Please enter your email.</p>
      {/if}
      </div>
      <div class="mb-6">
        <label
          class="flex flex-row items-center justify-between text-gray-700 text-sm mb-2"
          for="password"
        >
          <span>Password</span>
          <span class="text-[#12A6E8]">Forgot password?</span>
        </label>
        <input
        class="shadow appearance-none font-dm-sans border rounded-lg w-full py-[6px] px-[10px] text-gray-700 text-sm leading-tight focus:outline-[#12A6E8] focus:shadow-outline {showPasswordError ? 'border-red-500' : ''} "
        id="password"
        type="password"
        bind:value={password}
        placeholder="Enter your password"
      />
      {#if showPasswordError}
      <p class="text-red-500 text-sm font-normal mt-1 font-dm-sans">Please enter your password.</p>
    {/if}
      </div>
      <div class="flex flex-col items-center">
        {#if showMessage==="error"}
        <div class="error-message bg-red-500 text-white rounded-md mb-4 p-4 w-full flex items-center gap-2">
           <img src={infoicon} alt="info"/>
          <span class="font-dm-sans">User is not registered!</span>
        </div>
      {/if}
      {#if showMessage==="success"}
      <div class="error-message bg-green-500 text-white rounded-md mb-4 p-4 w-full flex items-center gap-2 font-dm-sans">
        <span>Successfully registered!</span>
      </div>
    {/if}
        <button
          class="bg-[#12A6E8] hover:bg-blue-500 rounded-lg text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-full flex justify-center items-center gap-2"
          type="submit"
        >
       {#if showicon}
       <svg
       version="1.1"
       id="Capa_1"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       x="0px"
       y="0px"
       width="16"
       height="16"
       viewBox="0 0 612.006 612.006"
       style="enable-background:new 0 0 612.006 612.006;"
       fill="white"
       xml:space="preserve"
       class={rotating ? 'animate-spin' : ''}
     >
       <g>
         <g>
           <path d="M67.079,299.982c1.255,0.245,2.526,0.342,3.78,0.342c4.367,0,8.636-1.434,12.139-4.122l81.826-62.942 c8.717-6.729,10.346-19.243,3.666-27.943c-6.746-8.815-19.259-10.379-27.943-3.666l-40.343,31.055 c30.664-85.834,113.044-146.495,207.09-146.495c102.535,0,190.635,69.557,214.243,169.143 c2.526,10.705,13.149,17.401,23.968,14.794c10.688-2.525,17.304-13.263,14.778-23.967 C532.422,128.542,428.388,46.374,307.294,46.374c-112.897,0-211.815,73.875-246.553,177.909L37.05,184.348 c-5.605-9.483-17.841-12.53-27.275-6.974c-9.466,5.621-12.611,17.841-6.974,27.292l50.934,85.899 C56.619,295.469,61.491,298.891,67.079,299.982z"/>
           <path d="M609.196,407.356l-50.934-85.899c-2.867-4.904-7.739-8.325-13.344-9.417c-5.605-1.092-11.405,0.325-15.919,3.779 l-81.826,62.942c-8.717,6.713-10.347,19.21-3.666,27.943c6.696,8.749,19.227,10.33,27.943,3.649l40.425-31.104 c-30.648,85.851-113.077,146.544-207.172,146.544c-102.519,0-190.618-69.557-214.243-169.143 c-2.525-10.705-13.165-17.353-23.968-14.795c-10.688,2.525-17.32,13.264-14.794,23.968 C79.56,483.464,183.61,565.632,304.704,565.632c112.849,0,211.816-73.842,246.602-177.812l23.642,39.854 c3.715,6.289,10.363,9.776,17.125,9.776c3.471,0,6.974-0.896,10.167-2.786C611.689,429.043,614.851,416.807,609.196,407.356z"/>
         </g>
       </g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
       <g></g>
     </svg>
     {/if}
          <span class="text-sm font-dm-sans font-normal" >Continue</span>
        </button>

        <div class="inline-flex items-center justify-center w-full">
          <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-300" />
          <span
            class="absolute px-3 font-medium text-gray-500 -translate-x-1/2 bg-white left-1/2"
            >or</span
          >
        </div>

        <button
          class="w-full border-2 text-black text-sm font-bold py-[6px] px-[10px] rounded-lg focus:outline-none focus:shadow-outline flex flex-row items-center justify-center gap-2"
          on:click={signInWithGoogle}
          type="button"
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.5265 19 18.4439 16.3923 18.9291 13H13C12.4477 13 12 12.5523 12 12C12 11.4477 12.4477 11 13 11H20C20.5523 11 21 11.4477 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.1424 3 16.1123 3.74979 17.6578 5.00041C18.0871 5.34782 18.1535 5.97749 17.8061 6.40682C17.4587 6.83615 16.829 6.90256 16.3997 6.55515C15.1972 5.58212 13.668 5 12 5Z"
              fill="#000000"
            />
          </svg>

          <span class="font-dm-sans">Continue with Google</span>
        </button>
      </div>

      <div
        class="text-[14px] flex flex-row items-center justify-center mt-3 text-gray-400"
      >
        By signing in, you agree to our <span class="text-[#12A6E8]"
          >Terms of Service.</span
        >
      </div>
    </form>
  </div>
</div>

<style>
  .h-full {
    height: 100%;
  }
</style>
