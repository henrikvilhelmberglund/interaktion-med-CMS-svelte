<script>
	import { fly } from "svelte/transition";

	export let myUser;
	let error = false;
	let inputUsername;
	let inputPassword;

	async function login() {
		try {
			console.log("test");
			let res = await fetch("http://127.0.0.1:1337/api/auth/local", {
				method: "POST",
				body: JSON.stringify({ identifier: inputUsername, password: inputPassword }),
				headers: {
					"Content-type": "application/json",
				},
			});
			if (!res.ok) {
				throw new Error("Response not ok :(");
			}
			let data = await res.json();

			// session storage

			sessionStorage.setItem("token", data.jwt);

			console.log(data);

			console.log(data.jwt);
			error = false;
			return data;
		} catch (e) {
			error = e;
			inputPassword = "";
			throw e;
		}
	}
</script>

{#if !myUser || error}
	<div class="flex items-center">
    <form action="">
		<div class="rounded-lg bg-slate-300 p-6 [&>*]:m-2 [&>*]:p-2">
			<h1 class="text-3xl">Login</h1>

        <input
				bind:value={inputUsername}
				placeholder="Username or email"
				id="username"
				class="rounded border p-2"
				type="text" />
			<input
				bind:value={inputPassword}
				on:input={() => (error = false)}
				placeholder="Password"
				id="password"
				class="rounded border p-2"
				type="password" />
			<button
				on:click={async () => {
					myUser = await login();
				}}
				disabled={!inputUsername || !inputPassword}
				class="disabled:hover-bg-blue-400 mt-4 rounded bg-blue-400 p-2 hover:bg-blue-300 disabled:opacity-25"
				>Logga in</button>
      </div>
    </form>
		{#if error}
			<div class="mt-4 rounded-lg bg-red-500 p-4" transition:fly={{ y: 20 }}>
				<p class="">Invalid credentials.</p>
				<p class="">Please try again.</p>
			</div>
		{/if}
	</div>
{/if}

<style>
</style>
