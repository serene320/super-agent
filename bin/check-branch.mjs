#!/usr/bin/env node

const usage = `Usage: node bin/check-branch.mjs --name <branch>
       node bin/check-branch.mjs --help

Allowed prefixes: feature/, fix/, docs/.
Follow the prefix with lowercase ASCII letters or digits, using single
hyphens between words. Example: fix/a1-b2

Valid names print OK to stdout and exit 0.
Invalid names or arguments print an error to stderr and exit 1.
`;

const args = process.argv.slice(2);

function fail(message) {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

if (args.length === 1 && args[0] === '--help') {
  process.stdout.write(usage);
} else if (args.length !== 2 || args[0] !== '--name') {
  fail('Expected --name <branch> or --help. Run with --help for usage.');
} else {
  const name = args[1];
  // Compare the entire match: even a trailing newline must not be accepted.
  const match = /^(?:feature|fix|docs)\/[a-z0-9]+(?:-[a-z0-9]+)*/u.exec(name);
  if (!name || match?.[0] !== name) {
    fail('Invalid branch name. Use feature/, fix/, or docs/ followed by lowercase letters or digits, with single hyphens between words (e.g. fix/a1-b2).');
  } else {
    console.log('OK');
  }
}
