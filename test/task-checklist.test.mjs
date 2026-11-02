import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cli = fileURLToPath(new URL('../bin/task-checklist.mjs', import.meta.url));

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return result;
}

const expected = '# 新增登录功能\n\n- [ ] 实现完成\n- [ ] 测试通过\n- [ ] 文档更新\n- [ ] 人工评审\n';

for (const [name, args] of [
  ['中文标题及四项未勾选清单', ['--title', '新增登录功能']],
  ['去除标题首尾空白', ['--title', '  新增登录功能  ']],
  ['等号形式的标题参数', ['--title=新增登录功能']],
]) {
  test(name, () => {
    const result = run(args);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, expected);
    assert.equal(result.stderr, '');
  });
}

test('保留标题中的空格', () => {
  const result = run(['--title', 'Add login feature']);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, expected.replace('新增登录功能', 'Add login feature'));
  assert.equal(result.stderr, '');
});

for (const [name, args, message] of [
  ['缺少标题', [], /非空任务标题/],
  ['标题参数缺少值', ['--title'], /--title/],
  ['空标题', ['--title', ''], /非空任务标题/],
  ['等号形式的空标题', ['--title='], /非空任务标题/],
  ['仅含空白的标题', ['--title', ' \t\n '], /非空任务标题/],
  ['未知选项', ['--unknown'], /--unknown/],
  ['多余位置参数', ['--title', '新增登录功能', 'extra'], /extra/],
]) {
  test(name, () => {
    const result = run(args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^错误：/);
    assert.match(result.stderr, message);
    assert.match(result.stderr, /--help/);
  });
}

for (const args of [['--help'], ['-h'], ['--title', '新增登录功能', '--help']]) {
  test(`帮助：${args.join(' ')}`, () => {
    const result = run(args);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /用法：node bin\/task-checklist\.mjs --title/);
    assert.match(result.stdout, /--help/);
    assert.doesNotMatch(result.stdout, /- \[ \]/);
  });
}
