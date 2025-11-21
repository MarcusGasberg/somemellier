import * as authSchema from "./schema/auth-schema";
import * as channelsSchema from "./schema/channels-schema";
import * as postsSchema from "./schema/posts-schema";

export default {
	...authSchema,
	...channelsSchema,
	...postsSchema,
};
