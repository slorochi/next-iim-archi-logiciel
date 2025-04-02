import  {gameOfLifePatterns} from "../const/gameConfig";

const getTierConfig = (tier: number) => {
    // Taille de base 50, +10 par tier, max 150
    const gridSize = Math.min(50 + (tier * 10), 150);
    const cellSize = 5; // Cellules plus grandes pour meilleure visibilité
    return { gridSize, cellSize };
  };
  
  
  // Pattern par défaut (pixel simple)
  
  // Initialisation de la grille avec des patterns classiques du Game of Life
  const initializeGrid = (tier) => {
    const { gridSize } = getTierConfig(tier);
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    
    // Nombre de patterns à placer selon le tier
    const patternCount = Math.min(3 + tier, 8);
    
    // Utiliser tous les patterns pour l'initialisation
    for (let i = 0; i < patternCount; i++) {
      // Sélection aléatoire d'un pattern parmi tous les patterns
      const patternObj = gameOfLifePatterns[Math.floor(Math.random() * gameOfLifePatterns.length)];
      
      // Position aléatoire sur la grille avec marge pour éviter les dépassements
      const x = Math.floor(Math.random() * (gridSize - 10));
      const y = Math.floor(Math.random() * (gridSize - 10));
      
      // Placement du pattern
      for (const [dx, dy] of patternObj.pattern) {
        grid[x + dx][y + dy] = 1;
      }
    }
    
    return grid;
  };
  
  // Initialisation de la grille des espèces
  const initializeSpeciesGrid = (tier) => {
    const { gridSize } = getTierConfig(tier);
    return Array(gridSize).fill().map(() => Array(gridSize).fill(null));
  };
  
  // Règles du jeu de la vie
  const nextGeneration = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = Array(rows).fill().map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Compte des voisins vivants
        let neighbors = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            const ni = (i + di + rows) % rows; // Bord circulaire
            const nj = (j + dj + cols) % cols; // Bord circulaire
            neighbors += grid[ni][nj];
          }
        }
        
        // Règles de Conway
        if (grid[i][j] === 1) {
          // Cellule vivante
          if (neighbors === 2 || neighbors === 3) {
            newGrid[i][j] = 1; // Survie
          }
        } else {
          // Cellule morte
          if (neighbors === 3) {
            newGrid[i][j] = 1; // Naissance
          }
        }
      }
    }
    
    return newGrid;
  };

  
export { getTierConfig, initializeGrid, initializeSpeciesGrid, nextGeneration };
