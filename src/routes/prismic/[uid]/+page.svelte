<script>
	export let data;
  import * as prismicH from "@prismicio/helpers";
</script>

<main class="[&>*]:m-4">
	<!-- {#await prismicBlogQuery}
		<p>Loading...</p>
	{:then blogpost}
		<div class="rounded-lg bg-slate-300 p-2">
			<h1 class="text-3xl">{prismicH.asText(blogpost.data.blog_post_title)}</h1>
			<img class="w-96" src={prismicH.asImageSrc(blogpost.data.blog_post_image)} alt="" />
			{@html prismicH.asHTML(blogpost.data.blog_post_text_content)}
		</div>
	{:catch error}
		<pre>{error.message}</pre>
	{/await} -->
  <div class="rounded-lg bg-slate-300 p-2">
    <h1 class="text-3xl">{prismicH.asText(data.document.data.blog_post_title)}</h1>
    <img class="w-96" src={prismicH.asImageSrc(data.document.data.blog_post_image)} alt="" />
    {@html prismicH.asHTML(data.document.data.blog_post_text_content)}
  </div>

	<!-- <pre>{JSON.stringify(data.document, null, 2)}</pre> -->
</main>
