![](content/ai-writings/llm-internals/_img/img-01.png)

*Token-budget-aware reasoning, from TALE (2024) to adaptive thinking (2026): the math, the benchmarks, and a controller you can build this weekend.*

![](content/ai-writings/llm-internals/_img/img-02.png)

Reasoning models got smart by thinking out loud. Then they got expensive by *never shutting up*.

In late 2024, a paper called **TALE** (Token-Budget-Aware LLM Reasoning) made a simple observation: if you tell a model “use fewer than N tokens,” it mostly listens, and you save a fortune. That was the opening move. Since then the field has moved from *asking* models to be brief, to *training* them to be brief, to training them to decide **whether to think at all**.

This post is the 2026 version of that story. We’ll cover:

- Why reasoning tokens dominate your bill, and why more thinking can make answers *worse*
- TALE, explained properly, including the weird “token elasticity” effect
- A single economic equation that explains almost every method since then
- The 2025–2026 toolbox: budget forcing, early exit, RL length control, learned “don’t think” modes, and API effort knobs
- A new controller, **Marginal-Value Thinking (MVT)**, that combines the best ideas into something you can ship

Grab a coffee. Unlike your reasoning model, I’ll try to stop once the point is made.

## 1. The bill nobody reads carefully

Every call to a reasoning model is priced roughly like this:

![](content/ai-writings/llm-internals/_img/img-03.png)

where *x* is your prompt, *z_think* is the hidden chain of thought and *y* is the visible answer. The important part: **thinking tokens are billed as output tokens**, which are usually the most expensive tokens in the price list. On a hard problem, *z_think* can be 10–100× longer than *y*. Your “one-line answer” may cost as much as a short essay.

Worse, a lot of that thinking is wasted. The 2024 study with the wonderful title *“Do NOT Think That Much for 2+3=?”* (Chen et al.) showed o1-style models spending hundreds of tokens and several rounds of self-verification on trivial arithmetic. The TMLR survey *“Stop Overthinking”* (Sui et al., 2025) catalogued dozens of such cases.

And in 2025 it got stranger. *Inverse Scaling in Test-Time Compute* (Gema et al., arXiv:2507.14417) built tasks where **longer reasoning lowered accuracy**: models got distracted by irrelevant details, over-fit to how a problem was framed, or drifted from sensible assumptions to spurious ones. So “think more” is not free, and it isn’t always better.

![](content/ai-writings/llm-internals/_img/img-04.png)

## 2. TALE, the idea that started the budget era

TALE (Han et al., arXiv:2412.18547) asked a clean question: **for a given question, what is the smallest token budget β that still gives the right answer?**

### 2.1 Budgets in the prompt work… mostly

Take a normal chain-of-thought prompt and add “use less than β tokens.” The model shortens its reasoning. Not perfectly (ask for 50 and you might get 86) but directionally, yes. That alone showed that a large share of CoT tokens are **redundant**.

![](content/ai-writings/llm-internals/_img/img-05.png)

### 2.2 Searching for the optimal budget

Formally, TALE wants:

![](content/ai-writings/llm-internals/_img/img-06.png)

Here M(x, β) is the model’s answer when prompted with budget β, y is the correct label, and T(·) counts output tokens. The search is a binary search: run vanilla CoT once, use its length as the upper bound, then keep halving the budget while the answer stays correct.

### 2.3 The twist: token elasticity

Here is the surprising part. Keep shrinking β and at some point **the number of tokens the model actually writes goes up**. Squeeze too hard and the model seems to rebel: it ignores the budget, or it writes a long, anxious explanation of why it is being brief.

That is why the second line of the feasibility check above matters. A smaller budget is only “feasible” if it keeps the answer correct **and** actually lowers real token usage compared to the previous step. The search stops at the bottom of the U-curve, not at the smallest budget that happens to work.

We can capture the U-shape with a simple toy model (my own, used for intuition, not taken from the paper):

![](content/ai-writings/llm-internals/_img/img-07.png)

The β term is compliance: you ask for β, you get about β. The κ/β term is *rebellion*: the tighter the budget, the more overhead the model produces fighting it. Minimize and you get a sweet spot at β† = √κ. Any budget below the knee is a trap.

![](content/ai-writings/llm-internals/_img/img-08.png)

### 2.4 Estimating the budget without an oracle

At inference time you don’t know the right answer, so you can’t binary-search. TALE therefore *predicts* the budget:

- **Zero-shot estimator:** ask the LLM itself, “how many tokens would you need for this?” Like a person glancing at an exam question and knowing it’s a two-minute problem.
- **Regression estimator:** fine-tune a small model (e.g. LLaMA-3–8B) on (question → searched optimal budget) pairs.
- **Internalization:** fine-tune the reasoning model itself on budget-constrained answers so that brevity becomes the default behaviour.

**Result:** on math benchmarks with GPT-4o-mini, TALE cut output tokens by about **68.64% on average with less than a 5% accuracy drop** compared to vanilla CoT. Their in-range analysis found about 60% of estimated budgets landed inside the ideal window, which is good but leaves room for improvement.

TALE’s real contribution wasn’t the prompt trick. It was reframing reasoning length as a **per-question decision**. Everything since is a better way of making that decision.

## 3. One equation to explain it all

Let’s step back and treat thinking the way an economist would. Each extra thinking token has a price, and it buys some probability of being correct. So:

![](content/ai-writings/llm-internals/_img/img-09.png)

A(b) is expected accuracy after b thinking tokens. λ is the **shadow price of a token**: the per-token cost p_out divided by V, the value you place on a correct answer. A₀ is accuracy without thinking, Δ is the maximum gain thinking can add (so the ceiling is A∞ = A₀ + Δ), and τ is a difficulty scale (the number of tokens needed to capture about 63% of that gain). A saturating curve like this matches the diminishing returns seen across the test-time-scaling literature.

Set the derivative to zero:

![](content/ai-writings/llm-internals/_img/img-10.png)

That third line is worth a pause: **at the optimum, the accuracy you give up is exactly λτ.** Cheaper tokens or easier problems mean you give up almost nothing.

Now ask how the optimal budget changes with difficulty:

![](content/ai-writings/llm-internals/_img/img-11.png)

This gives three regimes, and each matches something the research community found empirically:

1. **Easy problems** (small τ): small budget. This is TALE and Chain of Draft territory.
2. **Medium-to-hard problems:** the budget grows, and peaks at τ = Δ/(eλ). This is where long reasoning really pays.
3. **Problems too hard for the current price** (τ ≥ Δ/λ): **b* = 0. Don’t think.** This is exactly the “NoThinking” and AdaptThink finding, and it matches Plan-and-Budget’s observation that extremely hard sub-problems should get *less* budget because returns flatten out.

![](content/ai-writings/llm-internals/_img/img-12.png)

**A concrete λ.** Suppose output tokens cost $10 per million (p_out = 10⁻⁵ dollars per token) and a correct answer is worth $0.10 to your product. Then λ = 10⁻⁴, the value in the chart. The largest budget any question should ever get is Δ/(eλ) ≈ 1,840 tokens. Now make the task a contract review where a correct answer is worth $10: λ drops to 10⁻⁶ and the ceiling rises to about 184,000 tokens. **Same model, same question type, a 100× different optimal budget**, just because the value of the answer changed. That’s why a single global “reasoning effort” setting is always wrong for someone.

![](content/ai-writings/llm-internals/_img/img-13.png)

## 4. The 2025–2026 toolbox

Everything published since TALE pulls one of four levers:

![](content/ai-writings/llm-internals/_img/img-14.png)

![](content/ai-writings/llm-internals/_img/img-15.png)

### 4.1 Prompt lever: Chain of Draft

**Chain of Draft** (Xu et al., arXiv:2502.18600) asks the model to write each reasoning step as a terse draft, the way you’d scribble “20 − 12 = 8 → answer 8” on scratch paper instead of writing full sentences. Reported result: it **matches or beats CoT while using as little as 7.6% of the tokens** on some tasks. It costs nothing to adopt, but it’s a style prompt, so there’s no guarantee on length.

### 4.2 Decode lever: budget forcing, early exit, and skipping the thinking

**s1 budget forcing** (Muennighoff et al., arXiv:2501.19393) controls length at decode time. To cut thinking short, force the end-of-thinking token. To extend it, suppress that token and append “Wait”. With just 1,000 curated training examples, s1–32B went from **50% to 57% on AIME24** by extrapolating with budget forcing. So “Wait” isn’t always waste: when the marginal token is valuable, it’s the right move. The question is when.

**DEER, dynamic early exit** (Yang et al., arXiv:2504.15895) answers that question at inference time. At natural transition points in the reasoning (such as a new “Wait” or a new paragraph), it has the model try a trial answer and checks its confidence. If confidence is high enough, it stops. Across 11 reasoning models and 10 benchmarks: **19.1–80.1% shorter reasoning with +0.3 to +5.0% accuracy**, and no retraining. Stopping earlier *raised* accuracy, which is the inverse-scaling effect showing up in practice.

**NoThinking** (Ma et al., arXiv:2504.09858) takes it further: pre-fill an empty thinking block and just answer. Under tight budgets this wins outright, **51.3 vs 28.9 on AMC23 at about 700 tokens**, and sampling several no-think answers in parallel and picking the best matches thinking-based accuracy with **up to 9× lower latency**.

### 4.3 Train lever: RL that knows the price of a token

**L1 / LCPO** (Aggarwal & Welleck, arXiv:2503.04697) puts the target length in the prompt (“Think for N tokens”) and trains with RL using a reward that combines correctness and length:

![](content/ai-writings/llm-internals/_img/img-16.png)

Look at L1-Exact through the lens of Section 3. α = 3×10⁻⁴ is **a λ in disguise**: missing the target by 1,000 tokens costs 0.3 of a correct answer. L1-Max turns the target into a soft ceiling instead. The results were striking: **20–25% absolute (100–150% relative) gains over s1 at 512 and 1,024-token budgets**, and a 1.5B L1 model beating GPT-4o by about 2% at the same reasoning length.

**AdaptThink** (Zhang et al., arXiv:2505.13417) learns the b* = 0 branch directly. The policy picks *Thinking* or *NoThinking* for each question, trained with a constrained objective (prefer NoThinking as long as accuracy doesn’t drop) and importance sampling so both modes keep getting explored. On DeepSeek-R1-Distill-Qwen-1.5B: **53% shorter responses and +2.4% accuracy**.

**e1 / Adaptive Effort Control** (Kleinman et al., arXiv:2510.27042) fixes a practical problem with absolute budgets: “1,000 tokens” is generous for one question and stingy for another. So it makes the budget *relative*:

![](content/ai-writings/llm-internals/_img/img-17.png)

Here r is a user-set effort ratio compared with the average length of correct solutions to that same problem. Reported: **2–3× shorter chains of thought** at or above baseline accuracy, with a dial that behaves monotonically (more effort gives more tokens and more accuracy), trained on math but transferring to other domains.

**Draft-Thinking** (Cao et al., arXiv:2603.00578, 2026) combines Chain-of-Draft style SFT with a two-stage RL curriculum that gradually relaxes length caps. On MATH500 it reports an **82.6% reduction in reasoning tokens (≈5,668 → 986) for a 2.6% accuracy drop**, trained on only 847 samples.

**Learning When to Think** (Kassenaar, Yang & François-Lavet, arXiv:2608.20256, 2026) gives the model three modes, NoThink, Short (≤3,000 tokens) and Long, chosen by its **first generated token**, with routing learned end-to-end inside GRPO. Hard per-mode caps stop the model from collapsing into one mode. On MATH-500: **41% shorter responses** (0.782 vs 0.796 accuracy), 76% fewer tokens on GSM8K at *higher* accuracy, and it learned to route by difficulty without ever being told the difficulty.

### 4.4 System lever: budgets across sub-questions and turns

Real workloads are rarely one question. They are agent loops, multi-hop plans and multi-turn chats. **Plan-and-Budget** (arXiv:2505.16122, ICLR 2026) breaks a query into sub-questions and front-loads the budget with a decaying schedule, justified by an uncertainty model where epistemic uncertainty falls as a power law in tokens. It also proposes a metric worth borrowing:

![](content/ai-writings/llm-internals/_img/img-18.png)

Squaring accuracy means you can’t game the metric by being short and wrong. Reported gains: up to +70% accuracy, −39% tokens, and +193.8% E³ on agent planning.

**TAB, Turn-Adaptive Budgets** (Jali, Nayak & Joshi, arXiv:2604.05164, 2026) models multi-turn reasoning as a sequential decision problem and trains a GRPO policy to spend a global budget across turns: **up to 35% token savings** at equal accuracy, and about 40% when future sub-questions are visible in advance.

### 4.5 The API lever: effort is now a product setting

The big providers turned all of this into product settings. OpenAI exposes a reasoning_effort parameter, and Google’s Gemini exposes thinking budgets or levels. Anthropic’s current API goes furthest toward the AdaptThink idea: with thinking: {type: "adaptive"} the model decides **per request** whether to think and how much, steered by an effort level (low through max). The older fixed budget_tokens setting is deprecated in favour of it, and max_tokens remains the hard cap.

In other words, the “don’t think when it isn’t worth it” branch from Section 3 has become a default behaviour. Your job has changed from setting a budget to setting a **price**.

![](content/ai-writings/llm-internals/_img/img-19.png)

## 5. A new controller: Marginal-Value Thinking (MVT)

Each method above handles one piece of the problem well:

- TALE **predicts** a budget up front, but it’s blind once generation starts.
- DEER **watches** confidence while generating, but it has no idea what a token costs.
- AdaptThink and 3-mode routing **gate** thinking, but only at a coarse level and only after RL training.
- TALE’s elasticity finding warns that **squeezing too hard backfires**, yet most controllers ignore it.

MVT is my proposal for combining them into one inference-time controller built on the economics from Section 3. It needs no training, works with any model that can stream its reasoning, and takes one input from you: **λ, the price of a token relative to the value of a correct answer.**

![](content/ai-writings/llm-internals/_img/img-20.png)

**① Price the question before thinking.** Use a cheap estimator (TALE’s zero-shot prompt, or a small regressor) to predict τ̂ and Δ̂. If Δ̂ ≤ λτ̂, thinking can’t pay for itself: answer directly. That’s AdaptThink’s gate, derived from first principles instead of learned.

**② Start with an analytical soft budget.** Set b₀ = τ̂·ln(Δ̂/λτ̂) and pass it as a hint, clamped so it never falls below the elasticity knee β† (measure the knee once per model with a small sweep). The hint shapes the *style* of reasoning; it isn’t a hard cutoff.

**③ Stop when the marginal token stops paying.** Every k tokens, probe a trial answer (as DEER does) and estimate confidence p̂ₜ, for example from agreement across a few short probes. Then apply the stopping rule from Section 3:

![](content/ai-writings/llm-internals/_img/img-21.png)

The first condition is the discrete version of A′(b) = λ: stop once the last k tokens bought less accuracy than they cost. The γ floor stops you quitting early on a confidently wrong plateau.

```
import math
def mvt(llm, q, lam, k=256, gamma=0.8,
        b_max=16_000, probes=4, knee=128):
    # 1) price the question (TALE-style estimator)
    tau, delta = estimate_difficulty(llm, q)
    if delta <= lam * tau:
        return llm.answer(q, thinking=False)  # b* = 0
    # 2) analytical soft budget, floored at the knee
    b0 = max(tau * math.log(delta / (lam * tau)), knee)
    trace, p_prev, used = "", 0.0, 0
    # 3) think in chunks; stop when a token stops paying
    while used < b_max:
        chunk = llm.think(q, trace, max_new_tokens=k,
                          hint=f"~{int(b0)} tokens")
        trace += chunk
        used += count_tokens(chunk)
        answers = [llm.answer_from(q, trace)
                   for _ in range(probes)]
        p = agreement(answers)            # confidence
        if (p - p_prev) / k < lam and p >= gamma:
            break
        p_prev = 0.7 * p_prev + 0.3 * p   # EMA smoothing
    return majority(answers)
```

**Honest caveats.** MVT is a design, not a benchmarked paper. I haven’t measured it against DEER or the RL methods. Three things need care in practice:

1. **Probing isn’t free.** Each checkpoint costs about probes × (answer length) tokens. Choose k so that probing adds less than about 10% overhead, or use the token log-probs of a single probe instead of agreement across several.
2. **Confidence is not calibration.** Reasoning models can be confidently wrong. Calibrate γ on a validation set, per task family.
3. **τ̂ and Δ̂ are noisy.** TALE’s own estimator landed in the ideal range only about 60% of the time. The closed-loop stopping rule in step ③ exists precisely so that a bad prior doesn’t sink you.

The main takeaway isn’t this particular code. It’s the design principle: **budget from a price, gate from the price, stop from the price.** A single number, λ, ties together decisions that the literature treats as separate problems.

## 6. A practical playbook for 2026

1. **Write down λ.** Divide your output-token price by what a correct answer is worth, per feature. Your search box and your legal-review agent should not share a setting.
2. **Use provider adaptive modes first.** They already implement the “don’t think” gate. Lower effort for high-volume, low-value traffic; raise it where a wrong answer is expensive.
3. **Add Chain-of-Draft-style instructions** for structured tasks. Terse reasoning is a free win.
4. **Never set budgets below the elasticity knee.** Sweep a few budgets on 50 examples and plot tokens written vs. budget requested. If the curve turns up, you’ve found your floor.
5. **Evaluate across reasoning lengths, not at one setting.** Inverse scaling means “more effort” can hurt some tasks. Track accuracy-per-dollar or E³ = A²/T, not accuracy alone.
6. **If you train models,** put λ in the reward (LCPO-style), give the policy a no-think option (AdaptThink / 3-mode routing), and prefer relative budgets (e1) over absolute ones.

![](content/ai-writings/llm-internals/_img/img-22.png)

## 7. Open problems worth your weekend

- **Calibrated confidence mid-thought.** Every early-exit method depends on it, and it still isn’t reliable.
- **Budgeting in agent loops.** Tool calls, retries and verification have their own costs. TAB and Plan-and-Budget are first steps, but a full λ-aware agent planner doesn’t exist yet.
- **Is the thinking faithful?** Compressing reasoning can hide the steps that actually drove the answer, which matters for safety and auditing.
- **Learning τ from the model’s own internals.** Hidden-state probes may predict difficulty better than asking the model in words.

## Conclusion

In 2024 the question was “can we make the model think less?” TALE showed the answer was yes, and that pushing too hard backfires. In 2025 the field learned to *train* length control and to let models skip thinking entirely. In 2026, thinking is a per-request, per-turn and per-sub-question allocation problem, and the major APIs let the model decide.

The thread running through all of it fits in one line:

> ***Think until the next token is worth less than it costs. Then stop.***

If this was useful, follow for more deep dives on LLM systems, and tell me in the comments what λ your product runs at.

## References

1. Han et al. *Token-Budget-Aware LLM Reasoning* (TALE). [arXiv:2412.18547](https://arxiv.org/abs/2412.18547) · [code](https://github.com/GeniusHTX/TALE)
2. Chen et al. *Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs.* [arXiv:2412.21187](https://arxiv.org/abs/2412.21187)
3. Sui et al. *Stop Overthinking: A Survey on Efficient Reasoning for LLMs* (TMLR 2025). [arXiv:2503.16419](https://arxiv.org/abs/2503.16419)
4. Gema et al. *Inverse Scaling in Test-Time Compute.* [arXiv:2507.14417](https://arxiv.org/abs/2507.14417)
5. Muennighoff et al. *s1: Simple Test-Time Scaling.* [arXiv:2501.19393](https://arxiv.org/abs/2501.19393)
6. Xu et al. *Chain of Draft: Thinking Faster by Writing Less.* [arXiv:2502.18600](https://arxiv.org/abs/2502.18600)
7. Aggarwal & Welleck. *L1: Controlling How Long a Reasoning Model Thinks with RL.* [arXiv:2503.04697](https://arxiv.org/abs/2503.04697)
8. Ma et al. *Reasoning Models Can Be Effective Without Thinking.* [arXiv:2504.09858](https://arxiv.org/abs/2504.09858)
9. Yang et al. *Dynamic Early Exit in Reasoning Models* (DEER). [arXiv:2504.15895](https://arxiv.org/abs/2504.15895)
10. Zhang et al. *AdaptThink: Reasoning Models Can Learn When to Think.* [arXiv:2505.13417](https://arxiv.org/abs/2505.13417)
11. *Plan and Budget: Effective and Efficient Test-Time Scaling on Reasoning LLMs.* [arXiv:2505.16122](https://arxiv.org/abs/2505.16122)
12. Kleinman et al. *e1: Learning Adaptive Control of Reasoning Effort.* [arXiv:2510.27042](https://arxiv.org/abs/2510.27042)
13. Cao et al. *Draft-Thinking: Learning Efficient Reasoning in Long Chain-of-Thought LLMs.* [arXiv:2603.00578](https://arxiv.org/abs/2603.00578)
14. Jali, Nayak & Joshi. *Not All Turns Are Equally Hard: Adaptive Thinking Budgets for Efficient Multi-Turn Reasoning.* [arXiv:2604.05164](https://arxiv.org/abs/2604.05164)
15. Kassenaar, Yang & François-Lavet. *Learning When to Think: Adaptive Reasoning for Test-Time Compute Allocation.* [arXiv:2608.20256](https://arxiv.org/abs/2608.20256)
16. Anthropic. *Adaptive thinking* (API docs). [platform.claude.com](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
