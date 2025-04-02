import { Score, User } from "@prisma/client";
import Image from "next/image";
interface ScoreWithUser extends Score {
  user: User;
}

interface ScoreListProps {
  scores: ScoreWithUser[];
  title: string;
}

export const ScoreList = ({ scores, title }: ScoreListProps) => {
  console.log(scores)
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scores.map((score, index) => (
              <tr key={score.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {score.user.image && (
                      <Image  
                        className="h-8 w-8 rounded-full mr-3"
                        src={score.user.image}
                        alt={`${score.user.name}'s avatar`}
                      />
                    )}
                    <div className="text-sm font-medium text-gray-900">
                      {score.user.name || score.user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {score?.points?.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(score.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 