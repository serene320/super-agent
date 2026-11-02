# super-agent

Zero-third-party-dependency Node.js CLI for validating branch names.
Requires Node.js 18 or newer; no installation or package manager is needed.

## Usage

From the repository root:

```sh
node bin/check-branch.mjs --name feature/login
# stdout: OK; exit status: 0

node bin/check-branch.mjs --name fix/a1-b2
# stdout: OK; exit status: 0

node bin/check-branch.mjs --name 'feature/Bad Name'
# stderr: Error: Invalid branch name. ...; exit status: 1

node bin/check-branch.mjs --help
# stdout: usage and rules; exit status: 0
```

Supply exactly `--name <branch>` or `--help`. Missing values, unknown options,
duplicate options and extra arguments are errors (stderr, exit status 1).
The equals form (`--name=feature/login`) is not supported.

## Branch naming rules

- The prefix must be exactly `feature/`, `fix/` or `docs/`.
- The suffix must contain one or more nonempty words of lowercase ASCII
  letters (`a`–`z`) or digits (`0`–`9`), joined by single hyphens.
- No empty suffix, uppercase letters, whitespace (including trailing line
  breaks), extra slashes, leading/trailing hyphens or consecutive hyphens.

Valid: `feature/login`, `fix/a1-b2`, `docs/123`, `docs/update-readme`.

Invalid: `chore/login`, `feature/`, `feature/Login`, `fix/a--b`, `fix/a-`,
`docs/a/b`, `docs/a_b`.

Valid names write exactly `OK` followed by a newline to stdout, leave stderr
empty and exit 0. Invalid names write a clear error to stderr, leave stdout
empty and exit 1. `--help` does not require a branch name.

## Tests

Run the integration suite using the built-in Node.js test runner:

```sh
node --test
```

Tests spawn the actual CLI and check exit status, stdout and stderr for valid
names, invalid names, argument errors and help. No third-party packages or
network access are required.
