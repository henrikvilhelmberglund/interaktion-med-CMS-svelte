<script>
	import { fly } from "svelte/transition";
	let myUser = undefined;
	let error = false;
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

	// authorization
	async function getUsers() {
		let res = await fetch("http://127.0.0.1:1337/api/users", {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});

		let data = await res.json();
		console.log(data);
		return data;
	}

	let allUsers;

	let inputUsername;
	let inputPassword;
</script>

<main class="[&>*]:m-4">
	{#if !myUser || error}
		<div class="flex items-center">
			<div class="rounded-lg bg-slate-300 p-6 [&>*]:m-2 [&>*]:p-2">
				<h1 class="text-3xl">Login</h1>
				<input
					bind:value={inputUsername}
					placeholder="Username"
					id="username"
					class="rounded border p-2"
					type="text" />
				<input
					bind:value={inputPassword}
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
      {#if error && !inputPassword}
						<div class="p-4 mt-4 rounded-lg bg-red-500" transition:fly={{ y: 20 }}>
							<p class="">Invalid credentials.</p>
							<p class="">Please try again</p>
						</div>
					{/if}
		</div>
	{/if}

	{#if myUser}
		<h2 class="text-xl">Succesfully logged in! Welcome, {myUser.user.username}!</h2>
		<button
			on:click={async () => (allUsers = await getUsers())}
			class="rounded bg-blue-400 p-2 hover:bg-blue-300">Hämta alla användare</button>

		{#if allUsers}
			{#each Object.values(allUsers) as user}
				<div class="[&>*]:m-0">
					{#each Object.entries(user) as [key, value]}
						<p>{key}: {value}</p>
					{/each}
				</div>
			{/each}
		{/if}
	{/if}
</main>

<style>
</style>
