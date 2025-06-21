import type { GameState } from '../GameState';
import * as TileSystem from '../tiles';

export interface SavedGameData {
    version: string;
    timestamp: number;
    gameState: {
        grid: {
            width: number;
            height: number;
            tiles: Array<[string, any]>; // Serialize Map as array of key-value pairs
            sections: any[][];
        };
        scale: number;
        offsetX: number;
        offsetY: number;
        coins: number;
    };
}

const SAVE_KEY = 'farming-game-save';
const CURRENT_VERSION = '2.0.0'; // Updated version for new tile system

// Migrate old tile data to new format
function migrateTileData(oldTile: any): any {
    // If it's already in the new format, return as is
    if (oldTile.occupation !== undefined || oldTile.cropData !== undefined) {
        return oldTile;
    }

    // Handle old format tiles
    const newTile: any = {
        type: oldTile.type,
        x: oldTile.x,
        y: oldTile.y,
        sectionX: oldTile.sectionX,
        sectionY: oldTile.sectionY
    };

    // Convert old crop tile types to new occupation system
    if (oldTile.type === 'home') {
        newTile.type = TileSystem.TileType.GRASS;
        newTile.occupation = TileSystem.OccupationType.HOME;
    } else if (oldTile.type && oldTile.type.includes('seeds') || oldTile.type.includes('growing') || oldTile.type.includes('mature')) {
        // This is a crop tile, convert to dirt + crop occupation
        newTile.type = TileSystem.TileType.DIRT;
        newTile.occupation = TileSystem.OccupationType.CROP;
        // Determine crop type
        let cropType: TileSystem.CropTypeValue = TileSystem.CropType.WHEAT;
        if (oldTile.type.includes('carrot')) {
            cropType = TileSystem.CropType.CARROT;
        } else if (oldTile.type.includes('tomato')) {
            cropType = TileSystem.CropType.TOMATO;
        }

        // Determine crop stage  
        let stage: TileSystem.CropStageValue = TileSystem.CropStage.SEED;
        if (oldTile.type.includes('growing')) {
            stage = TileSystem.CropStage.GROWING;
        } else if (oldTile.type.includes('mature')) {
            stage = TileSystem.CropStage.MATURE;
        }

        newTile.cropData = {
            type: cropType,
            stage: stage,
            plantedTime: oldTile.plantedTime || Date.now(),
            wateredTime: oldTile.isWatered ? Date.now() - 30000 : undefined // Assume watered 30 seconds ago
        };
    }

    return newTile;
}

export class SaveLoadService {    /**
     * Save the current game state to localStorage
     */
    static saveGame(gameState: GameState): boolean {
        try {
            const saveData: SavedGameData = {
                version: CURRENT_VERSION,
                timestamp: Date.now(),
                gameState: {
                    grid: {
                        width: gameState.grid.width,
                        height: gameState.grid.height,
                        tiles: Array.from(gameState.grid.tiles.entries()), // Convert Map to array
                        sections: gameState.grid.sections
                    },
                    scale: gameState.scale,
                    offsetX: gameState.offsetX,
                    offsetY: gameState.offsetY,
                    coins: gameState.coins
                }
            };

            const jsonData = JSON.stringify(saveData);
            localStorage.setItem(SAVE_KEY, jsonData);

            console.log('Game saved successfully!');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load game state from localStorage
     */
    static loadGame(): SavedGameData | null {
        try {
            const jsonData = localStorage.getItem(SAVE_KEY);
            if (!jsonData) {
                console.log('No saved game found');
                return null;
            }

            const saveData: SavedGameData = JSON.parse(jsonData);            // Validate save data version and apply migrations if needed
            if (saveData.version !== CURRENT_VERSION) {
                console.warn(`Save data version mismatch: ${saveData.version} vs ${CURRENT_VERSION}`);
                console.log('Applying migration...');

                // Migrate tile data if needed
                if (saveData.gameState.grid.tiles) {
                    saveData.gameState.grid.tiles = saveData.gameState.grid.tiles.map(([key, tile]) => {
                        return [key, migrateTileData(tile)];
                    });
                }

                // Update version after migration
                saveData.version = CURRENT_VERSION;
                console.log('Migration completed');
            }

            console.log('Game loaded successfully!');
            return saveData;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Check if a saved game exists
     */
    static hasSavedGame(): boolean {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    /**
     * Delete the saved game
     */
    static deleteSavedGame(): boolean {
        try {
            localStorage.removeItem(SAVE_KEY);
            console.log('Saved game deleted');
            return true;
        } catch (error) {
            console.error('Failed to delete saved game:', error);
            return false;
        }
    }

    /**
     * Get save file info without loading the full game
     */
    static getSaveInfo(): { timestamp: number; version: string } | null {
        try {
            const jsonData = localStorage.getItem(SAVE_KEY);
            if (!jsonData) return null;

            const saveData = JSON.parse(jsonData);
            return {
                timestamp: saveData.timestamp,
                version: saveData.version
            };
        } catch (error) {
            console.error('Failed to get save info:', error);
            return null;
        }
    }

    /**
     * Export save data as a downloadable file
     */
    static exportSave(): void {
        try {
            const jsonData = localStorage.getItem(SAVE_KEY);
            if (!jsonData) {
                alert('No saved game to export!');
                return;
            }

            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `farming-game-save-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('Save exported successfully!');
        } catch (error) {
            console.error('Failed to export save:', error);
            alert('Failed to export save file!');
        }
    }

    /**
     * Import save data from a file
     */
    static importSave(file: File): Promise<boolean> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = e.target?.result as string;
                    const saveData = JSON.parse(jsonData);

                    // Validate the imported data
                    if (!saveData.version || !saveData.timestamp || !saveData.gameState) {
                        throw new Error('Invalid save file format');
                    }

                    localStorage.setItem(SAVE_KEY, jsonData);
                    console.log('Save imported successfully!');
                    resolve(true);
                } catch (error) {
                    console.error('Failed to import save:', error);
                    alert('Invalid save file format!');
                    resolve(false);
                }
            };
            reader.readAsText(file);
        });
    }
}
