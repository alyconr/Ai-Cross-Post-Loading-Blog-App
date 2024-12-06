import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import Write from '../__mocks__/Write';
import { toast } from 'react-toastify';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn()
  }
}));

describe('Write Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Write />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic form elements', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Short Description')).toBeInTheDocument();
    expect(screen.getByTestId('mdx-editor')).toBeInTheDocument();
  });

  it('handles title input changes', async () => {
    renderComponent();
    const titleInput = screen.getByPlaceholderText('Title');
    await userEvent.type(titleInput, 'Test Title');
    expect(titleInput).toHaveValue('Test Title');
  });

  it('handles description input changes', async () => {
    renderComponent();
    const descInput = screen.getByPlaceholderText('Short Description');
    await userEvent.type(descInput, 'Test Description');
    expect(descInput).toHaveValue('Test Description');
  });

  it('handles content changes in editor', async () => {
    renderComponent();
    const editor = screen.getByTestId('mdx-editor-textarea');
    await userEvent.type(editor, 'Test Content');
    expect(editor).toHaveValue('Test Content');
  });

  it('shows error toast when publishing without required fields', async () => {
    renderComponent();
    const publishButton = screen.getByText(/publish/i);
    await userEvent.click(publishButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fill all the fields');
    });
  });
});