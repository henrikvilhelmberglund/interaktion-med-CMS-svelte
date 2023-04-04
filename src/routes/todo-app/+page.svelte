<script>
	// Skapa en egen todo-application med Strapi.

	// 1. Skapa en Collection type för todos i Strapi.
	// 2. Varje todo ska ha en titel, beskrivning samt en boolean för om den är utförd eller inte.
	// 3. Gör det möjligt för användaren att kunna skapa upp todos i din applikation.
	// 4. Kräv sedan att användaren loggar in för att kunna se alla todos samt skapa nya samt redigera/ta bort todos .
	// 5. Varje todo ska ha en delete-knapp bredvid. Gör det möjligt för användaren att ta bort todos från API:et.

	// TODO better styling
	// TODO make api calls into one nice function (or two)
	// TODO add auto refresh when logged in

	// 6. Varje todo ska ha en redigera-knapp knapp bredvid. När man klickar på den ska input-fält för att fylla i titel och beskrivning dyka upp, där användaren kan redigera dessa. Gör så att input-fälten är ifyllda med de nuvarande värdena.
	// 7. Skapa funktionalitet för att utföra todos med ett knapptryck.
	// 8. Dela upp dina todos i en “Att göra”-lista samt en “Avklarade ärenden”-lista.

	import axios from "axios";
	import LoginRegister from "$lib/LoginRegister.svelte";
	import { fly, fade } from "svelte/transition";
	import { onMount } from "svelte";

	let myUser = {};

	let addModal = false;
	let todoTitle;
	let todoDescription;
	let todoDone;
	let todoID;
	let changed = false;

	function clickOutside(element) {
		function onClick(event) {
			if (!element.contains(event.target)) {
				console.log("clicked outside of modal - closing!");
				addModal = false;
			}
		}
		document.body.addEventListener("click", onClick);
		return {
			update(newCallbackFunction) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener("click", onClick);
			},
		};
	}

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
		} catch (e) {
			// console.log("threw error");
			error = e.request;
			throw e.request;
		}
	};
	let error;
	let todos = [];
	onMount(async () => {
		todos = await getTodos();
	});

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

		let newTodo = res.data;
		addModal = false;
		clearInputs();
		todos = [...todos, newTodo.data];

		return newTodo.data;
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
		let updatedTodo = res.data;

		let updatedTodos = todos.map((todo) => {
			if (todo.id === updatedTodo.data.id) {
				return updatedTodo.data;
			} else {
				return todo;
			}
		});

		// update the todos state variable with the new array
		todos = updatedTodos;

		console.log("todos!", todos);
		console.log("updated!", updatedTodos);

		edit[id] = false;
		clearInputs();

		return updatedTodo;
	};

	let deleteID;

	let deleteTodo = async (id) => {
		let res = await axios.delete(`http://127.0.0.1:1337/api/todos/${id}`, {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem("token")}`,
			},
		});
		let deleteTodo = res.data;
		todos = todos.filter((todo) => todo.id !== id);
		return deleteTodo;
	};

	function clearInputs() {
		todoTitle = "";
		todoDescription = "";
		todoDone = false;
	}

	let edit = [];
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
		{#if todos}
			{#each Object.values(todos) as { id, attributes: { title, description, done } }}
				<div
					transition:fly={{ y: 30 }}
					class:bg-green-200={done}
					class="flex max-w-[600px] flex-row justify-between rounded-lg bg-blue-200 p-4">
					{#if !edit[id]}
						<div class="flex-col">
							<h2 class="p-1 text-2xl">{title}</h2>
							<p class="p-1">{description}</p>
							<input
								type="checkbox"
								class="h-6 w-6 self-start"
								checked={done}
								disabled
								name=""
								id="" />
						</div>
						<div class="flex w-20 flex-row items-start justify-end [&>*]:m-2">
							<button
								on:click={async () => {
									edit = [];
									todoTitle = title;
									todoDescription = description;
									todoDone = done;
									edit[id] = true;
								}}
								class="p-4">✏</button>
							<button on:click={async () => deleteTodo(id)} class="p-4">❌</button>
						</div>
					{:else}
						<div class="flex-col">
							<textarea
								on:input={() => {
									event.target.style.height = event.target.scrollHeight + "px";
								}}
								class="h-[40px] p-1 text-2xl"
								bind:value={todoTitle} />
							<!-- <h2 class="text-2xl">{title}</h2> -->
							<textarea
								cols="54"
								on:input={() => {
									event.target.style.height = event.target.scrollHeight + "px";
								}}
								class="h-[40px] p-1 "
								bind:value={todoDescription} />

							<input
								type="checkbox"
								class="h-6 w-6 self-start"
								bind:checked={todoDone}
								name=""
								id="" />
						</div>
						<div class="flex w-20 flex-row items-start justify-end [&>*]:m-2">
							<button
								on:click={async () => {
									if (done === todoDone && title === todoTitle && description === todoDescription) {
										edit[id] = false;
										todoTitle = "";
										todoDescription = "";
										todoDone = false;
										return;
									}
									updateTodo(id);
								}}
								class="p-4">✅</button>

							<button on:click={async () => deleteTodo(id)} class="p-4">❌</button>
						</div>
					{/if}
				</div>
			{/each}
		{/if}

		<!-- <p>Error! {error.status}</p> -->

		{#if error && (error.status === 403 || error.status === 401)}
			<p>You must be logged in to see the TODOs.</p>
			<LoginRegister bind:myUser />
		{/if}
		{#if !addModal}
			<div in:fly={{ y: 20 }} class="flex items-center justify-center">
				<button
					on:click={() => {
						event.stopPropagation();
						addModal = true;
					}}
					class="w-14 rounded-full border-4 border-solid border-blue-500 font-sans text-5xl text-blue-500 hover:border-blue-900 hover:bg-blue-900 hover:text-white">
					+</button>
			</div>
		{/if}
		{#if addModal}
			<div in:fade class="fixed inset-0 !m-0 bg-white " />
			<form
				in:fly={{ y: 20 }}
				use:clickOutside
				class="border-1 fixed top-[50%] left-[50%] mx-auto w-[20%]  translate-y-[-50%] translate-x-[-50%] rounded-md border-green-500 p-2 [&>*]:m-2">
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
						addTodo();
					}}
					class="rounded-md bg-green-400  p-4 hover:bg-green-500">
					Add TODO</button>
			</form>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		overflow: overlay;
	}
</style>
