# Diffusion Policy: 为什么机器人动作适合用生成模型来做

这篇我会放在具身智能阅读路线的第一组，因为它回答了一个很基础但很关键的问题：机器人策略为什么不应该总被当成一个普通回归器。

传统 behavior cloning 很容易写成 `observation -> action`，看起来像监督学习。但真实操作任务里的动作分布经常不是单峰的：同一个物体可以从左边抓，也可以从右边抓；同一个抽屉可以先调整手腕，也可以先靠近把手。如果用一个简单均值回归，模型可能学到一个“平均动作”，而这个平均动作在物理世界里往往什么都不是。

Diffusion Policy 的核心思路是把动作生成看成一个条件扩散过程。模型不是一次性吐出动作，而是从噪声开始，逐步去噪成一段未来动作序列。这个设定天然适合多模态动作，也适合高维连续动作。

## 我觉得最有用的点

第一，动作是一段序列，不是单步输出。

机器人控制需要连续性。单步动作容易抖，也容易被局部视觉误差影响。Diffusion Policy 生成 action chunk，再用 receding horizon control 执行前面一小段，这个做法很像 MPC：计划一段，执行一点，再根据新观测重算。

第二，扩散模型的优势不只是“生成能力强”。

在机器人这里，它更重要的优势是稳定地表达复杂动作分布。抓取、推拉、双臂协作这类任务经常有多个可行路径，扩散策略可以保留这些可能性，而不是被 MSE 压成一条模糊轨迹。

第三，它给后来的 VLA 动作头提供了参照。

很多 VLA 论文会讨论 discrete action token、continuous regression、diffusion head、flow matching head。读 Diffusion Policy 之后，再看这些动作头的取舍会清楚很多：问题不是“大模型能不能看懂语言”，而是它最后怎么稳定地产生可执行动作。

## 对我自己的启发

如果我要做一个机器人 demo，不应该一开始就追最大 VLA。更现实的路线是先跑通一个 imitation learning baseline，理解 observation、action、dataset、policy、evaluation 的闭环。

Diffusion Policy 适合当这个入口：它足够强，也足够具体。读完之后可以立刻去想数据怎么采、动作频率怎么设、相机视角怎么选、失败视频怎么分析。

## 后续可以做的小实验

- 在 ManiSkill 或 robomimic 上跑一个 Diffusion Policy baseline。
- 对比单步 regression 和 action chunk 的稳定性。
- 观察多模态示范数据里，扩散策略是否真的学到不同抓取路径。
- 把 Diffusion Policy 当作 VLA 低层动作头的 baseline。
