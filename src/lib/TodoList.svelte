<script>
	import { fly } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { quintOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import { sendRequest } from "$lib/api";

	export let todos;
	let finishedTodos;
	let unfinishedTodos;
	export let updateTodoList;
	export let deleteTodo;
	let todoTitle;
	let todoDescription;
	let todoDone;
	let edit = [];

	$: {
		finishedTodos = todos.filter((todo) => todo.attributes.done);

		unfinishedTodos = todos.filter((todo) => !todo.attributes.done);
	}

	export function clearInputs() {
		todoTitle = "";
		todoDescription = "";
		todoDone = false;
	}

	let updateTodo = async (id) => {
		const requestData = {
			data: {
				title: todoTitle,
				description: todoDescription,
				done: todoDone,
			},
		};

		const updatedTodo = await sendRequest(
			"PUT",
			`http://127.0.0.1:1337/api/todos/${id}`,
			requestData
		);
		let updatedTodos = todos.map((todo) => {
			if (todo.id === updatedTodo.id) {
				return updatedTodo;
			} else {
				return todo;
			}
		});
		console.log(updatedTodos);
		todos = updatedTodos;
		edit[id] = false;
		clearInputs();
		updateTodoList(updatedTodo);
		return updatedTodo;
	};

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			};
		},
	});
</script>

<div class="border-1 h-[600px] flex-row overflow-auto rounded-md border-green-500 p-2 [&>*]:m-2">
	{#each [finishedTodos, unfinishedTodos] as todos}
		<div>
			{#each Object.values(todos) as { id, attributes: { title, description, done } } (id)}
				<div
					in:receive={{ key: id }}
					out:send={{ key: id }}
					animate:flip={{ duration: 300 }}
					class:bg-green-200={done}
					class="m-2 flex max-w-[600px] flex-row justify-between rounded-lg bg-blue-200 p-4">
					{#if !edit[id]}
						<div class="flex-col">
							<h2 class="p-1 text-2xl">{title}</h2>
							<p class="p-1">{description}</p>
							<input
								on:change={async () => {
									todoTitle = title;
									todoDescription = description;
									todoDone = !done;
									updateTodo(id);
								}}
								type="checkbox"
								class:!bg-green-500={done}
								class="h-6 w-6 self-start"
								checked={done}
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
								class="p-1">✏</button>
							<button on:click={async () => deleteTodo(id)} class="p-1">❌</button>
						</div>
					{:else}
						<div class="flex-col">
							<textarea
								on:input={() => {
									event.target.style.height = event.target.scrollHeight + "px";
								}}
								class="h-[40px] w-60 p-px text-2xl"
								bind:value={todoTitle} />
							<!-- <h2 class="text-2xl">{title}</h2> -->
							<textarea
								cols="54"
								on:input={() => {
									event.target.style.height = event.target.scrollHeight + "px";
								}}
								class="h-[40px]  w-60 p-px "
								bind:value={todoDescription} />

							<input
								type="checkbox"
								class:!bg-green-500={done}
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
								class="p-px">✅</button>

							<button on:click={async () => deleteTodo(id)} class="p-px">❌</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>
