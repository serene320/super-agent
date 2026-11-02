#!/usr/bin/env node
import { parseArgs } from 'node:util';

const help = `用法：node bin/task-checklist.mjs --title "任务标题"

生成包含四项未勾选验收清单的 Markdown。

选项：
  --title <标题>  必填，任务标题（不能为空或仅含空白）
  --help, -h      显示帮助
`;

try {
  const { values } = parseArgs({
    options: {
      title: { type: 'string' },
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

    process.stdout.write(`# ${title}\n\n- [ ] 实现完成\n- [ ] 测试通过\n- [ ] 文档更新\n- [ ] 人工评审\n`);
  }
} catch (error) {
  process.stderr.write(`错误：${error.message}\n使用 --help 查看用法。\n`);
  process.exitCode = 1;
}
