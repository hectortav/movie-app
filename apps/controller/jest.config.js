module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    collectCoverage: false,
    collectCoverageFrom: ["src/routes/**/{!(index),}.(js|ts|jsx|tsx)"],
}
