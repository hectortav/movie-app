const config = require("./jest.config")

config.globalTeardown = "./scripts/globalTeardown.ts"
config.collectCoverageFrom = ["src/**/{!(index),}.(js|ts|jsx|tsx)"]

module.exports = config
