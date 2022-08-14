const mongoose = require("mongoose");

module.exports = {
    name: "invalidated",
    once: false,
    execute: async () => {
        for(var connection of mongoose.connections) {
            await connection.close()
        }
        process.exit();
    }
};
