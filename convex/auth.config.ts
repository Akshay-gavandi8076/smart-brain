import { serverEnv } from "../lib/env/server";

const authConfig = {
  providers: [
    {
      domain: serverEnv.CLERK_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
