<script>
	// Skapa en egen todo-application med Strapi.

	// 1. Skapa en Collection type för todos i Strapi.
	// 2. Varje todo ska ha en titel, beskrivning samt en boolean för om den är utförd eller inte.
	// 3. Gör det möjligt för användaren att kunna skapa upp todos i din applikation.
	//  4. Kräv sedan att användaren loggar in för att kunna se alla todos samt skapa nya samt redigera/ta bort todos .

	// TODO add edit modal thingy
	// TODO add new todo modal thingy
	// TODO better styling

	import axios from "axios";
	import LoginRegister from "$lib/LoginRegister.svelte";

	let myUser = {};

	let todoTitle;
	let todoDescription;
	let todoDone;
	let todoID;
	let changed = false;

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
		let res = await axios.post(
			"http://127.0.0.1:1337/api/todos",
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
		changed = !changed;
		clearInputs();

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
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});

		// let res = await axios.get("http://127.0.0.1:1337/api/todos");

		let data = await res.json();
		// console.log(res);
		console.log(data);
		changed = !changed;
		clearInputs();

		return data;
	};

	let updateTodo = async (id) => {
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
		changed = !changed;
		clearInputs();

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
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
		});
		let data = await res.json();
		console.log(data);
		changed = !changed;
		clearInputs();

		return data;
	};

	let deleteID;
	let deleteTodoFetch = async (id) => {
		let res = await fetch(`http://127.0.0.1:1337/api/todos/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});
		let data = await res.json();
		console.log(data);
		changed = !changed;
		return data;
	};

	let deleteTodo = async (id) => {
		let res = await axios.delete(`http://127.0.0.1:1337/api/todos/${id}`, {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});
		let data = res.data;
		console.log(data);
		changed = !changed;
		return data;
	};

	function clearInputs() {
		todoTitle = "";
		todoDescription = "";
		todoDone = false;
	}
</script>

<main class="[&>*]:m-4">
	<h1 class="text-5xl">My TODOs</h1>
	<button
		on:click={() => {
			sessionStorage.removeItem("token");
			location.reload();
		}}
		class="rounded bg-blue-400 p-2 hover:bg-blue-300">Clear token</button>

	<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
		<!-- <button
					on:click={async () => {
						myTodos = await getTodos();
						console.log(myTodos);
					}}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">Run GET (axios)</button> -->
		{#key changed}
			{#await getTodos()}
				<p>Loading todos...</p>
			{:then myTodos}
				{#each Object.values(myTodos) as { id, attributes: { title, description, done } }}
					<div class="flex w-[600px] flex-row justify-between rounded-lg bg-blue-200 p-4">
						<div class="flex-col">
							<h2 class="text-2xl">{title}</h2>
							<p>{description}</p>
							<input
								type="checkbox"
								class="h-6 w-6 self-start"
								checked={done}
								disabled
								name=""
								id="" />
						</div>
						<div class="flex w-44 flex-row [&>*]:m-2">
							<button
								on:click={async () => deleteTodo(id)}
								class="rounded-md bg-green-400  p-4 hover:bg-green-500">
								Delete TODO (axios)</button>
							<button
								on:click={async () => deleteTodoFetch(id)}
								class="rounded-md bg-green-400  p-4 hover:bg-green-500">
								Delete TODO</button>
						</div>
					</div>
				{/each}
			{:catch error}
				<!-- <p>Error! {error.status}</p> -->
				{#if error.status === 403}
					<p>You must be logged in to see the TODOs.</p>
					<LoginRegister bind:myUser />
				{/if}
			{/await}
		{/key}
	</div>
	<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
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
			on:click={async () => {
				addTodoFetch();
			}}
			class="rounded-md  bg-green-400  p-4 hover:bg-green-500">
			Run POST</button>
		<button
			on:click={async () => {
				addTodo();
			}}
			class="rounded-md bg-green-400  p-4 hover:bg-green-500">
			Run POST (axios)</button>
	</div>
	<div class="border-1 rounded-md border-green-500 p-2 [&>*]:m-2">
		<input class="rounded border p-1" placeholder="id" type="number" bind:value={todoID} />
		<button
			on:click={async () => {
				updateTodo(todoID);
			}}
			class="rounded-md bg-green-400  p-4 hover:bg-green-500">
			Edit TODO (axios)</button>
		<button
			on:click={async () => {
				updateTodoFetch(todoID);
			}}
			class="rounded-md bg-green-400  p-4 hover:bg-green-500">
			Edit TODO PUT</button>
	</div>
</main>
