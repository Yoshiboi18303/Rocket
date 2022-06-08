module.exports = {
  name: "post",
  once: false,
  execute: (status) => {
    if (!status) console.log("Last post was successful!".green);
    else console.error(`${status}`.red);
  },
};
