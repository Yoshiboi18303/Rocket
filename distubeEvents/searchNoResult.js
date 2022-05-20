module.exports = {
  name: "searchNoResult",
  execute: async (message) => {
    await message.reply({
      content: "No Results Found!",
    });
  },
};
