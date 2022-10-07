module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    globalTeardown: "./scripts/globalTeardown.ts",
    modulePathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/__tests__/utils.ts",
    ],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/{!(index),}.(js|ts|jsx|tsx)"],
}
