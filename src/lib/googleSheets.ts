import { DEFAULT_GOOGLE_SHEETS_WEB_APP_URL } from "./site-config";

export type FormType = "event-registration" | "newsletter" | "contact";

export interface AntiSpamData {
  honeypot?: string;
  startedAt?: string;
  submittedAt?: string;
  elapsedMs?: number;
  origin?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  language?: string;
  timezone?: string;
  screen?: string;
  clientId?: string;
  submissionId?: string;
  formVersion?: string;
}

export interface EventRegistrationData {
  tipo: "event-registration";
  nome: string;
  email: string;
  telefone: string;
  especialidade: string;
  evento: string;
  eventSlug: string;
  antiSpam?: AntiSpamData;
}

export interface NewsletterData {
  tipo: "newsletter" | "contact";
  nome: string;
  email: string;
  telefone: string;
}

export type FormData = EventRegistrationData | NewsletterData;

export async function saveToGoogleSheets(data: FormData): Promise<void> {
  const webAppUrl =
    import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || DEFAULT_GOOGLE_SHEETS_WEB_APP_URL;
  const secretToken = import.meta.env.VITE_GOOGLE_SHEETS_SECRET_TOKEN;

  if (!webAppUrl?.trim()) {
    return;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  try {
    await fetch(webAppUrl.trim(), {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        ...data,
        ...(secretToken ? { token: secretToken } : {}),
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Tempo limite excedido. Por favor, tente novamente.");
    }

    throw new Error(
      "Nao foi possivel salvar seus dados no momento. Por favor, tente novamente mais tarde."
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}
