module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    collectCoverage: true,
    collectCoverageFrom: ["src/routes/**/{!(index),}.(js|ts|jsx|tsx)"],
}
