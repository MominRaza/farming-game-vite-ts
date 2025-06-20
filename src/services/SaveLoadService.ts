import type { GameState } from '../GameState';

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
    };
}

const SAVE_KEY = 'farming-game-save';
const CURRENT_VERSION = '1.0.0';

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
                    offsetY: gameState.offsetY
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

            const saveData: SavedGameData = JSON.parse(jsonData);

            // Validate save data version
            if (saveData.version !== CURRENT_VERSION) {
                console.warn(`Save data version mismatch: ${saveData.version} vs ${CURRENT_VERSION}`);
                // For now, we'll still try to load it, but in the future we might need migration logic
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
