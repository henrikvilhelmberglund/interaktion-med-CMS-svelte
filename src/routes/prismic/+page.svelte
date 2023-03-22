<script>
	import createClient from "$lib/prismicio";
	import * as prismicH from "@prismicio/helpers";

	export let data;

	// const client = createClient();
	// const prismicQuery = client.getByUID("homepage", "homepage");
	// const prismicQuery = client.getSingle("homepage");

	// const prismicBlogQuery = client.getAllByType("blog_post");
</script>

<main class="[&>*]:m-4">
	<h1 class="text-3xl">{prismicH.asText(data.homepage.data.homepage_title)}</h1>
	{@html prismicH.asHTML(data.homepage.data.homepage_text)}

	{#each data.blogposts as blogpost}
		<!-- {JSON.stringify(blogpost.data)} -->
		<div class="rounded-lg bg-slate-300 p-2">
			<h1 class="text-3xl">{prismicH.asText(blogpost.data.blog_post_title)}</h1>
			<img class="w-96" src={prismicH.asImageSrc(blogpost.data.blog_post_image)} alt="" />
			{@html prismicH.asHTML(blogpost.data.blog_post_text_content)}
		</div>
	{/each}
</main>
