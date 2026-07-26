const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN!,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
