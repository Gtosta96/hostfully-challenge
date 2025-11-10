import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { DeleteBookingDialog } from './delete-booking-dialog';

describe('DeleteBookingDialog', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnConfirmDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dialog Visibility', () => {
    it('should render dialog content when isOpen is true', () => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();
    });

    it('should not render dialog content when isOpen is false', () => {
      render(
        <DeleteBookingDialog
          isOpen={false}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(screen.queryByText(/are you sure\?/i)).not.toBeInTheDocument();
    });
  });

  describe('Dialog Content', () => {
    beforeEach(() => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );
    });

    it('should display the warning title', () => {
      expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();
    });

    it('should display the warning description', () => {
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
      expect(screen.getByText(/this will permanently delete the booking/i)).toBeInTheDocument();
    });

    it('should have a cancel button', () => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should have a delete button', () => {
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onConfirmDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnConfirmDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenChange when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });

    it('should not call onConfirmDelete when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });

    it('should call onOpenChange when dialog is dismissed via overlay or escape', async () => {
      const user = userEvent.setup();
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      // Simulate escape key press
      await user.keyboard('{Escape}');

      // The AlertDialog component should handle this and call onOpenChange
      // Note: Actual behavior depends on AlertDialog implementation
      expect(mockOnOpenChange).toHaveBeenCalled();
    });
  });

  describe('Multiple Interactions', () => {
    it('should handle multiple cancel clicks correctly', async () => {
      const user = userEvent.setup();
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      await user.click(cancelButton);
      await user.click(cancelButton);
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(3);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });

    it('should handle multiple delete clicks correctly', async () => {
      const user = userEvent.setup();
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });

      await user.click(deleteButton);
      await user.click(deleteButton);

      expect(mockOnConfirmDelete).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );
    });

    it('should have proper alertdialog role', () => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });

      expect(cancelButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('should have descriptive title for screen readers', () => {
      // The title should be accessible as a heading
      const title = screen.getByText(/are you sure\?/i);
      expect(title).toBeInTheDocument();
    });

    it('should have descriptive content for screen readers', () => {
      const description = screen.getByText(/this action cannot be undone/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Dialog State Management', () => {
    it('should maintain props isolation between renders', () => {
      const { rerender } = render(
        <DeleteBookingDialog
          isOpen={false}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

      rerender(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should handle callback changes without breaking', async () => {
      const user = userEvent.setup();
      const newOnConfirmDelete = vi.fn();

      const { rerender } = render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      rerender(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={newOnConfirmDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(newOnConfirmDelete).toHaveBeenCalledTimes(1);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });
  });

  describe('Button Styling', () => {
    it('should render delete button with destructive styling', () => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });

      // Verify the button has destructive classes applied
      expect(deleteButton).toHaveClass('bg-destructive');
      expect(deleteButton).toHaveClass('text-destructive-foreground');
    });

    it('should have both cancel and delete buttons visible simultaneously', () => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });

      expect(cancelButton).toBeVisible();
      expect(deleteButton).toBeVisible();
    });
  });

  describe('Warning Message Clarity', () => {
    it('should clearly communicate irreversible action', () => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      // Check that the warning is clear about permanence
      expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
      expect(screen.getByText(/permanently delete/i)).toBeInTheDocument();
    });

    it('should specify what is being deleted', () => {
      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.getByText(/delete the booking/i)).toBeInTheDocument();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work correctly in a typical delete flow', async () => {
      const user = userEvent.setup();

      // Start with dialog closed
      const { rerender } = render(
        <DeleteBookingDialog
          isOpen={false}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

      // User opens dialog (simulated by changing isOpen prop)
      rerender(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      // User confirms deletion
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnConfirmDelete).toHaveBeenCalledTimes(1);
    });

    it('should work correctly when user cancels deletion', async () => {
      const user = userEvent.setup();

      render(
        <DeleteBookingDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirmDelete={mockOnConfirmDelete}
        />
      );

      // User decides not to delete
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
      expect(mockOnConfirmDelete).not.toHaveBeenCalled();
    });
  });
});
