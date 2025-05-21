import { z } from "zod";
import { UserSchema } from "../../generated/zod";

export const UsersSchema = z.array(UserSchema);

export const ParamUsernameSchema = z.object({
  username: z.string().min(1),
});
