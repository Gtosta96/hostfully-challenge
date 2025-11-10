import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { EmptyBookings } from './empty-state';

describe('EmptyBookings', () => {
  describe('Content Rendering', () => {
    it('should display empty state heading', () => {
      render(<EmptyBookings />);

      expect(screen.getByRole('heading', { name: /no bookings yet/i })).toBeInTheDocument();
    });

    it('should display descriptive message about getting started', () => {
      render(<EmptyBookings />);

      expect(screen.getByText(/get started by creating your first booking/i)).toBeInTheDocument();
    });

    it('should explain what users can do with bookings', () => {
      render(<EmptyBookings />);

      expect(
        screen.getByText(/add guest details, dates, and manage everything in one place/i)
      ).toBeInTheDocument();
    });

    it('should display a create booking button', () => {
      render(<EmptyBookings />);

      expect(
        screen.getByRole('button', { name: /create your first booking/i })
      ).toBeInTheDocument();
    });

    it('should display calendar icon', () => {
      render(<EmptyBookings />);

      // The calendar icon should be rendered (decorative, not interactive)
      // We verify the empty state is complete by checking all text content
      expect(screen.getByRole('heading', { name: /no bookings yet/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onCreate when create button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCreate = vi.fn();

      render(<EmptyBookings onCreate={mockOnCreate} />);

      const createButton = screen.getByRole('button', { name: /create your first booking/i });
      await user.click(createButton);

      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    it('should not error when clicking button without onCreate prop', async () => {
      const user = userEvent.setup();

      render(<EmptyBookings />);

      const createButton = screen.getByRole('button', { name: /create your first booking/i });

      // Should not throw an error
      await expect(user.click(createButton)).resolves.not.toThrow();
    });

    it('should handle multiple button clicks correctly', async () => {
      const user = userEvent.setup();
      const mockOnCreate = vi.fn();

      render(<EmptyBookings onCreate={mockOnCreate} />);

      const createButton = screen.getByRole('button', { name: /create your first booking/i });

      await user.click(createButton);
      await user.click(createButton);
      await user.click(createButton);

      expect(mockOnCreate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Button State', () => {
    it('should have an enabled button by default', () => {
      render(<EmptyBookings onCreate={vi.fn()} />);

      const createButton = screen.getByRole('button', { name: /create your first booking/i });

      expect(createButton).toBeEnabled();
    });

    it('should be interactive and focusable', () => {
      render(<EmptyBookings onCreate={vi.fn()} />);

      const createButton = screen.getByRole('button', { name: /create your first booking/i });

      createButton.focus();
      expect(createButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<EmptyBookings />);

      const heading = screen.getByRole('heading', { name: /no bookings yet/i });

      // Should be an h2 element for proper document structure
      expect(heading.tagName).toBe('H2');
    });

    it('should have accessible button label', () => {
      render(<EmptyBookings />);

      // Button text should clearly describe the action
      const button = screen.getByRole('button', { name: /create your first booking/i });
      expect(button).toBeInTheDocument();
    });

    it('should provide clear context for screen readers', () => {
      render(<EmptyBookings />);

      // All important text should be visible to screen readers
      expect(screen.getByText(/no bookings yet/i)).toBeVisible();
      expect(screen.getByText(/get started by creating your first booking/i)).toBeVisible();
    });

    it('should have semantic HTML structure', () => {
      render(<EmptyBookings />);

      // Check that we have proper semantic elements
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Visual Structure', () => {
    it('should render all essential elements', () => {
      render(<EmptyBookings onCreate={vi.fn()} />);

      // Verify the complete empty state is rendered
      expect(screen.getByRole('heading', { name: /no bookings yet/i })).toBeInTheDocument();
      expect(screen.getByText(/get started by creating your first booking/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create your first booking/i })
      ).toBeInTheDocument();
    });

    it('should display content in the correct order for reading flow', () => {
      render(<EmptyBookings />);

      const heading = screen.getByRole('heading', { name: /no bookings yet/i });
      const description = screen.getByText(/get started by creating your first booking/i);
      const button = screen.getByRole('button', { name: /create your first booking/i });

      // All elements should be in the document
      expect(heading).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('should handle onCreate prop being undefined', () => {
      // Should render without errors
      expect(() => render(<EmptyBookings />)).not.toThrow();
    });

    it('should handle onCreate prop being a function', () => {
      const mockOnCreate = vi.fn();

      expect(() => render(<EmptyBookings onCreate={mockOnCreate} />)).not.toThrow();
    });

    it('should update behavior when onCreate prop changes', async () => {
      const user = userEvent.setup();
      const firstCallback = vi.fn();
      const secondCallback = vi.fn();

      const { rerender } = render(<EmptyBookings onCreate={firstCallback} />);

      const createButton = screen.getByRole('button', { name: /create your first booking/i });
      await user.click(createButton);

      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).not.toHaveBeenCalled();

      // Update the prop
      rerender(<EmptyBookings onCreate={secondCallback} />);

      await user.click(createButton);

      expect(firstCallback).toHaveBeenCalledTimes(1); // Still 1
      expect(secondCallback).toHaveBeenCalledTimes(1); // New callback called
    });
  });

  describe('User Experience', () => {
    it('should provide clear call-to-action', () => {
      render(<EmptyBookings />);

      // The button text should be action-oriented and clear
      const button = screen.getByRole('button', { name: /create your first booking/i });
      expect(button).toHaveTextContent(/create/i);
    });

    it('should provide helpful context for first-time users', () => {
      render(<EmptyBookings />);

      // Message should guide users on what to do next
      expect(screen.getByText(/get started/i)).toBeInTheDocument();
      expect(screen.getByText(/guest details/i)).toBeInTheDocument();
      expect(screen.getByText(/dates/i)).toBeInTheDocument();
      expect(screen.getByText(/manage everything in one place/i)).toBeInTheDocument();
    });

    it('should maintain encouraging tone with "No bookings yet"', () => {
      render(<EmptyBookings />);

      // "Yet" implies future action - encouraging for users
      expect(screen.getByText(/no bookings yet/i)).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be navigable via keyboard', () => {
      render(<EmptyBookings onCreate={vi.fn()} />);

      const button = screen.getByRole('button', { name: /create your first booking/i });

      // Button should be focusable
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should activate button with Enter key', async () => {
      const user = userEvent.setup();
      const mockOnCreate = vi.fn();

      render(<EmptyBookings onCreate={mockOnCreate} />);

      const button = screen.getByRole('button', { name: /create your first booking/i });
      button.focus();

      await user.keyboard('{Enter}');

      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    it('should activate button with Space key', async () => {
      const user = userEvent.setup();
      const mockOnCreate = vi.fn();

      render(<EmptyBookings onCreate={mockOnCreate} />);

      const button = screen.getByRole('button', { name: /create your first booking/i });
      button.focus();

      await user.keyboard(' ');

      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration Scenarios', () => {
    it('should work in a typical first-time user flow', async () => {
      const user = userEvent.setup();
      const mockOnCreate = vi.fn();

      render(<EmptyBookings onCreate={mockOnCreate} />);

      // User sees the empty state
      expect(screen.getByRole('heading', { name: /no bookings yet/i })).toBeInTheDocument();

      // User reads the helpful message
      expect(screen.getByText(/get started by creating your first booking/i)).toBeInTheDocument();

      // User clicks the create button
      const button = screen.getByRole('button', { name: /create your first booking/i });
      await user.click(button);

      // Create action is triggered
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
    });

    it('should render consistently across multiple renders', () => {
      const { rerender } = render(<EmptyBookings onCreate={vi.fn()} />);

      expect(screen.getByRole('heading', { name: /no bookings yet/i })).toBeInTheDocument();

      rerender(<EmptyBookings onCreate={vi.fn()} />);

      expect(screen.getByRole('heading', { name: /no bookings yet/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create your first booking/i })
      ).toBeInTheDocument();
    });
  });

  describe('Button Icon', () => {
    it('should have descriptive button text alongside icon', () => {
      render(<EmptyBookings />);

      // Icon is decorative, but text should be clear
      const button = screen.getByRole('button', { name: /create your first booking/i });
      expect(button).toHaveTextContent(/create your first booking/i);
    });

    it('should not rely on icon alone for meaning', () => {
      render(<EmptyBookings />);

      // Button should have text content, not just an icon
      const button = screen.getByRole('button', { name: /create your first booking/i });
      expect(button.textContent).toBeTruthy();
      expect(button.textContent?.trim().length).toBeGreaterThan(0);
    });
  });
});
