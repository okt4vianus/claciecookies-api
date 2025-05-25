import { z } from "@hono/zod-openapi";
// import { z } from "zod";
import { UserSchema } from "../../generated/zod";

export const UsersSchema = z.array(UserSchema);

// export const ParamUserNameSchema = z.object({
//   username: z.string().min(3, "Username is required"),
// });

export const ParamUserIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), //User ID or Username"
});
