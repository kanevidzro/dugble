import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Dugble API!");
});

export default {
	port: 8080,
	fetch: app.fetch,
};
