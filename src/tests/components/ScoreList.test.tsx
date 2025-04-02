import { render, screen } from '@testing-library/react';
import { ScoreList } from '@/components/scores/ScoreList';

describe('ScoreList', () => {
  const mockScores = [
    {
      id: '1',
      points: 1000,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      user: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: null,
        image: null,
        password: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    },
  ];

  it('renders the title and scores correctly', () => {
    render(<ScoreList scores={mockScores} title="Test Scores" />);
    
    expect(screen.getByText('Test Scores')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('displays rank numbers correctly', () => {
    render(<ScoreList scores={mockScores} title="Test Scores" />);
    
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    render(<ScoreList scores={[]} title="Empty Scores" />);
    
    expect(screen.getByText('Empty Scores')).toBeInTheDocument();
  });
}); 