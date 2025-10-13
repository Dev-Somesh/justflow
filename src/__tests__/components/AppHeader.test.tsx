import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AppHeader from '../../components/layouts/AppHeader';
import { ProjectProvider } from '../../contexts/ProjectContext';

// Mock toast hook to capture calls
const toastSpy = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: toastSpy })
}));

// Mock tasks API used by header
vi.mock('@/lib/api/tasks', () => ({
  useTasks: () => ({ data: [] })
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ProjectProvider>
        {component}
      </ProjectProvider>
    </BrowserRouter>
  );
};

describe('AppHeader', () => {
  beforeEach(() => {
    toastSpy.mockReset();
    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: vi.fn().mockImplementation((k: string) => (k === 'username' ? 'tester' : null)),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    } as unknown as Storage;
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      configurable: true,
      writable: true,
    });
  });

  it('renders logo and actions', () => {
    renderWithProviders(<AppHeader />);
    expect(screen.getByText('JustFlow')).toBeInTheDocument();
    expect(screen.getByLabelText(/help/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    renderWithProviders(<AppHeader />);
    const logoutButton = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutButton);
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('loginSuccess');
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('username');
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({ title: 'Logged out successfully' }));
  });
});
