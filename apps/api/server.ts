import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("", 404); 
});

app.get("/v1/test", (c) => {
  return c.json({ message: "This endpoint works!" });
});

app.notFound((c) => {
  return c.text("", 404);
});

export default {
	port: 8080,
	fetch: app.fetch,
};
