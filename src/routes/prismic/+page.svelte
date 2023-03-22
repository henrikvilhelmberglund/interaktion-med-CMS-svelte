<script>
	import createClient from "$lib/prismicio";
	import * as prismicH from "@prismicio/helpers";

	const client = createClient();
	// const prismicQuery = client.getByUID("homepage", "homepage");
	const prismicQuery = client.getSingle("homepage");

	const prismicBlogQuery = client.getAllByType("blog_post");
</script>

<main class="[&>*]:m-4">
	{#await prismicQuery}
		<p>Loading...</p>
	{:then prismicResponse}
		<h1 class="text-3xl">{prismicH.asText(prismicResponse.data.homepage_title)}</h1>
		{@html prismicH.asHTML(prismicResponse.data.homepage_text)}
	{:catch error}
		<pre>{error.message}</pre>
	{/await}

	{#await prismicBlogQuery}
		<p>Loading...</p>
	{:then prismicResponse2}
		{#each prismicResponse2 as blogpost}
			<!-- {JSON.stringify(blogpost.data)} -->
			<div class="rounded-lg bg-slate-300 p-2">
				<h1 class="text-3xl">{prismicH.asText(blogpost.data.blog_post_title)}</h1>
				<img class="w-96" src={prismicH.asImageSrc(blogpost.data.blog_post_image)} alt="" />
				{@html prismicH.asHTML(blogpost.data.blog_post_text_content)}
			</div>
		{/each}
	{:catch error}
		<pre>{error.message}</pre>
	{/await}
</main>
