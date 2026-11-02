# super-agent
base on super-agent

## 开发任务验收清单 CLI

需要 Node.js 22 或更高版本；仅使用 Node.js 内置模块，无需安装依赖。

在仓库根目录运行：

```sh
node bin/task-checklist.mjs --title "新增登录功能"
```

默认输出 Markdown（也可显式指定 `--format markdown`），可复制到任务记录或保存到文件：

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

### JSON 输出

使用 `--format json` 输出可供程序读取的 JSON，包含任务标题和原四项清单；每项的 `done` 均为布尔值 `false`：

```sh
node bin/task-checklist.mjs --title "新增登录功能" --format json
```

```json
{"title":"新增登录功能","items":[{"label":"实现完成","done":false},{"label":"测试通过","done":false},{"label":"文档更新","done":false},{"label":"人工评审","done":false}]}
```

显式选择 Markdown 时，输出与不传 `--format` 完全一致：

```sh
node bin/task-checklist.mjs --title "新增登录功能" --format markdown
```

格式值区分大小写，仅支持 `markdown` 和 `json`。不支持的格式（如 `--format xml`）、空格式或缺少格式值会向标准错误输出错误信息、以退出码 `1` 退出，且不生成清单。

### 运行测试

使用 Node.js 内置测试框架，不需要第三方测试依赖：

```sh
node --test
```

测试通过子进程执行实际 CLI，覆盖默认及显式 Markdown 的兼容性、JSON 结构和转义、含空格及中文标题、空白处理、缺失或非法输入、不支持的格式、帮助信息及退出码。
