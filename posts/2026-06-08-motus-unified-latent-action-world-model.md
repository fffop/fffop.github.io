# Motus: 把 VLA、World Model 和 latent action 放进一个系统

Motus 是这组论文里我最感兴趣的一篇，因为它试图把几个长期分开的能力合起来：理解、视频生成、world model、inverse dynamics、VLA action prediction。

它的问题意识很直接：一个 embodied agent 本来应该是统一系统，但现在很多方法把 VLM、world model、policy、video generation 拆开训练。拆开之后，每个模块都能解释，但整体不一定能共享数据和运动先验。

## Motus 想统一什么

论文把能力拆成几类：

- VLA：从当前观测和语言生成动作。
- World Model：给定当前观测和动作，预测未来观测。
- Inverse Dynamics：从前后观测反推动作。
- Video Generation：根据观测和语言生成未来视频。
- Video-Action Joint Prediction：同时预测未来视频和动作。

Motus 用 Mixture-of-Transformers 把 understanding、video generation、action expert 放进一个架构里，再用 UniDiffuser-style scheduler 在不同生成模式之间切换。

## 我最关注 latent action

Motus 最有意思的不是“统一”这个词，而是 latent action。

机器人数据少，而且不同机器人 action space 不统一；但视频很多，尤其是人类第一视角视频、网络视频、机器人无任务视频。这些视频没有真实动作标签，却包含大量运动信息。

Motus 试图用 optical flow 学 latent action，从像素变化里抽取“运动先验”。这很关键：如果 latent action 真能跨 embodiment，它就可能缓解机器人动作标签稀缺和动作空间不统一的问题。

当然这里也有风险。Optical flow 学到的是视觉变化，不一定等价于可控动作。它到底是控制语义，还是外观运动编码，需要实验进一步验证。

## 为什么它适合接在 DreamerV3 后面读

DreamerV3 让我理解 world model：智能体可以学 latent dynamics，然后在想象里训练或评估。

Motus 往前走了一步：它不只想预测未来，还想把未来预测、动作生成、逆动力学和视频生成统一起来。对 VLA 来说，这意味着模型不只是回答“下一步动作是什么”，还可以回答“这个动作之后会看到什么”。

## 对我自己的启发

Motus 对个人项目的启发不一定是立刻训练 8B 级模型。更现实的是拆出小问题：

- optical-flow latent action 和真实 action 的相关性有多强？
- 用视频预测能不能提前发现抓取失败？
- world model 能不能给 VLA action candidate 打分？
- 在仿真里比较纯 policy 和 world-model-assisted policy。

我觉得这篇适合作为长期方向参考。它不一定是最容易复现的，但它把具身智能下一步要解决的矛盾摆得很清楚：数据异构、动作不统一、理解和控制割裂。
