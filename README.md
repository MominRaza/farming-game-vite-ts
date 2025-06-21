# Farming Game

Welcome to the Farming Game project! This repository contains all the documentation and code for building a 2D farming game using HTML, CSS, and TypeScript.

## 🎯 **NEW: Easy Seed Extension System!**

This game now features a **centralized seed configuration system** that makes adding new seeds incredibly easy! 

### ✨ **Add a New Seed in Just 4 Steps:**
1. Add crop type to `TileTypes.ts`
2. Add configuration to `SeedConfig.ts` 
3. Create painter function in `CropPainter.ts`
4. Update renderer in `TileRenderer.ts`

**That's it!** Everything else (shop prices, growth times, tool generation, UI integration) happens automatically!

🌽 **Example**: We added corn seeds as a demonstration - check out the code to see how simple it is!

📖 **Full Guide**: See [Adding New Seeds Guide](docs/adding-new-seeds.md) for complete instructions.

## 📚 Documentation Overview

- [Requirements Document](requirements.md): High-level overview and core features of the game.
- [Development Roadmap](planning.md): Step-by-step milestones for building the game.
- [Crops and Seeds](crops.md): List of all crops and seeds, including properties and initial player inventory.
- [Tools](tools.md): All tools available to the player, their uses, and how to obtain them.
- [Game State & Data Model](game-state.md): How game data is structured and stored.
- [UI Mockups & Wireframes](ui-mockups.md): Layout ideas and wireframes for the main screens.
- [User Flow & Gameplay Loop](user-flow.md): Main gameplay loop and player actions.
- [Save & Load System](save-load.md): How the game saves and loads player progress.
- [Testing & QA Plan](testing.md): Manual and automated testing plans, bug tracking.
- [Glossary](glossary.md): Definitions of key terms used in the game and documentation.

### Feature Breakdowns
- [Feature: Planting](feature-planting.md): Detailed breakdown of the planting feature.
- [Feature: Shop](feature-shop.md): Detailed breakdown of the shop feature.

## 🗂️ Documentation Hierarchy

```
README.md
├── requirements.md         # Game overview and features
├── planning.md             # Development roadmap
├── crops.md                # Crops and seeds details
├── tools.md                # Tools details
├── game-state.md           # Data model and interfaces
├── ui-mockups.md           # UI wireframes and layout
├── user-flow.md            # Gameplay loop and user actions
├── save-load.md            # Save/load system
├── testing.md              # Testing and QA plan
├── glossary.md             # Key terms
├── feature-planting.md     # Planting feature breakdown
└── feature-shop.md         # Shop feature breakdown
```

## How to Use This Documentation
- Start with requirements.md for a big-picture view.
- Use planning.md to follow the development steps.
- Refer to crops.md and tools.md for in-game items.
- See game-state.md for data structures.
- Check ui-mockups.md and user-flow.md for UI and gameplay.
- See save-load.md for persistence details.
- Use testing.md for QA and bug tracking.
- Refer to glossary.md for definitions.
- Check feature-*.md files for detailed feature plans.

---
Feel free to update or expand these documents as the project grows!
