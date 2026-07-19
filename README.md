# Wyze Bundle Builder

A multi-step bundle configurator where users pick cameras, a plan, sensors, and extras — then see a live order summary on the side.

## How to run

-For easer access i deployed it on Vercal on this link: https://task-two-liart.vercel.app/

-using local machine:

```bash
npm install
npm run dev
```

Opens on http://localhost:3000 locally and .



## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 for styling
- No external state management — just React context

## Architecture & decisions

**Layout.**  main braekin points are 600px, 890px, 1500px. 

**Single context for state.** I went with one `BundleContext` that holds selections, quantities, active step, and variant choices. Considered splitting it into smaller contexts but honestly for this size of app it would've added complexity without much benefit.

**Quantity change in review panel.** I desided to make it effect whatever selected variant of the products first with default of firts variants for easier management, when a variant get to 0 will move to next variant, i desided to do that becasue there are no spissifc variants showing in review panal to adjust directly.

**UI decisions.** adding border to selected cards work only by changing colors to not effect the UI spacing, also reserves space for the scrollbar for same reason.
also for sections an steps that are not showed in Figma i compleated them form imagination as i see fit the UI and functionality of the app



## Tradeoffs

- **Layout.** In Figma, there were two frames that could work for wide screens (1735 and 1736). Both have the same size, and each has its own advantages and disadvantages on smaller and larger screens.
For example, frame 1736 displays five products horizontally, which requires more space considering each card is 225px wide. The same challenge applies to frame 1735 because it uses a two-column layout. Regardless of which frame is chosen, there are trade-offs and the UI will not be the same as Figma on some sizes cus figma have 2 designs for wide screens in the same zise.
For this reason, I decided to use frame 1735 for larger screens since its two-column layout provides a better overall structure.

- **No error boundaries.** If the API call fails, you just get an empty page with a console error. Should add proper error states.
- **Tailwind utility classes everywhere.** Makes iteration fast but some of the class strings are getting long. Could extract more into components or use `@apply` but as it is now servs will.

 