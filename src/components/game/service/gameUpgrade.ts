const calculateUpgrade = (level: number) => {
    // Base values
    const baseCost = 20;
    const basePower = 5;
    
    // Facteur de progression (plus le niveau est élevé, plus c'est difficile de progresser)
    const progressionFactor = Math.pow(1.5, Math.floor(level / 10));
    
    // Calcul du coût avec une progression logarithmique
    const cost = Math.floor(baseCost * Math.pow(1.5, level) * progressionFactor);
    
    // Calcul de la puissance avec une progression logarithmique
    const power = Math.floor(basePower * Math.pow(1.2, level) * (1 / progressionFactor));
    
    return { cost, power };
  };

export { calculateUpgrade };
