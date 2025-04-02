"use client";
import React, { useCallback, useEffect, useMemo } from 'react';
import { gameOfLifePatterns, defaultPattern } from './const/gameConfig';
import { getTierConfig, initializeGrid } from '@/components/game/service/getTierConfig';

interface CellsGridProps {
    tier: number;
    grid: number[][];
    setGrid: (grid: number[][]) => void;
    cellCanvasRef: React.RefObject<HTMLCanvasElement>;
    isPaused: boolean;
    setIsPaused: (isPaused: boolean) => void;
    setPoints: (points: number) => void;
    setTotalCellsGenerated: (totalCellsGenerated: number) => void;
    setCellSpeciesCounts: (cellSpeciesCounts: { primitive: number, eucaryote: number, multicellulaire: number }) => void;
    clickPower: number;
    selectedPattern: string;
    setSelectedPattern: (selectedPattern: string) => void;
    gridSize: { cellSize: number; gridSize: number };
}

export default function CellsGrid({
    tier,
    grid,
    setGrid,
    cellCanvasRef,
    isPaused,
    setIsPaused,
    setPoints,
    setTotalCellsGenerated,
    setCellSpeciesCounts,
    clickPower,
    selectedPattern,
    setSelectedPattern,
    gridSize
}: CellsGridProps) {
    const config = useMemo(() => getTierConfig(tier), [tier]);

    // Effet pour réinitialiser la grille quand le tier change
    useEffect(() => {
        const newGrid = initializeGrid(tier);
        setGrid(newGrid);
    }, [tier, setGrid]);

    // Mise à jour du canvas des cellules
    useEffect(() => {
        if (!cellCanvasRef.current) return;
        
        const canvas = cellCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Mettre à jour la taille du canvas en fonction de la grille
        canvas.width = grid.length * gridSize.cellSize;
        canvas.height = grid[0].length * gridSize.cellSize;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j]) {
                    ctx.fillStyle = '#97DEFF';
                    ctx.fillRect(i * gridSize.cellSize, j * gridSize.cellSize, gridSize.cellSize, gridSize.cellSize);
                }
            }
        }
    }, [grid, gridSize, cellCanvasRef]);

    // Modification de handleGridClick pour mettre à jour le compteur global
    const handleGridClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / gridSize.cellSize);
        const y = Math.floor((e.clientY - rect.top) / gridSize.cellSize);
        
        // Vérifier que le clic est dans les limites de la grille
        if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return;
        
        setPoints((prev: number) => prev + clickPower);
        setTotalCellsGenerated((prev: number) => prev + clickPower);
        setCellSpeciesCounts((prev: { primitive: number, eucaryote: number, multicellulaire: number }) => ({
            ...prev,
            primitive: prev.primitive + clickPower
        }));
        
        // Trouver le pattern sélectionné et vérifier s'il est disponible pour le tier actuel
        const selectedPatternObj = gameOfLifePatterns.find(p => p.name === selectedPattern);
        if (!selectedPatternObj || selectedPatternObj.tier > tier) {
            // Si le pattern n'est pas disponible, utiliser le pattern par défaut
            const pattern = defaultPattern;
            const newGrid = grid.map(row => [...row]);
            for (const [dx, dy] of pattern) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
                    newGrid[newX][newY] = 1;
                }
            }
            setGrid(newGrid);
            return;
        }
        
        // Utiliser le pattern sélectionné s'il est disponible
        const pattern = selectedPatternObj.pattern;
        const newGrid = grid.map(row => [...row]);
        for (const [dx, dy] of pattern) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
                newGrid[newX][newY] = 1;
            }
        }
        
        setGrid(newGrid);
    }, [config, clickPower, tier, selectedPattern, grid, setGrid, setPoints, setTotalCellsGenerated, setCellSpeciesCounts, gridSize]);

    const getAvailablePatterns = useCallback(() => {
        const patterns: Record<string, string> = {};
        gameOfLifePatterns.forEach(patternObj => {
            if (patternObj.tier <= tier) {
                patterns[patternObj.name] = patternObj.name;
            }
        });
        return patterns;
    }, [tier]);

    // Réinitialiser la grille
    const resetGrid = useCallback(() => {
        setGrid(initializeGrid(tier));
    }, [tier, setGrid]);

    // Pause/Reprendre l'évolution
    const togglePause = useCallback(() => {
        setIsPaused(!isPaused);
    }, [isPaused, setIsPaused]);

    return (
        <div className="flex flex-wrap gap-8 justify-center">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-300">Jeu de la Vie</h2>
                    <div className="space-x-2">
                        <button
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
                            onClick={togglePause}
                        >
                            {isPaused ? "Reprendre" : "Pause"}
                        </button>
                        <button
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                            onClick={resetGrid}
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Sélection du pattern */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {Object.entries(getAvailablePatterns()).map(([key, name]) => (
                        <button
                            key={key}
                            className={`px-3 py-1 rounded text-sm ${selectedPattern === key
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            onClick={() => setSelectedPattern(key)}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <canvas
                        ref={cellCanvasRef}
                        onClick={handleGridClick}
                        className="bg-gray-900 rounded-lg border border-blue-500 cursor-pointer"
                    />
                    <div className="mt-2 text-xs text-gray-400 text-center">
                        Cliquez pour ajouter des cellules ({(isPaused ? "Simulation en pause" : "Simulation en cours")})
                    </div>
                </div>
            </div>
        </div>
    );
}

