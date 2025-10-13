import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Provide deterministic sprints by mocking the project context used by the component
const mockSprints = [
  { id: '1', name: 'Sprint 1', status: 'active', startDate: '2025-09-01', endDate: '2025-09-14' },
  { id: '2', name: 'Sprint 2', status: 'planned', startDate: '2025-09-15', endDate: '2025-09-28' },
];

vi.mock('@/contexts/ProjectContext', () => ({
  useProject: () => ({
    getSprints: () => mockSprints,
  }),
}));

import SprintSelector from '../../components/sprint/SprintSelector';

describe('SprintSelector', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('renders sprint options correctly', () => {
    render(<SprintSelector projectId="project-1" onSprintChange={() => {}} />);
    // Control exists and includes base option
    expect(screen.getByText('All Sprints')).toBeInTheDocument();
    // Specific mocked sprint names should be present in the list container
    expect(screen.getByText(/Sprint 1/)).toBeInTheDocument();
  });

  it('calls onSprintChange when a sprint is selected', () => {
    const onSprintChange = vi.fn();
    render(<SprintSelector projectId="project-1" onSprintChange={onSprintChange} />);
    // Open the combobox specifically
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    // Select a known option from our mock
    const option = screen.getByText('Sprint 2 - planned');
    fireEvent.click(option);
    expect(onSprintChange).toHaveBeenCalledWith('2');
  });

  it('shows current sprint dates', () => {
    render(<SprintSelector projectId="project-1" onSprintChange={() => {}} />);
    // Active sprint is Sprint 1; verify date range formatting shows month/day pieces
    expect(screen.getByText(/Sep 1/)).toBeInTheDocument();
  });
});
