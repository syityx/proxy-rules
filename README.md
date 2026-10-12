# syit Proxy Rules

个人使用的 Shadowrocket / FlClash 分流配置。**规则与机场订阅分离**，不包含机场节点或账号密码。

## 配置文件

| 文件 | 用途 |
| --- | --- |
| [syit_Shadowrocket.conf](./syit_Shadowrocket.conf) | Shadowrocket 远程配置 |
| [syit_FlClash.js](./syit_FlClash.js) | FlClash JavaScript 覆写脚本 |

## 功能

- Claude 独立家宽策略；AI、Google、YouTube、GitHub 等分类分流
- 香港、日本、美国等地区节点自动测速
- Bybit、Polymarket 独立策略（Polymarket 默认香港组）
- 国内直连；保留机场原有规则，并以「漏网之鱼」兜底
- 普通优选组按节点名称过滤家宽及部分高倍率节点

## 使用方法

**Shadowrocket**：将 [Raw 配置链接](https://raw.githubusercontent.com/syityx/proxy-rules/main/syit_Shadowrocket.conf) 导入「配置」，节点订阅仍单独管理。

**FlClash**：先导入并启用机场配置，再进入「配置 → 覆写 → 脚本」，通过 [JS Raw 链接](https://raw.githubusercontent.com/syityx/proxy-rules/main/syit_FlClash.js) 导入并启用，预览确认策略组和规则。GitHub 更新脚本后，如客户端未自动同步，请重新导入。

> 节点分类依据名称，实际出口及平台地域限制需自行核实。仅供个人配置管理使用。
