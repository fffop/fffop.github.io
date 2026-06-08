# π0: 用 flow matching 做连续机器人动作

π0 这篇我感兴趣的点在于：它把 VLA 的动作输出从离散 token 或简单回归，推向了更适合真实操作的连续动作生成。

论文使用预训练 VLM backbone 继承语义能力，再加一个 action expert，用 flow matching 生成连续动作。这个设计很自然：VLM 负责看懂“要做什么”，action expert 负责把它变成精细、流畅、可执行的动作。

## 为什么 flow action 重要

机器人动作不是文本。

如果把动作完全 token 化，模型会更容易接进语言模型框架，但也可能损失精细控制。抓衣服、折叠、插入、双臂协作这类任务非常依赖连续性和接触细节，粗粒度 token 很难表达完整。

flow matching 和 diffusion 类方法的共同优势是：它们可以建模连续轨迹分布，而不是只输出一个点估计。相比 Diffusion Policy，π0 更强调把这种动作生成能力接进 generalist robot policy。

## 和 OpenVLA 的区别

OpenVLA 更像一个开源 VLA 基线，重点是开放、可微调、可作为入口。

π0 更像是下一阶段的问题：当模型真的要做复杂灵巧操作时，动作头应该怎么设计？仅靠语言模型输出动作 token 是否足够？连续动作生成是否会成为主流？

这个对比很有意思。OpenVLA 让我关注数据接口，π0 让我关注动作表示。

## 我会怎么读

读 π0 时我不会只看模型规模和 demo 成功率，而会重点看：

- action expert 如何接在 VLM 后面。
- flow matching 的训练目标和动作 horizon。
- 数据里有多少跨机器人、双臂、移动操作任务。
- 模型在 fine-tune 前后能力变化有多大。

## 对我自己的启发

如果未来做一个 VLA 小项目，我会把动作表示单独当成研究点。相同视觉语言 backbone 下，对比 discrete action、continuous regression、diffusion head、flow head，可能比盲目换更大的模型更有价值。

对具身智能来说，懂语言只是开始。真正难的是把语言落到稳定、连续、可纠错的动作上。
