const config = require("./jest.config")

config.collectCoverage = false
config.modulePathIgnorePatterns = ["<rootDir>/lib/client.ts"]

module.exports = config
