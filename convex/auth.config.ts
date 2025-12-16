const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN || process.env.NEXT_PUBLIC_CLERK_DOMAIN,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
