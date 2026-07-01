import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import EventRegistrationForm from "./EventRegistrationForm";

const mockToast = vi.fn();
const mockSaveToGoogleSheets = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

vi.mock("@/lib/googleSheets", () => ({
  saveToGoogleSheets: (...args: unknown[]) => mockSaveToGoogleSheets(...args),
}));

vi.mock("@/lib/site-config", async () => {
  const actual = await vi.importActual<typeof import("@/lib/site-config")>("@/lib/site-config");
  return {
    ...actual,
    PUBLIC_FORM_MIN_FILL_MS: 0,
    PUBLIC_FORM_RATE_LIMIT_MS: 0,
  };
});

vi.mock("./ui/select", () => {
  const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
  } | null>(null);

  return {
    Select: ({
      value,
      onValueChange,
      children,
    }: {
      value: string;
      onValueChange: (value: string) => void;
      children: React.ReactNode;
    }) => (
      <SelectContext.Provider value={{ value, onValueChange }}>
        {children}
      </SelectContext.Provider>
    ),
    SelectTrigger: ({ id, className }: { id?: string; className?: string }) => {
      const context = React.useContext(SelectContext);
      return (
        <select
          aria-label="Especialidade *"
          id={id}
          className={className}
          value={context?.value ?? ""}
          onChange={(event) => context?.onValueChange(event.target.value)}
        >
          <option value="">Selecione sua especialidade</option>
          <option value="Enfermeiro(a)">Enfermeiros</option>
          <option value="Nutricionista">Nutricionistas</option>
          <option value="Farmacêutico(a)">Farmacêuticos</option>
        </select>
      );
    },
    SelectValue: () => null,
    SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SelectItem: () => null,
  };
});

describe("EventRegistrationForm", () => {
  const defaultProps = {
    eventTitle: "Test Event",
    eventSlug: "test-event",
  };

  beforeEach(() => {
    mockToast.mockClear();
    mockSaveToGoogleSheets.mockReset();
    mockSaveToGoogleSheets.mockResolvedValue(undefined);
    window.sessionStorage.clear();
    window.localStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("should render form fields", () => {
    render(<EventRegistrationForm {...defaultProps} />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/celular/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /solicitar inscrição/i })).toBeInTheDocument();
  });

  it("should format phone number correctly", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm {...defaultProps} />);

    const phoneInput = screen.getByLabelText(/celular/i);
    await user.type(phoneInput, "11987654321");

    expect(phoneInput).toHaveValue("(11) 98765-4321");
  });

  it("should show error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<EventRegistrationForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /solicitar inscrição/i });
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
    const user = userEvent.setup();
    render(<EventRegistrationForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.type(screen.getByLabelText(/celular/i), "11987654321");
    fireEvent.change(screen.getByLabelText(/especialidade/i), {
      target: { value: "Enfermeiro(a)" },
    });

    const submitButton = screen.getByRole("button", { name: /solicitar inscrição/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSaveToGoogleSheets).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "João Silva",
          email: "joao@example.com",
          telefone: "(11) 98765-4321",
          evento: "Test Event",
          eventSlug: "test-event",
        })
      );
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Solicitação enviada com sucesso!",
        description: expect.stringContaining("Test Event"),
      })
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue("");
      expect(screen.getByLabelText(/e-mail/i)).toHaveValue("");
      expect(screen.getByLabelText(/celular/i)).toHaveValue("");
    });
  });
});
