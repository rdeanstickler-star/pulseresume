import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BasicsForm } from './BasicsForm';
import { useResumeStore } from '@/store/resume-store';

describe('BasicsForm', () => {
  beforeEach(() => {
    localStorage.clear();
    useResumeStore.getState().reset();
  });

  it('renders all basics fields', () => {
    render(<BasicsForm />);
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Headline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
  });

  it('typing into Full name updates the store after the debounce', async () => {
    render(<BasicsForm />);
    const name = screen.getByLabelText(/Full name/i);
    fireEvent.change(name, { target: { value: 'Alice Test' } });
    await waitFor(
      () => {
        expect(useResumeStore.getState().resume.basics.name).toBe('Alice Test');
      },
      { timeout: 1000 },
    );
  });

  it('shows lastError as a role=alert when an invalid email is committed', async () => {
    render(<BasicsForm />);
    const email = screen.getByLabelText(/^Email$/i);
    fireEvent.change(email, { target: { value: 'definitely-not-an-email' } });
    await waitFor(
      () => {
        expect(useResumeStore.getState().lastError).toMatch(/email/i);
      },
      { timeout: 1000 },
    );
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('typing into city updates basics.location.city', async () => {
    render(<BasicsForm />);
    const city = screen.getByLabelText(/^City$/i);
    fireEvent.change(city, { target: { value: 'Brooklyn' } });
    await waitFor(
      () => {
        expect(useResumeStore.getState().resume.basics.location.city).toBe('Brooklyn');
      },
      { timeout: 1000 },
    );
  });
});
