<script>
	let loggedIn = false;
	let myUser = {};
	async function login() {
		console.log("test");
		let res = await fetch("http://127.0.0.1:1337/api/auth/local", {
			method: "POST",
			body: JSON.stringify({ identifier: "testy@testy.se", password: "Test1234" }),
			headers: {
				"Content-type": "application/json",
			},
		});
		let data = await res.json();

		// session storage

		sessionStorage.setItem("token", data.jwt);

		console.log(data);

		console.log(data.jwt);
		return data;
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
</script>

<main class="[&>*]:m-4">
	<h1 class="text-3xl">Strapi - permissions & authentication</h1>
	<button
		on:click={async () => {
			myUser = await login();
			loggedIn = true;
		}}
		class="rounded bg-blue-400 p-2 hover:bg-blue-300">Logga in</button>
	{#if loggedIn}
		<h2 class="text-xl">Succesfully logged in as {myUser.user.username}</h2>
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
