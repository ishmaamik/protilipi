const { initEdgeStore } = require("@edgestore/server");
const {
  createEdgeStoreNextHandler,
} = require("@edgestore/server/adapters/next/app");
const { z } = require("zod");

// Create context function
function createContext({ req }) {
  // Get the session from your auth provider (example)
  // const session = getSession(req);
  return {
    userId: "1234", // Example user ID
    userRole: "user", // Example role
  };
}

// Initialize EdgeStore
const es = initEdgeStore.context().create();

// Define the EdgeStore router
const edgeStoreRouter = es.router({
  myPublicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    .input(
      z.object({
        type: z.enum(["post", "profile"]),
      })
    )
    // e.g. /post/my-file.jpg
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    // e.g. /123/my-file.pdf
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "admin" },
        },
      ],
    }),
});

// Create EdgeStore Next.js handler
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

// Export GET and POST handlers
module.exports = {
  GET: handler,
  POST: handler,
};
