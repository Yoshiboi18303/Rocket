module.exports = {
  name: "debug",
  execute: (info) => {
    console.log("RLC-DEBUGGER: ".yellow + `${info}`.blue);
  },
};
