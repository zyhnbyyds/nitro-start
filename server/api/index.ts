import { defineHandler } from "nitro";
import { count } from "drizzle-orm";
import { db } from "../utils/db";
import { users } from "../db/schema";

export default defineHandler(async (_event) => {
  const [result] = await db.select({ count: count() }).from(users);

  return {
    userCount: result.count,
  };
});
