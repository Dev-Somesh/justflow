import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../../components/board/TaskCard';
import { ProjectProvider } from '../../contexts/ProjectContext';

describe('TaskCard', () => {
  const mockTask: any = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    labels: [],
    timeRecords: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<ProjectProvider>{ui}</ProjectProvider>);
  };

  it('renders task details correctly', () => {
    renderWithProvider(<TaskCard task={mockTask} onClick={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    renderWithProvider(<TaskCard task={mockTask} onClick={onClick} />);
    const card = screen.getByText('Test Task');
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });
});
