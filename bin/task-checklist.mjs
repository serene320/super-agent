#!/usr/bin/env node
import { parseArgs } from 'node:util';

const help = `用法：node bin/task-checklist.mjs --title "任务标题" [--format markdown|json]

生成包含四项未勾选验收清单的 Markdown 或 JSON，默认 Markdown。

选项：
  --title <标题>  必填，任务标题（不能为空或仅含空白）
  --format <格式> 输出格式：markdown（默认）或 json
  --help, -h      显示帮助
`;

try {
  const { values } = parseArgs({
    options: {
      title: { type: 'string' },
      format: { type: 'string', default: 'markdown' },
      help: { type: 'boolean', short: 'h' },
    },
    strict: true,
    allowPositionals: false,
  });

  if (values.help) {
    process.stdout.write(help);
  } else {
    const title = values.title?.trim();
    if (!title) {
      throw new Error('请使用 --title 提供非空任务标题。');
    }

    if (!['markdown', 'json'].includes(values.format)) {
      throw new Error(`不支持的格式：${JSON.stringify(values.format)}；--format 仅支持 markdown 或 json。`);
    }

    const items = ['实现完成', '测试通过', '文档更新', '人工评审']
      .map((label) => ({ label, done: false }));
    const output = values.format === 'json'
      ? JSON.stringify({ title, items })
      : `# ${title}\n\n${items.map(({ label }) => `- [ ] ${label}`).join('\n')}`;
    process.stdout.write(`${output}\n`);
  }
} catch (error) {
  process.stderr.write(`错误：${error.message}\n使用 --help 查看用法。\n`);
  process.exitCode = 1;
}
