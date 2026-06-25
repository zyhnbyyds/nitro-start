import { defineHandler } from "nitro";
import { prisma } from "../utils/prisma";

export default defineHandler(async (_event) => {
  const userCount = await prisma.user.count();

  return {
    message: "Hello from API!",
    userCount,
  };
});
