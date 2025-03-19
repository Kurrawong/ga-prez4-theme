# Commit Conventions and Semantic Versioning

This project uses Conventional Commits to automate semantic versioning and release notes generation.

## Commit Message Format

Each commit message consists of:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types and Their Impact on Semantic Version

| Type | Description | Triggers Version |
|------|-------------|-----------------|
| `feat` | New feature | MINOR (0.1.0) |
| `fix` | Bug fix | PATCH (0.0.1) |
| `BREAKING CHANGE` | Breaking API change (in body) | MAJOR (1.0.0) |
| `perf` | Performance improvement | PATCH |
| `refactor` | Code change that neither fixes a bug nor adds a feature | PATCH |
| `style` | Code style/formatting changes | PATCH |
| `test` | Adding/updating tests | - |
| `docs` | Documentation only changes | - |
| `chore` | Maintenance tasks, dependencies | - |
| `ci` | CI/CD changes | - |
| `build` | Build system changes | - |
| `revert` | Revert previous commit | PATCH |

### Breaking Changes

Breaking changes can be indicated in two ways:
1. Using `BREAKING CHANGE:` in commit body
```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

2. Adding `!` after type/scope
```
feat!: send an email to the customer when a product is shipped
```

### Examples

```
feat(ui): add new button component
fix(api): resolve null pointer in data fetch
docs: update deployment instructions
chore(deps): update dependencies
BREAKING CHANGE: rename auth endpoints
```

## Semantic Versioning

Version numbers follow MAJOR.MINOR.PATCH format:

- **MAJOR** version increments for incompatible API changes
- **MINOR** version increments for new functionality in a backwards compatible manner
- **PATCH** version increments for backwards compatible bug fixes

### Version Bumping Rules

1. Any commit with `BREAKING CHANGE` in body or `!` after type → MAJOR bump
2. `feat` type without breaking change → MINOR bump
3. `fix`, `perf`, `refactor` types → PATCH bump
4. `docs`, `style`, `test`, `chore`, `ci`, `build` → NO version bump

### Special Cases

- Multiple commits in one release: highest-impact change determines version bump
- Breaking changes always trigger MAJOR bump, regardless of type
- Pre-1.0.0 versions may have different rules for breaking changes

## Configuration Files

### commitlint.config.cjs
```javascript
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'body-max-line-length': [2, 'always', 500]
    }
};
```

### .releaserc
```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
```

## Release Process

1. Commits are analyzed by semantic-release
2. Version is determined based on commit types
3. CHANGELOG.md is automatically updated
4. New version is tagged in git
5. Release notes are generated
6. Assets are attached to GitHub release

## Common Mistakes to Avoid

1. Forgetting the type: `update readme` ❌
   - Correct: `docs: update readme` ✅

2. Wrong scope format: `feat(UI)` ❌
   - Correct: `feat(ui)` ✅

3. No colon after type: `feat add button` ❌
   - Correct: `feat: add button` ✅

4. Breaking change not marked: `feat: change auth flow` ❌
   - Correct: `feat!: change auth flow` ✅ 