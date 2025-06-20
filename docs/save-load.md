# Save & Load System

> **See also:** [Requirements](requirements.md) | [Planning](planning.md) | [Game State](game-state.md)

This document describes how the game will save and load player progress.

## Save System
- Game state (player, plots, inventory, coins, etc.) is saved to browser localStorage.
- Save automatically on key actions (plant, harvest, buy, etc.).
- Optionally, provide a manual save button.

## Load System
- On game start, check for saved data in localStorage.
- If found, load and restore game state.
- If not, start a new game with default values.

## Data Format
- Use JSON to serialize/deserialize game state.

## Notes
- Warn player if localStorage is full or unavailable.
- Future: Add cloud save or export/import options.
