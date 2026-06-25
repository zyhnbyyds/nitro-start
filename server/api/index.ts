import { defineHandler } from "nitro";

export default defineHandler((_event) => {
  return { message: "Hello from API!" };
});
