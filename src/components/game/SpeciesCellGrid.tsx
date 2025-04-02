/* eslint-disable */
"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Species from './classes/Species';
import { speciesData } from './const/gameConfig';

interface SpeciesCellGridProps {
    gridSize: { cellSize: number; gridSize: number };
    species: Species[];
    speciesGrid: Species[][];
    setSpeciesGrid: (grid: Species[][]) => void;
    selectedSpecies: Species | null;
    setSelectedSpecies: (species: Species) => void;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onSpeciesSelect: (species: Species) => void;
    points: number;
    setPoints: (points: number) => void;
    activeSpecies: Species[];
    tier: number;
}

interface SpeciesPosition {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
}

export default function SpeciesCellGrid({
    gridSize,
    speciesGrid,
    setSpeciesGrid,
    selectedSpecies,
    setSelectedSpecies,
    canvasRef,
    points,
    setPoints,
    activeSpecies,
    tier
}: SpeciesCellGridProps) {
    // ignore eslint for this
    /* eslint-disable */
    const [speciesPositions, setSpeciesPositions] = useState<Record<string, SpeciesPosition>>({});
    const animationFrameRef = useRef<number>();
    const lastPositionsRef = useRef<Record<string, SpeciesPosition>>({});

    // Initialiser la grille avec la bonne taille
    useEffect(() => {
        const newGrid = Array(gridSize.gridSize).fill(null).map(() => 
            Array(gridSize.gridSize).fill(null)
        );
        setSpeciesGrid(newGrid);
    }, [gridSize.gridSize, setSpeciesGrid]);

    const handleSpeciesBasinClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (tier < 3 || !selectedSpecies) return;
    
        const rect = e.currentTarget.getBoundingClientRect();
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;
        
        // Calculer la position du clic par rapport au canvas
        const x = Math.floor((e.clientX - rect.left) / gridSize.cellSize);
        const y = Math.floor((e.clientY - rect.top) / gridSize.cellSize);
    
        // Vérifier si le clic est dans les limites du canvas
        if (x < 0 || x >= gridSize.gridSize || y < 0 || y >= gridSize.gridSize) return;
    
        // Coût en PE pour générer une espèce
        const speciesCost = selectedSpecies.generationCost;
    
        if (points >= speciesCost) {
            // Créer une nouvelle grille avec l'espèce ajoutée
            const newSpeciesGrid = speciesGrid.map(row => [...row]);
            console.log(newSpeciesGrid);
            console.log(x, y);
            console.log(selectedSpecies);
            newSpeciesGrid[x][y] = selectedSpecies;
    
            // Ajouter la position initiale de l'espèce avec une vitesse lente
            const newPosition = {
                x,
                y,
                speedX: 0.1,
                speedY: 0.1
            };
            setSpeciesPositions(prev => ({
                ...prev,
                [`${x}-${y}`]: newPosition
            }));
            lastPositionsRef.current[`${x}-${y}`] = newPosition;
    
            setSpeciesGrid(newSpeciesGrid);
            setPoints(prev => prev - speciesCost);
        }
    }, [tier, points, selectedSpecies, speciesGrid, gridSize, setSpeciesGrid, setPoints]);

    const updateSpeciesPosition = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettre à jour les positions et dessiner les espèces
        
        setSpeciesPositions(prev => {
            const newPositions = { ...prev };
            Object.entries(newPositions).forEach(([key, pos]) => {
                // Calculer la nouvelle position
                let newX = pos.x + pos.speedX;
                let newY = pos.y + pos.speedY;

                // Vérifier les limites et ajuster la position si nécessaire
                if (newX < 0) {
                    newX = 0;
                    pos.speedX = 0.1;
                } else if (newX >= gridSize.gridSize) {
                    newX = gridSize.gridSize - 1;
                    pos.speedX = -0.1;
                }

                if (newY < 0) {
                    newY = 0;
                    pos.speedY = 0.1;
                } else if (newY >= gridSize.gridSize) {
                    newY = gridSize.gridSize - 1;
                    pos.speedY = -0.1;
                }

                // Mettre à jour la position
                pos.x = newX;
                pos.y = newY;
                lastPositionsRef.current[key] = { ...pos };

                // Dessiner l'espèce
                const [gridX, gridY] = key.split('-').map(Number);
                const species = speciesGrid[gridX][gridY];
                if (species) {
                    ctx.fillStyle = species.color;
                    ctx.beginPath();
                    ctx.arc(
                        pos.x * gridSize.cellSize + gridSize.cellSize/2,
                        pos.y * gridSize.cellSize + gridSize.cellSize/2,
                        species.size || 3,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            });
            return newPositions;
        });

        // Redessiner toutes les espèces à partir des dernières positions connues
        Object.entries(lastPositionsRef.current).forEach(([key, pos]) => {
            const [gridX, gridY] = key.split('-').map(Number);
            const species = speciesGrid[gridX][gridY];
            if (species) {
                ctx.fillStyle = species.color;
                ctx.beginPath();
                ctx.arc(
                    pos.x * gridSize.cellSize + gridSize.cellSize/2,
                    pos.y * gridSize.cellSize + gridSize.cellSize/2,
                    species.size || 3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });

        // Demander la prochaine frame d'animation
        animationFrameRef.current = requestAnimationFrame(updateSpeciesPosition);
    }, [speciesGrid, gridSize, canvasRef]);

    // Démarrer l'animation
    useEffect(() => {
        updateSpeciesPosition();
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [updateSpeciesPosition]);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Bassin des espèces</h2>
            <div className="mb-4 flex flex-wrap gap-2">
                {speciesData
                    .filter(s => s.tier <= tier && s.type === 'species')
                    .map(species => (
                        <button
                            key={species.name}
                            className={`px-3 py-1 rounded text-sm ${
                                selectedSpecies?.name === species.name
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            onClick={() => setSelectedSpecies(species)}
                        >
                            {species.name} ({species.generationCost} PE)
                        </button>
                    ))}
            </div>
            <div className="relative cursor-pointer">
                <canvas
                    ref={canvasRef}
                    width={gridSize.gridSize * gridSize.cellSize}
                    height={gridSize.gridSize * gridSize.cellSize}
                    className="bg-gray-800 rounded-lg border border-purple-500"
                    onClick={handleSpeciesBasinClick}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 p-2 rounded text-xs">
                    Nombre d'espèces: {activeSpecies.length} (Cliquez pour placer l'espèce)
                </div>
            </div>
        </div>
    );
}
