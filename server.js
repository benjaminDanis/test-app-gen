const cli = require('next/dist/cli/next-start');

cli.nextStart({
  '--port': process.env.PORT || 3000,
  _: [],
});
