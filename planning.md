


# Farming Game Detailed Development Plan

> **See also:** [Requirements](requirements.md) | [Crops & Seeds](crops.md) | [Tools](tools.md) | [Game State](game-state.md) | [UI Mockups](ui-mockups.md) | [User Flow](user-flow.md) | [Save & Load](save-load.md) | [Testing](testing.md) | [Glossary](glossary.md) | [Feature: Planting](feature-planting.md) | [Feature: Shop](feature-shop.md)

This plan breaks down the game into many small, easy-to-complete steps. Each step should result in a working version of the game. Reference the linked documents for details and data.

## Project Setup
- Ensure Vite + TypeScript project is running.
- Set up folder structure for code, assets, and documentation.
- Add a favicon and update the page title.
- Goal: Project builds and runs in the browser.

## Layout & UI Foundation
- Create the main HTML structure: house, grass field, and a grid for plots ([UI Mockups](ui-mockups.md)).
- Add basic CSS for layout and responsiveness.
- Add a header with the game title and coin balance.
- Add a sidebar or footer for inventory and tools.
- Goal: The game screen looks like a farm (no interactivity yet).

## Plots: Display & Interactivity
- Show a static grid of plots (e.g., 3x3 or 5x5).
- Use placeholder visuals for empty plots.
- Make each plot clickable and highlight on hover/click.
- Add a tooltip or info popup for each plot.
- Goal: Plots are visible and clickable.

## Player Inventory & Tools
- Display initial seeds and tools ([crops.md](crops.md), [tools.md](tools.md)).
- Show coin balance and update it in real time.
- Add tooltips for each inventory/tool item.
- Goal: Player can see what they have at all times.

## Planting Seeds
- Add a UI to select a seed ([feature-planting.md](feature-planting.md)).
- Allow planting a seed in an empty plot.
- Show a seed icon or image in the plot.
- Deduct seed from inventory and update UI.
- Show error if no seeds are available.
- Goal: User can plant seeds in plots.

## Crop Growth
- Make crops grow over time (change icon or image after a few seconds, [game-state.md](game-state.md)).
- Show different visuals for each growth stage (seed, sprout, mature).
- Add a timer or progress bar for each plot.
- Goal: Planted seeds grow into crops automatically.

## Watering & Composting
- Add buttons to water or compost a plot ([tools.md](tools.md)).
- Watering/composting makes crops grow faster.
- Show a water or compost icon/animation when used.
- Track watered/composted status in game state.
- Goal: User can help crops grow faster and see feedback.

## Harvesting Crops
- Allow user to harvest fully grown crops.
- Remove the crop from the plot and add it to inventory.
- Show a harvest animation or effect.
- Update inventory and coin balance.
- Goal: User can harvest crops and see them in inventory.

## Selling Crops
- Add a button to sell crops from inventory for coins.
- Show the coin balance on the screen and update after selling.
- Add a confirmation dialog for selling.
- Goal: User can sell crops and earn coins.

## Shop: Buying Seeds & Tools
- Add a shop UI to buy seeds and tools with coins ([feature-shop.md](feature-shop.md)).
- Display available seeds/tools, prices, and player balance.
- Update inventory and coin balance after purchase.
- Show error if not enough coins.
- Goal: User can buy more seeds/tools from the shop.

## Expanding the Farm
- Allow user to use coins to add more plots to the field.
- Animate the addition of new plots.
- Update the grid layout dynamically.
- Goal: User can expand the farm as they earn more coins.

## Save & Load Progress
- Save game state to localStorage ([save-load.md](save-load.md)).
- Load saved game on startup.
- Add a manual save/load button.
- Show a message when progress is saved/loaded.
- Goal: Player progress is persistent.

## UI Polish & Accessibility
- Add simple animations and sound effects.
- Polish the UI for mobile and desktop.
- Add keyboard navigation and ARIA labels for accessibility.
- Add a help/about modal with instructions ([glossary.md](glossary.md)).
- Goal: Game is easy and fun to use for everyone.

## Advanced Features & Extras
- Add crop withering if not watered.
- Add random events (weather, pests).
- Add decorations and achievements.
- Add tool upgrades and new crop types.
- Add a settings menu (sound, difficulty, etc.).
- Goal: Game feels complete, deep, and replayable.

## Testing & QA
- Test each feature manually ([testing.md](testing.md)).
- Add unit tests for core logic (future).
- Track bugs and issues in a bug list or project board.
- Goal: Game is stable and bug-free.

---
Update this plan as you progress or add new features.
