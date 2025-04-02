import { useState } from "react";
import { useSession } from "next-auth/react";

interface ScoreInputProps {
  onScoreSubmit: (score: number) => Promise<void>;
}

export const ScoreInput = ({ onScoreSubmit }: ScoreInputProps) => {
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("You must be logged in to submit a score");
      return;
    }

    const scoreNumber = parseInt(score);
    if (isNaN(scoreNumber)) {
      setError("Please enter a valid number");
      return;
    }

    try {
      await onScoreSubmit(scoreNumber);
      setScore("");
      setError("");
    } catch (error) {
      setError("Failed to submit score");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}
        <div>
          <label htmlFor="score" className="block text-sm font-medium text-gray-700">
            Enter your score
          </label>
          <input
            type="number"
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Score
        </button>
      </form>
    </div>
  );
}; 