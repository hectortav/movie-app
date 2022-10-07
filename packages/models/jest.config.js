module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    globalTeardown: "./scripts/globalTeardown.ts",
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
}
