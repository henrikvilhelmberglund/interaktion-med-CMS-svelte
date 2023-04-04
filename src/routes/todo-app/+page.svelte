<script>
	// Skapa en egen todo-application med Strapi.

	// 1. Skapa en Collection type för todos i Strapi.
	// 2. Varje todo ska ha en titel, beskrivning samt en boolean för om den är utförd eller inte.
	// 3. Gör det möjligt för användaren att kunna skapa upp todos i din applikation.
	// TODO  4. Kräv sedan att användaren loggar in för att kunna se alla todos samt skapa nya samt redigera/ta bort todos .

	import axios from "axios";
	import LoginRegister from "$lib/LoginRegister.svelte";
	let methods = ["GET", "POST", "PUT", "DELETE"];

	let myTodos = [];
	let myUser = {};

	let todoTitle;
	let todoDescription;
	let todoDone;
	let todoID;

	let getTodos = async () => {
		// let res = await fetch("http://127.0.0.1:1337/api/todos", {
		// headers: {
		// 	Authorization: `Bearer ${sessionStorage.getItem("token")}`,
		// },
		// });

		try {
			let res = await axios.get("http://127.0.0.1:1337/api/todos", {
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			});
			let data = res.data;
			// console.log(res);
			console.log(data.data);
			return data.data;
		} catch (error) {
			// console.log("threw error");
			throw error.request;
		}
	};

	let addTodo = async () => {
		let res = await axios.post("http://127.0.0.1:1337/api/todos", {
			data: {
				title: todoTitle,
				description: todoDescription,
				done: todoDone,
			},
		});
		let data = res.data;
		console.log(data);
		return data;
	};

	let addTodoFetch = async () => {
		let res = await fetch("http://127.0.0.1:1337/api/todos", {
			method: "POST",
			body: JSON.stringify({
				data: {
					title: todoTitle,
					description: todoDescription,
					done: todoDone,
				},
			}),
			headers: {
				// Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});

		// let res = await axios.get("http://127.0.0.1:1337/api/todos");

		let data = await res.json();
		// console.log(res);
		console.log(data);
		return data;
	};

	let updateTodoAuth = async (id) => {
		let res = await axios.put(
			`http://127.0.0.1:1337/api/todos/${id}`,
			{
				data: {
					title: todoTitle,
					description: todoDescription,
					done: todoDone,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				},
			}
		);
		let data = res.data;
		console.log(data);
		return data;
	};

	let updateTodo = async (id) => {
		let res = await axios.put(`http://127.0.0.1:1337/api/todos/${id}`, {
			data: {
				title: todoTitle,
				description: todoDescription,
				done: todoDone,
			},
		});
		let data = res.data;
		console.log(data);
		return data;
	};

	let updateTodoFetch = async (id) => {
		let res = await fetch(`http://127.0.0.1:1337/api/todos/${id}`, {
			method: "PUT",
			body: JSON.stringify({
				data: {
					title: todoTitle,
					description: todoDescription,
					done: todoDone,
				},
			}),
			headers: {
				// Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		let data = await res.json();
		console.log(data);
		return data;
	};

	let deleteID;
	let deleteTodoFetch = async (id) => {
		let res = await fetch(`http://127.0.0.1:1337/api/todos/${id}`, {
			method: "DELETE",
		});
		let data = await res.json();
		console.log(data);
		return data;
	};

	let deleteTodo = async (id) => {
		let res = await axios.delete(`http://127.0.0.1:1337/api/todos/${id}`);
		let data = res.data;
		console.log(data);
		return data;
	};
</script>

<main class="[&>*]:m-4">
	<h1 class="text-5xl">My TODOs</h1>
	<button
		on:click={() => {
			sessionStorage.removeItem("token");
			location.reload();
		}}
		class="rounded bg-blue-400 p-2 hover:bg-blue-300">Clear token</button>

	{#each methods as method}
		{#if method === "GET"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<!-- <button
					on:click={async () => {
						myTodos = await getTodos();
						console.log(myTodos);
					}}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">Run GET (axios)</button> -->
				{#await getTodos()}
					<p>Loading todos...</p>
				{:then myTodos}
					{#each Object.values(myTodos) as { attributes: { title, description, done } }}
						<div class="flex w-80 rounded-lg bg-blue-200 p-4">
							<h2 class="text-2xl">{title}</h2>
							<p>{description}</p>
							<p>done status: {done}</p>
						</div>
					{/each}
				{:catch error}
					<!-- <p>Error! {error.status}</p> -->
					{#if error.status === 403}
						<p>You must be logged in to see the TODOs.</p>
						<LoginRegister bind:myUser />
					{/if}
				{/await}
			</div>
		{:else if method === "POST"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<input class="rounded border p-1" placeholder="title" type="text" bind:value={todoTitle} />
				<input
					class="rounded border p-1"
					placeholder="description"
					type="text"
					bind:value={todoDescription} />
				<input
					class="rounded border p-1"
					bind:value={todoDescription}
					bind:checked={todoDone}
					type="checkbox" />
				<button
					on:click={async () => addTodoFetch()}
					class="rounded-md  bg-green-400  p-4 hover:bg-green-500">
					Run POST</button>
				<button
					on:click={async () => addTodo()}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run POST (axios)</button>
			</div>
		{:else if method === "PUT"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<input class="rounded border p-1" type="number" bind:value={todoID} />
				<button
					on:click={async () => updateTodoAuth(todoID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run PUT (axios auth)</button>
				<button
					on:click={async () => updateTodo(todoID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run PUT (axios)</button>
				<button
					on:click={async () => updateTodoFetch(todoID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run PUT</button>
			</div>
		{:else if method === "DELETE"}
			<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
				<h2 class="text-3xl">
					{method}
				</h2>
				<input class="rounded border p-1" type="number" bind:value={todoID} />
				<button
					on:click={async () => deleteTodo(todoID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run DELETE (axios)</button>
				<button
					on:click={async () => deleteTodoFetch(todoID)}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Run DELETE</button>
			</div>
		{/if}
	{/each}
</main>
