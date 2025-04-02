"use client";
import React from 'react';
import { tierConfig } from './const/gameConfig';
import Species from './classes/Species';

interface GameStatsProps {
    tier: number;
    points: number;
    totalCellsGenerated: number;
    autoPower: number;
    cellSpeciesCounts: {
        primitive: number;
        eucaryote: number;
        multicellulaire: number;
    };
    speciesData: Array<{
        name: string;
        tier: number;
        type: string;
    }>;
    activeSpecies: Species[];
    getNextTier: () => { name: string; cost: number } | null;
    unlockTier: (cost: number, newTier: number) => void;
    autoUpgradeLevel: number;
    calculateUpgrade: (level: number) => { power: number; cost: number };
    buyUpgrade: () => void;
}

export default function GameStats({
    tier,
    points,
    totalCellsGenerated,
    autoPower,
    cellSpeciesCounts,
    speciesData,
    activeSpecies,
    getNextTier,
    unlockTier,
    autoUpgradeLevel,
    calculateUpgrade,
    buyUpgrade
}: GameStatsProps) {
    const nextTier = getNextTier();

    return (
        <div className="flex flex-col items-center gap-8 p-4">
            <h1 className="mt-10 text-4xl font-bold mb-2 border-2 border-gray-600 p-3 rounded-md text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Tier actuel: {tierConfig[tier].name}
            </h1>

            <h2 className="font-bold text-2xl my-2">
                Points d&apos;évolutions: {Math.floor(points)}
                <span className="ml-4 text-blue-300">
                    Cellules générées: {totalCellsGenerated}
                </span>
            </h2>

            <div className="flex gap-4">
                <div className="mb-6 flex gap-4 bg-gray-800 p-4 rounded-lg border border-gray-600">
                    <div className='flex flex-col'>
                        <div className="flex justify-between mb-2">
                            <span>PE par seconde:</span>
                            <span className="font-semibold text-green-400">&nbsp;{autoPower.toFixed(1)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col border-gray-600">
                        <div className="flex justify-between mb-2">
                            <span>Cellules primitives:</span>
                            <span className="font-semibold text-blue-300">&nbsp;{cellSpeciesCounts.primitive}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Eucaryotes:</span>
                            <span className="font-semibold text-green-300">&nbsp;{cellSpeciesCounts.eucaryote}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Multicellulaires:</span>
                            <span className="font-semibold text-purple-300">&nbsp;{cellSpeciesCounts.multicellulaire}</span>
                        </div>
                    </div>
                </div>

                <div className='flex gap-4'>
                    {tier >= 3 && <div className="mb-6 flex gap-4 bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <div className="flex flex-col">
                            {speciesData
                                .filter(s => s.tier <= tier && s.type === 'species')
                                .map(species => (
                                    <div key={species.name} className="flex justify-between mb-2">
                                        <span>{species.name}:</span>
                                        <span className="font-semibold text-blue-300">
                                            &nbsp;{activeSpecies.filter(s => s.name === species.name).length}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>}
                </div>
            </div>

            <div className="flex flex-col gap-2 mb-8">
                {/* Bouton de déblocage de tier */}
                {nextTier && (
                    <button
                        className={`px-4 py-2 rounded ${points >= nextTier.cost ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700'}`}
                        onClick={() => unlockTier(nextTier.cost, tier + 1)}
                        disabled={points < nextTier.cost}
                    >
                        Débloquer {nextTier.name} ({nextTier.cost} PE)
                    </button>
                )}

                {/* Bouton d'amélioration par seconde uniquement */}
                {tier >= 1 && (
                    <button
                        className={`px-4 py-2 rounded ${points >= calculateUpgrade(autoUpgradeLevel).cost ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-700'}`}
                        onClick={buyUpgrade}
                        disabled={points < calculateUpgrade(autoUpgradeLevel).cost}
                    >
                        +{calculateUpgrade(autoUpgradeLevel).power} PE par seconde ({calculateUpgrade(autoUpgradeLevel).cost} PE)
                    </button>
                )}
            </div>
        </div>
    );
} 