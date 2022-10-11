module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    modulePathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/__tests__/utils.ts",
    ],
    collectCoverage: false,
}
