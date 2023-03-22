export const prerender = false;
import { error } from "@sveltejs/kit";

import createClient from "$lib/prismicio";

// const prismicQuery = client.getByUID("homepage", "homepage");
// const prismicQuery = client.getSingle("homepage");

export async function load({ fetch, request, params }) {
	console.log(params);
	const client = createClient({ fetch, request });
	try {
		const document = await client.getByUID("blog_post", params.uid);
		if (document) {
			return { document };
		}
	} catch (e) {
		throw error(404, {
			message: "Not found",
		});
	}
}
