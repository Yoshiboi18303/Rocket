module.exports = {
  name: "debug",
  execute: (info) => {
    console.log("ROCKET-DEBUGGER: ".yellow.bold + `${info}`.blue);
  },
};
