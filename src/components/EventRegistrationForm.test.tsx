import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventRegistrationForm from "./EventRegistrationForm";

// Mock useToast
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe("EventRegistrationForm", () => {
  const defaultProps = {
    eventTitle: "Test Event",
    eventSlug: "test-event",
  };

  beforeEach(() => {
    mockToast.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render form fields", () => {
    render(<EventRegistrationForm {...defaultProps} />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/celular/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar inscrição/i })).toBeInTheDocument();
  });

  it("should format phone number correctly", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EventRegistrationForm {...defaultProps} />);

    const phoneInput = screen.getByLabelText(/celular/i);
    await user.type(phoneInput, "11987654321");

    expect(phoneInput).toHaveValue("(11) 98765-4321");
  });

  it("should show error when submitting empty form", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EventRegistrationForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /confirmar inscrição/i });
    await user.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      })
    );
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup({ delay: null });
    render(<EventRegistrationForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.type(screen.getByLabelText(/celular/i), "11987654321");

    const submitButton = screen.getByRole("button", { name: /confirmar inscrição/i });
    await user.click(submitButton);

    // Fast-forward time to complete async operation
    await vi.advanceTimersByTimeAsync(1500);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Inscrição realizada com sucesso!",
          description: expect.stringContaining("Test Event"),
        })
      );
    });

    // Form should be reset after successful submission
    await waitFor(() => {
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue("");
      expect(screen.getByLabelText(/e-mail/i)).toHaveValue("");
      expect(screen.getByLabelText(/celular/i)).toHaveValue("");
    });
  });
});

