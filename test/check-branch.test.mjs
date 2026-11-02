import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cli = fileURLToPath(new URL('../bin/check-branch.mjs', import.meta.url));

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return result;
}

for (const name of [
  'feature/login', 'fix/a1-b2', 'docs/readme', 'feature/a', 'fix/0',
  'docs/123', 'feature/a-b-c', 'fix/abc123-456def',
]) {
  test(`accepts ${JSON.stringify(name)}`, () => {
    const result = run(['--name', name]);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, 'OK\n');
    assert.equal(result.stderr, '');
  });
}

for (const name of [
  '', 'feature/', 'fix/', 'docs/', 'login', 'chore/login', 'FEATURE/login',
  'feature/Login', 'fix/aB', 'feature/log in', ' feature/login', 'fix/login ',
  'feature/a/b', 'feature//a', '/feature/a', 'fix/-a', 'fix/a--b', 'fix/a-',
  'docs/a_b', 'docs/a.b', 'docs/café', 'docs/中文', 'docs/a\tb',
  'docs/a\nb', 'docs/a\n', 'docs/a\r', 'docs/a\r\n', 'docs/a\u2028',
  'docs/a\u2029', '--help',
]) {
  test(`rejects ${JSON.stringify(name)}`, () => {
    const result = run(['--name', name]);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^Error: Invalid branch name\./u);
    assert.match(result.stderr, /feature\/.*fix\/.*docs\//u);
  });
}

for (const args of [
  [], ['--name'], ['feature/login'], ['--unknown'],
  ['--name=feature/login'], ['--name', 'feature/login', 'extra'],
  ['--name', 'feature/login', '--name', 'fix/a'],
  ['--help', 'extra'], ['--help', '--name', 'feature/login'],
]) {
  test(`rejects invalid arguments ${JSON.stringify(args)}`, () => {
    const result = run(args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^Error: Expected --name <branch> or --help\./u);
  });
}

test('prints help without validating a branch', () => {
  const result = run(['--help']);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /Usage: node bin\/check-branch\.mjs --name <branch>/u);
  assert.match(result.stdout, /--help/u);
  assert.match(result.stdout, /feature\/, fix\/, docs\//u);
  assert.match(result.stdout, /fix\/a1-b2/u);
});
