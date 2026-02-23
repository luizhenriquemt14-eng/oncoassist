/**
 * Serviço para integração com Google Sheets via Google Apps Script
 * 
 * IMPORTANTE: Esta implementação usa Google Apps Script, que NÃO requer
 * credenciais OAuth no frontend. As credenciais OAuth (Client ID/Secret)
 * NÃO devem ser usadas neste arquivo, pois seriam expostas ao cliente.
 * 
 * Se você precisar usar Google Sheets API diretamente, crie um backend
 * separado para proteger as credenciais.
 */

export type FormType = 'event-registration' | 'newsletter' | 'contact';

export interface EventRegistrationData {
  tipo: 'event-registration';
  nome: string;
  email: string;
  telefone: string;
  evento: string;
  eventSlug: string;
}

export interface NewsletterData {
  tipo: 'newsletter' | 'contact';
  nome: string;
  email: string;
  telefone: string;
}

export type FormData = EventRegistrationData | NewsletterData;

interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Salva dados do formulário no Google Sheets através do Google Apps Script
 * 
 * @param data - Dados do formulário a serem salvos
 * @returns Promise que resolve com sucesso ou rejeita com erro
 */
export async function saveToGoogleSheets(data: FormData): Promise<void> {
  const webAppUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL;
  const secretToken = import.meta.env.VITE_GOOGLE_SHEETS_SECRET_TOKEN;

  // Se a URL não estiver configurada, apenas log e não quebra a aplicação
  if (!webAppUrl) {
    if (import.meta.env.DEV) {
      console.warn(
        'VITE_GOOGLE_SHEETS_WEB_APP_URL não está configurada. ' +
        'Os dados não serão salvos no Google Sheets. ' +
        'Configure a variável de ambiente para ativar a integração.'
      );
    }
    // Retorna sucesso silenciosamente em produção para não quebrar a UX
    return Promise.resolve();
  }

  // Se o token não estiver configurado, log de aviso mas continua (compatibilidade)
  if (!secretToken && import.meta.env.DEV) {
    console.warn(
      'VITE_GOOGLE_SHEETS_SECRET_TOKEN não está configurada. ' +
      'Recomendado configurar para maior segurança.'
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    // Preparar dados com token de autenticação
    const dataWithToken = {
      ...data,
      ...(secretToken && { token: secretToken }), // Adiciona token apenas se configurado
    };

    // Google Apps Script Web Apps requer mode: 'no-cors' para evitar CORS do browser
    // Com mode: 'no-cors', não podemos usar headers customizados, mas o JSON funciona
    // O Apps Script vai receber os dados em e.postData.contents e fazer JSON.parse
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // Necessário para evitar CORS (n8n funciona porque é servidor)
      body: JSON.stringify(dataWithToken), // Envia JSON direto com token
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Com mode: 'no-cors', não podemos ler a resposta, mas o servidor processa
    // O Google Apps Script ainda recebe e processa a requisição corretamente
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tempo limite excedido. Por favor, tente novamente.');
    }

    // Re-throw para que o componente possa tratar o erro
    throw new Error(
      'Não foi possível salvar seus dados no momento. ' +
      'Por favor, tente novamente mais tarde.'
    );
  }
}
