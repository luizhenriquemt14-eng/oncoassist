# Google Apps Script Hardened Flow

Este projeto envia inscricoes direto do navegador para um Web App do Google Apps Script.

Isso nunca fica 100% blindado, porque o endpoint precisa ser publico para o site funcionar. Ainda assim, da para melhorar bastante a filtragem e reduzir abuso casual com:

- validacao de origem
- honeypot
- tempo minimo de preenchimento
- token opcional
- validacao forte dos campos
- lista permitida de especialidades e eventos
- deduplicacao por evento + e-mail
- rate limit curto por navegador

## Variaveis do front

No `.env`:

```env
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/SEU_WEB_APP_ID/exec
VITE_GOOGLE_SHEETS_SECRET_TOKEN=troque-por-um-token-longo
```

O token aqui nao e um segredo real, porque sai no front-end. Mesmo assim, ele ajuda a filtrar bots casuais e integracoes erradas.

## Campos extras enviados pelo front

O formulario ja envia no bloco `antiSpam`:

- `honeypot`
- `startedAt`
- `submittedAt`
- `elapsedMs`
- `origin`
- `path`
- `referrer`
- `userAgent`
- `language`
- `timezone`
- `screen`
- `clientId`
- `submissionId`
- `formVersion`

## Script recomendado

Cole este conteudo no seu Google Apps Script, ajuste o `SHEET_ID`, o nome da aba e o token, depois publique uma nova versao do Web App.

```javascript
const SHEET_ID = '1Hrgoy3OEGLQxYKpIDAPQxbKxXoq1XfCZ1_nhnV1RhKk';
const SHEET_NAME = 'OncoAssist - Cadastros';
const SECRET_TOKEN = 'troque-por-um-token-longo';
const DEBUG_SHEET_NAME = 'DEBUG_ONCOASSIST';

const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:5173',
  'https://oncoassist.com.br',
];

const ALLOWED_SPECIALTIES = [
  'Enfermeiro(a)',
  'Nutricionista',
  'Farmaceutico(a)',
];

const ALLOWED_EVENT_SLUGS = [
  'hematologia',
  'mama',
  'medicina-intensiva',
  'multiprofissional',
  'torax',
  'tumores-gastrointestinais',
  'tumores-geniturinarios',
  'tumores-ginecologicos',
];

const MIN_FILL_TIME_MS = 4000;
const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 25;
const MAX_EVENT_LENGTH = 160;
const DUPLICATE_WINDOW_SECONDS = 60 * 60 * 6;
const CLIENT_RATE_LIMIT_SECONDS = 45;

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDebugSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(DEBUG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(DEBUG_SHEET_NAME);
    sheet.appendRow(['timestamp', 'step', 'detail']);
  }
  return sheet;
}

function debugLog_(step, detail) {
  try {
    getDebugSheet_().appendRow([new Date(), step, JSON.stringify(detail)]);
  } catch (err) {}
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhone_(value) {
  return String(value || '').replace(/\D/g, '');
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone_(value) {
  return /^\d{10,11}$/.test(normalizePhone_(value));
}

function isProbablyBot_(antiSpam) {
  const userAgent = String(antiSpam.userAgent || '').toLowerCase();
  return !userAgent || /bot|spider|crawl|python|curl|wget|postman|insomnia/.test(userAgent);
}

function requireString_(value, maxLength) {
  const normalized = String(value || '').trim();
  return normalized && normalized.length <= maxLength ? normalized : '';
}

function cacheKey_(parts) {
  return parts.join(':');
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'Nenhum conteudo recebido no POST' });
    }

    const data = JSON.parse(e.postData.contents);
    const antiSpam = data.antiSpam || {};
    const cache = CacheService.getScriptCache();

    const tipo = requireString_(data.tipo, 40);
    const nome = requireString_(data.nome, MAX_NAME_LENGTH);
    const email = normalizeEmail_(data.email);
    const telefone = requireString_(data.telefone, MAX_PHONE_LENGTH);
    const especialidade = requireString_(data.especialidade, 40);
    const evento = requireString_(data.evento, MAX_EVENT_LENGTH);
    const eventSlug = requireString_(data.eventSlug, 80);
    const token = String(data.token || '').trim();
    const origin = String(antiSpam.origin || '').trim();
    const clientId = String(antiSpam.clientId || '').trim();

    debugLog_('parsed_payload', {
      tipo: tipo,
      email: email,
      eventSlug: eventSlug,
      submissionId: antiSpam.submissionId || '',
    });

    if (SECRET_TOKEN && token !== SECRET_TOKEN) {
      debugLog_('fail_token', { eventSlug: eventSlug, email: email });
      return jsonResponse({ success: false, error: 'Nao autorizado' });
    }

    if (!tipo || !nome || !email) {
      return jsonResponse({ success: false, error: 'Campos obrigatorios ausentes' });
    }

    if (tipo !== 'event-registration') {
      return jsonResponse({ success: false, error: 'Tipo de formulario nao permitido' });
    }

    if (!isValidEmail_(email)) {
      return jsonResponse({ success: false, error: 'E-mail invalido' });
    }

    if (!isValidPhone_(telefone)) {
      return jsonResponse({ success: false, error: 'Telefone invalido' });
    }

    if (!ALLOWED_SPECIALTIES.includes(especialidade)) {
      return jsonResponse({ success: false, error: 'Especialidade invalida' });
    }

    if (!ALLOWED_EVENT_SLUGS.includes(eventSlug)) {
      return jsonResponse({ success: false, error: 'Evento invalido' });
    }

    if (antiSpam.honeypot) {
      return jsonResponse({ success: false, error: 'Requisicao rejeitada' });
    }

    if (typeof antiSpam.elapsedMs !== 'number' || antiSpam.elapsedMs < MIN_FILL_TIME_MS) {
      return jsonResponse({ success: false, error: 'Envio muito rapido' });
    }

    if (!origin || ALLOWED_ORIGINS.indexOf(origin) === -1) {
      return jsonResponse({ success: false, error: 'Origem nao permitida' });
    }

    if (isProbablyBot_(antiSpam)) {
      return jsonResponse({ success: false, error: 'Requisicao bloqueada' });
    }

    if (!clientId || clientId.length < 8) {
      return jsonResponse({ success: false, error: 'Cliente invalido' });
    }

    const duplicateKey = cacheKey_(['duplicate', eventSlug, email]);
    if (cache.get(duplicateKey)) {
      return jsonResponse({ success: false, error: 'Inscricao ja registrada recentemente' });
    }

    const clientRateKey = cacheKey_(['client', clientId]);
    if (cache.get(clientRateKey)) {
      return jsonResponse({ success: false, error: 'Aguarde antes de enviar novamente' });
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ success: false, error: 'Aba nao encontrada' });
    }

    const rowData = [
      new Date(),
      tipo,
      nome,
      email,
      telefone,
      especialidade,
      evento,
      eventSlug,
      antiSpam.submissionId || '',
      clientId,
      origin,
      antiSpam.path || '',
      antiSpam.referrer || '',
      antiSpam.language || '',
      antiSpam.timezone || '',
      antiSpam.screen || '',
      antiSpam.formVersion || '',
    ];

    sheet.appendRow(rowData);

    cache.put(duplicateKey, '1', DUPLICATE_WINDOW_SECONDS);
    cache.put(clientRateKey, '1', CLIENT_RATE_LIMIT_SECONDS);

    return jsonResponse({ success: true, message: 'Dados salvos com sucesso' });
  } catch (error) {
    debugLog_('catch_error', String(error));
    return jsonResponse({ success: false, error: String(error) });
  }
}
```

## Cabecalho recomendado da planilha

```text
Data | Tipo | Nome | Email | Telefone | Especialidade | Evento | EventSlug | SubmissionId | ClientId | Origin | Path | Referrer | Language | Timezone | Screen | FormVersion
```

## Publicacao

Sempre que alterar o script:

1. Salve.
2. Va em `Implantar > Gerenciar implantacoes`.
3. Edite a implantacao do Web App.
4. Publique uma nova versao.

## Limite real

Essas medidas melhoram bastante o fluxo direto, mas nao substituem um backend proprio. Quem inspecionar o front ainda consegue descobrir a URL do Web App e o token opcional.
