# Goal Trader

A mobile-first, World Cup themed soccer game where every goal grows your virtual portfolio. Built with React, TypeScript, Tailwind CSS, and Vite. Runs entirely client-side — no backend, save state lives in `localStorage`.

## Gameplay

1. Tap once to lock the **power** meter.
2. Tap again to lock the **accuracy** meter.
3. Land a **Goal** (+$100), **Great Goal** (+$250), or **Top Corner** (+$500) — or **Miss**.
4. Consecutive goals build a **Bull Market** multiplier; a miss triggers a **Drawdown** and resets your streak.
5. Win matches (best of 5 shots) to advance through the World Cup knockout bracket against tougher opponents.
6. Unlock cosmetic stadiums, balls, jerseys, and celebrations as you win rounds. Earn finance-themed achievements along the way (bragging rights only — no gameplay effect).

## Develop

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint
```
