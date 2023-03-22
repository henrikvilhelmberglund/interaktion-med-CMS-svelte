export const prerender = false;
import { error } from "@sveltejs/kit";

import createClient from "$lib/prismicio";

// const prismicQuery = client.getByUID("homepage", "homepage");
// const prismicQuery = client.getSingle("homepage");

export async function load({ fetch, request }) {
	const client = createClient({ fetch, request });
	try {
		const homepage = await client.getByUID("homepage", "homepage");
		const blogposts = await client.getAllByType("blog_post");
		if (homepage && blogposts) {
			return { homepage, blogposts };
		}
	} catch (e) {
		throw error(404, {
			message: "Not found",
		});
	}
}
