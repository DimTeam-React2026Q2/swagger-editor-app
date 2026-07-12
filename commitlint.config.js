module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["init", "feat", "fix", "refactor", "docs", "style", "chore"],
    ],
    "type-case": [2, "always", "lower-case"],
    "header-max-length": [2, "always", 150],
  },
};
