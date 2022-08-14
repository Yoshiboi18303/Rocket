module.exports = {
  name: "nodeError",
  execute: (client, Logger, node, error) => {
    Logger.error(`${node.options.identifier} had an error: ${`${error}`.bold}`);
  },
};
