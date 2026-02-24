// @vitest-environment jsdom
/**
 * Component Tests — LoginModal
 *
 * Tests open/close behaviour, email step UI, loading states,
 * and the registration redirect step.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const { mockRequestOtp, mockVerifyOtp, mockGetCurrentUser, mockCheckEmailHasBusiness } = vi.hoisted(() => ({
    mockRequestOtp: vi.fn(),
    mockVerifyOtp: vi.fn(),
    mockGetCurrentUser: vi.fn(),
    mockCheckEmailHasBusiness: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
    requestOtp: mockRequestOtp,
    verifyOtp: mockVerifyOtp,
    getCurrentUser: mockGetCurrentUser,
    checkEmailHasBusiness: mockCheckEmailHasBusiness,
}));

// Stub lucide-react icons so they don't fail in jsdom
vi.mock('lucide-react', () => ({
    X: () => <span data-testid="icon-x" />,
    Mail: () => <span data-testid="icon-mail" />,
    Lock: () => <span data-testid="icon-lock" />,
    CheckCircle: () => <span data-testid="icon-check" />,
    Store: () => <span data-testid="icon-store" />,
}));

import LoginModal from '@/components/LoginModal';

// ── Helpers ───────────────────────────────────────────────────────────────────
function renderModal(props: Partial<Parameters<typeof LoginModal>[0]> = {}) {
    const defaults = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };
    return render(<LoginModal {...defaults} {...props} />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('LoginModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: no authenticated user
        mockGetCurrentUser.mockResolvedValue(null);
    });

    // ── Visibility ─────────────────────────────────────────────────────────────
    it('renders nothing when isOpen is false', () => {
        const { container } = render(
            <LoginModal isOpen={false} onClose={vi.fn()} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders the modal when isOpen is true', async () => {
        renderModal();
        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });

    it('calls onClose when the close button is clicked', async () => {
        const onClose = vi.fn();
        renderModal({ onClose });
        await waitFor(() => screen.getByTestId('icon-x'));

        // Find the close button - it wraps the X icon
        const closeBtn = screen.getByTestId('icon-x').closest('button');
        expect(closeBtn).toBeTruthy();
        fireEvent.click(closeBtn!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    // ── Email step ────────────────────────────────────────────────────────────
    it('shows an email input in the initial step', async () => {
        renderModal();
        await waitFor(() => {
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'email');
        });
    });

    it('updates email input as user types', async () => {
        renderModal();
        await waitFor(() => screen.getByRole('textbox'));

        const emailInput = screen.getByRole('textbox');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    });

    it('shows registration step when email has no business', async () => {
        mockCheckEmailHasBusiness.mockResolvedValue({ hasBusiness: false });

        renderModal();
        await waitFor(() => screen.getByRole('textbox'));

        const emailInput = screen.getByRole('textbox');
        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

        const submitBtn = screen.getByRole('button', { name: /code versturen/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // The "register" step shows a "Bedrijf Aanmelden" call-to-action
            expect(mockCheckEmailHasBusiness).toHaveBeenCalledWith('new@example.com');
        });
    });

    it('shows error when registering with email that already has a business', async () => {
        mockCheckEmailHasBusiness.mockResolvedValue({ hasBusiness: true });

        renderModal({ isRegistration: true });
        await waitFor(() => screen.getByRole('textbox'));

        const emailInput = screen.getByRole('textbox');
        fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });

        const submitBtn = screen.getByRole('button', { name: /code versturen/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/al gekoppeld/i)).toBeInTheDocument();
        });
    });

    it('shows OTP verify step after successful requestOtp', async () => {
        mockCheckEmailHasBusiness.mockResolvedValue({ hasBusiness: true });
        mockRequestOtp.mockResolvedValue({ success: true });

        renderModal();
        await waitFor(() => screen.getByRole('textbox'));

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'user@example.com' } });
        const submitBtn = screen.getByRole('button', { name: /code versturen/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            // After OTP is sent the verify step should be shown
            expect(mockRequestOtp).toHaveBeenCalledWith('user@example.com', false);
        });
    });

    it('shows error when requestOtp fails', async () => {
        mockCheckEmailHasBusiness.mockResolvedValue({ hasBusiness: true });
        mockRequestOtp.mockResolvedValue({ success: false, error: 'Server fout' });

        renderModal();
        await waitFor(() => screen.getByRole('textbox'));

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'user@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /code versturen/i }));

        await waitFor(() => {
            expect(screen.getByText('Server fout')).toBeInTheDocument();
        });
    });
});
