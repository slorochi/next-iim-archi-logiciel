// Données des espèces
const speciesData = [
    { name: 'Cellule primitive', tier: 0, generationCost: 1, evolveFrom: null, type: 'cell', color: '#8FE3CF' },
    { name: 'Eucaryote', tier: 1, generationCost: 1, evolveFrom: 'Cellule primitive', type: 'cell', color: '#97DEFF' },
    { name: 'Multicellulaire', tier: 2, generationCost: 2, evolveFrom: 'Eucaryote', type: 'cell', color: '#A6FF96' },
    { name: 'Plante', tier: 3, generationCost: 5, evolveFrom: 'Multicellulaire', type: 'species', prey: [], color: '#006400', speed: 1, size: 4, lifespan: 20 },
    { name: 'Vertébré', tier: 3, generationCost: 5, evolveFrom: 'Multicellulaire', type: 'species', prey: ['Plante', 'Vertébré'], color: '#FF6D60', speed: 2, size: 3, lifespan: 15 },
    { name: 'Amphibien', tier: 4, generationCost: 10, evolveFrom: 'Vertébré', type: 'species', prey: ['Plante', 'Vertébré'], color: '#98D8AA', speed: 2, size: 4, lifespan: 12 },
    { name: 'Reptile', tier: 5, generationCost: 15, evolveFrom: 'Amphibien', type: 'species', prey: ['Vertébré', 'Amphibien'], color: '#116530', speed: 1, size: 5, lifespan: 25 },
    { name: 'Oiseau', tier: 6, generationCost: 20, evolveFrom: 'Reptile', type: 'species', prey: ['Plante', 'Amphibien'], color: '#7BD3EA', speed: 3, size: 3, lifespan: 10 },
    { name: 'Mammifère', tier: 7, generationCost: 25, evolveFrom: 'Oiseau', type: 'species', prey: ['Plante', 'Vertébré'], color: '#BA704F', speed: 2, size: 5, lifespan: 20 },
    { name: 'Primate', tier: 8, generationCost: 30, evolveFrom: 'Mammifère', type: 'species', prey: ['Plante', 'Mammifère'], color: '#9F73AB', speed: 2, size: 4, lifespan: 18 },
    { name: 'Homme', tier: 9, generationCost: 50, evolveFrom: 'Primate', type: 'species', prey: ['Plante', 'Mammifère'], color: '#FF90BC', speed: 2, size: 4, lifespan: 30 },
  ];
  
  // Configuration des tiers
  const tierConfig = [
    { name: 'Cellule primitive', cost: 0, color: '#8FE3CF' },
    { name: 'Eucaryote', cost: 10, color: '#97DEFF' },
    { name: 'Multicellulaire', cost: 20, color: '#A6FF96' },
    { name: 'Vertébré', cost: 50, color: '#FF6D60' },
    { name: 'Amphibien', cost: 100, color: '#98D8AA' },
    { name: 'Reptile', cost: 200, color: '#116530' },
    { name: 'Oiseau', cost: 500, color: '#7BD3EA' },
    { name: 'Mammifère', cost: 2000, color: '#BA704F' },
    { name: 'Primate', cost: 5000, color: '#9F73AB' },
    { name: 'Homme', cost: 10000, color: '#FF90BC' },
    { name: 'Civilisation', cost: 20000, color: '#FFD700' },
    { name: 'Technologie', cost: 50000, color: '#00FFFF' },
    { name: 'Futur', cost: 100000, color: '#FF00FF' }
  ];
  
  // Patterns classiques du jeu de la vie pour l'initialisation
  const gameOfLifePatterns = [
    { name: 'default', pattern: [[0, 0]], tier: 0 },
    { name: 'block', pattern: [[0, 0], [0, 1], [1, 0], [1, 1]], tier: 1 },
    { name: 'blinker', pattern: [[0, 1], [1, 1], [2, 1]], tier: 2 },
    { name: 'beehive', pattern: [[0, 1], [0, 2], [1, 0], [1, 3], [2, 1], [2, 2]], tier: 3 },
    { name: 'glider', pattern: [[0, 0], [1, 1], [1, 2], [2, 0], [2, 1]], tier: 4 },
    { name: 'loaf', pattern: [[0, 1], [0, 2], [1, 0], [1, 3], [2, 1], [3, 2]], tier: 5 },
    { name: 'boat', pattern: [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1]], tier: 6 },
    { name: 'toad', pattern: [[0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2]], tier: 7 },
    { name: 'pulsar', pattern: [[0, 3], [1, 2], [1, 4], [2, 1], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [4, 2]], tier: 8 },
    { name: 'lwss', pattern: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1]], tier: 9 },
    { name: 'mwss', pattern: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]], tier: 10 },
    { name: 'hwss', pattern: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3], [4, 1], [4, 2], [4, 3]], tier: 11 }
  ];

  const defaultPattern = [[0, 0]];

  export { speciesData, tierConfig, gameOfLifePatterns, defaultPattern };
