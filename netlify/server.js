const { createRequestHandler } = require("@remix-run/netlify");
const build = require("@remix-run/dev/server-build");

const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

exports.handler = async (event, context) => {
  return handler(event, context);
};