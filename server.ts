import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => " Hello from Elysia!");

export default app.compile();
