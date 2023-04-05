<script>
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";

	onMount(async () => {
		let token = sessionStorage.getItem("token");
		if (token) {
			let res = await fetch("http://127.0.0.1:1337/api/users/me?populate=deep,3", {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			});
			let data = await res.json();
			myUser.user = data;
		}
		// myUser = JSON.parse(sessionStorage.getItem("userData"));
	});

	export let myUser = {};
	let error = false;
	let inputUsername;
	let inputPassword;

	let mode = "login";

	let registerUsername;
	let registerPassword;
	let registerEmail;

	let successfullyRegistered = false;

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
			if (res.status === 400) {
				let data = await res.json();
				console.log(JSON.stringify(data.error));
				error = data.error.message;
				throw new Error(error);
			}
			let data = await res.json();

			// session storage

			sessionStorage.setItem("token", data.jwt);
			// sessionStorage.setItem("userData", JSON.stringify(data));

			console.log(data);

			console.log(data.jwt);
			error = false;
			return data;
		} catch (e) {
			inputPassword = "";
			throw e;
		}
	}

	async function register() {
		try {
			let res = await fetch("http://127.0.0.1:1337/api/auth/local/register", {
				method: "POST",
				body: JSON.stringify({
					username: registerUsername,
					password: registerPassword,
					email: registerEmail,
				}),
				headers: {
					"Content-type": "application/json",
				},
			});
			if (res.status === 400) {
				let data = await res.json();
				error = data.error.details;
				inputPassword = "";
				// throw error;
				throw new Error(error);
			}
			let data = await res.json();
			error = false;
			return data;
		} catch (e) {
			throw e;
		}
	}
</script>

{#if !Object.keys(myUser).length || error}
	<div class="flex items-center">
		<button
			on:click={() => (mode === "login" ? (mode = "register") : (mode = "login"))}
			class="mb-4 rounded-md bg-blue-500 p-2 hover:bg-blue-400"
			>Switch to {mode === "login" ? "register" : "login"}</button>
		<form action="">
			<div class="rounded-lg bg-slate-300 p-6 [&>*]:m-2 [&>*]:p-2">
				<h1 class="text-3xl">{mode === "login" ? "Login" : "Register"}</h1>

				{#if mode === "login"}
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
						>Log in</button>
				{:else if mode === "register"}
					<input
						bind:value={registerUsername}
						placeholder="Username"
						id="username"
						class="rounded border p-2"
						type="text" />

					<input
						bind:value={registerEmail}
						placeholder="Email"
						id="email"
						class="rounded border p-2"
						type="email" />
					<input
						bind:value={registerPassword}
						placeholder="Password"
						id="password"
						class="rounded border p-2"
						type="password" />
					<button
						on:click={async () => {
							try {
								await register();
								successfullyRegistered = true;
								setTimeout(() => {
									successfullyRegistered = false;
								}, 3000);
							} catch (error) {
								console.log(error);
							}
						}}
						disabled={!registerUsername || !registerEmail || !registerPassword}
						class="disabled:hover-bg-blue-400 mt-4 rounded bg-blue-400 p-2 hover:bg-blue-300 disabled:opacity-25"
						>Register</button>
				{/if}
			</div>
		</form>
		{#if error}
			<div class="mt-4 rounded-lg bg-red-500 p-4" transition:fly={{ y: 20 }}>
				{#if typeof error === "string"}
					<p class="">{error}</p>
					<p class="">Please try again.</p>
				{:else}
					{#each Object.values(error) as errorObject}
						{#each errorObject as errorMessage}
							<p class="">{errorMessage.message}</p>
						{/each}
					{/each}
					<p class="">Please try again.</p>
				{/if}
			</div>
		{/if}
		{#if successfullyRegistered}
			<div class="mt-4 rounded-lg bg-green-500 p-4" transition:fly={{ y: 20 }}>
				<p class="">Successfully registered new user {registerUsername}!</p>
			</div>
		{/if}
	</div>
{/if}

<style>
</style>
