# super-agent
base on super-agent

## 开发任务验收清单 CLI

需要 Node.js 22 或更高版本；仅使用 Node.js 内置模块，无需安装依赖。

在仓库根目录运行：

```sh
node bin/task-checklist.mjs --title "新增登录功能"
```

输出 Markdown，可复制到任务记录或保存到文件：

```markdown
# 新增登录功能

- [ ] 实现完成
- [ ] 测试通过
- [ ] 文档更新
- [ ] 人工评审
```

```sh
node bin/task-checklist.mjs --title "新增登录功能" > checklist.md
node bin/task-checklist.mjs --help
```

`--title` 必须提供非空标题，首尾空白会被去除。缺少标题、空标题、仅含空白的标题或不合法参数会向标准错误输出错误信息，并以退出码 `1` 退出；成功生成清单或显示帮助时退出码为 `0`。`--help`（或 `-h`）无需提供标题。

### 运行测试

使用 Node.js 内置测试框架，不需要第三方测试依赖：

```sh
node --test
```

测试通过子进程执行实际 CLI，覆盖 Markdown 输出、含空格及中文标题、空白处理、缺失或非法输入、帮助信息及退出码。
