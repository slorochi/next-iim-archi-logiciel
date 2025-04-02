"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { speciesData, tierConfig } from '@/components/game/const/gameConfig';
import { getTierConfig, initializeGrid, initializeSpeciesGrid, nextGeneration } from '@/components/game/service/getTierConfig';
import { calculateUpgrade } from '@/components/game/service/gameUpgrade';
import { useSession } from 'next-auth/react';
import { NavBar } from "@/components/NavBar";
import CellsGrid from '@/components/game/CellsGrid';
import SpeciesCellGrid from '@/components/game/SpeciesCellGrid';
import GameStats from '@/components/game/GameStats';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

function Play() {
  const { data: session } = useSession();
  const [points, setPoints] = useState(0);
  const [totalCellsGenerated, setTotalCellsGenerated] = useState(0);
  const [tier, setTier] = useState(0);
  const [clickPower] = useState(1); // Fixé à 1
  const [autoPower, setAutoPower] = useState(0);
  const [autoUpgradeLevel, setAutoUpgradeLevel] = useState(0);
  const [grid, setGrid] = useState(initializeGrid(0));
  const [speciesGrid, setSpeciesGrid] = useState(initializeSpeciesGrid(0));
  const [cellSpeciesCounts, setCellSpeciesCounts] = useState({
    primitive: 0,
    eucaryote: 0,
    multicellulaire: 0
  });
  const [speciesCounts, setSpeciesCounts] = useState({
    plant: 0,
    vertebre: 0,
    amphibien: 0,
    reptile: 0,
    oiseau: 0,
    mammifere: 0,
    primate: 0,
    homme: 0
  });
  const activeSpecies = [];
  // const [activeSpecies, setActiveSpecies] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('default');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const canvasRef = useRef(null);
  const cellCanvasRef = useRef(null);
  const gridSize = useMemo(() => getTierConfig(tier), [tier]);
  // Fonction pour obtenir le prochain tier disponible
  const getNextTier = useCallback(() => {
    return tierConfig[tier + 1];
  }, [tier]);

  // Modification de la fonction de conversion des cellules
  const calculateSpeciesCounts = useCallback(() => {
    // Calcul automatique des eucaryotes (10 cellules primitives = 1 eucaryote)
    const eucaryotes = Math.floor(cellSpeciesCounts.primitive / 10);

    // Calcul automatique des multicellulaires (2 eucaryotes = 1 multicellulaire)
    const multicellulaires = Math.floor(eucaryotes / 2);

    setCellSpeciesCounts(prev => ({
      ...prev,
      eucaryote: eucaryotes,
      multicellulaire: multicellulaires
    }));
  }, [cellSpeciesCounts.primitive]);

  // Mise à jour des espèces à chaque changement de cellules primitives
  useEffect(() => {
    calculateSpeciesCounts();
  }, [cellSpeciesCounts.primitive, calculateSpeciesCounts]);

  // Génération automatique de PE
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => prev + autoPower);
      // Ajouter les cellules générées par seconde au compteur total
      setTotalCellsGenerated(prev => prev + autoPower);
      // Mettre à jour les cellules primitives
      setCellSpeciesCounts(prev => ({
        ...prev,
        primitive: prev.primitive + autoPower
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPower]);

  // Jeu de la vie - animation des générations
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => nextGeneration(prevGrid));
    }, 200); // Vitesse d'évolution

    return () => clearInterval(interval);
  }, [isPaused]);

 

  // Déblocage et améliorations
  const unlockTier = useCallback((tierCost, newTier) => {
    if (points >= tierCost) {
      setPoints((prev) => prev - tierCost);
      setTier(newTier);
    }
  }, [points]);

  const handleSubmitScore = async () => {
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points: totalCellsGenerated }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement du score");
      }

      // Update stats instead of reloading the page
      redirect("/dashboard");      
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  };

  // Modification de buyUpgrade pour ne gérer que l'amélioration par seconde
  const buyUpgrade = useCallback(() => {
    const currentUpgrade = calculateUpgrade(autoUpgradeLevel);

    if (points >= currentUpgrade.cost) {
      setPoints(prev => prev - currentUpgrade.cost);
      setAutoPower(prev => prev + currentUpgrade.power);
      setAutoUpgradeLevel(prev => prev + 1);
    }
  }, [points, autoUpgradeLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center text-white">
      <NavBar session={session} />
      <Button  className='bg-gray-700 px-4 cursor-pointer hover:bg-gray-600 text-white p-3 rounded-md absolute top-32 right-10' onClick={handleSubmitScore}>Terminer la partie</Button>
      <GameStats
        speciesCounts={speciesCounts}
        tier={tier}
        points={points}
        totalCellsGenerated={totalCellsGenerated}
        autoPower={autoPower}
        cellSpeciesCounts={cellSpeciesCounts}
        speciesData={speciesData}
        activeSpecies={activeSpecies}
        getNextTier={getNextTier}
        unlockTier={unlockTier}
        autoUpgradeLevel={autoUpgradeLevel}
        calculateUpgrade={calculateUpgrade}
        buyUpgrade={buyUpgrade}
        />
      

      <div className='flex gap-20'>
        <CellsGrid
          tier={tier}
          grid={grid}
          setGrid={setGrid}
          cellCanvasRef={cellCanvasRef}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          setPoints={setPoints}
          setTotalCellsGenerated={setTotalCellsGenerated}
          setCellSpeciesCounts={setCellSpeciesCounts}
          clickPower={clickPower}
          selectedPattern={selectedPattern}
          setSelectedPattern={setSelectedPattern}
          gridSize={gridSize}
        />
        {tier >= 3 && (
          <SpeciesCellGrid
            gridSize={gridSize}
            species={activeSpecies}
            selectedSpecies={selectedSpecies}
            setSpeciesCounts={setSpeciesCounts}
            speciesCounts={speciesCounts}
            setSelectedSpecies={setSelectedSpecies}
            canvasRef={canvasRef}
            speciesGrid={speciesGrid}
            setSpeciesGrid={setSpeciesGrid}
            points={points}
            setPoints={setPoints}
            activeSpecies={activeSpecies}
            tier={tier}
          />
        )}
      </div>

    </div>
  );
}

export default Play;