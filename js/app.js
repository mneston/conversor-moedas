// ===== ELEMENTOS DO DOM =====
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const swapButton = document.getElementById('swap');
const convertButton = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const convertedAmount = document.getElementById('converted-amount');
const exchangeRateText = document.getElementById('exchange-rate');
const lastUpdateText = document.getElementById('last-update');

// ===== CONFIGURAÇÃO DA API =====
const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://v6.exchangerate-api.com/v6';

// ===== OBJETO PARA CACHE DE TAXAS =====
let exchangeRates = {};
let lastFetchTime = null;

// ===== FUNÇÕES AUXILIARES =====

/**
 * Formata número para moeda
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Código da moeda (USD, BRL, etc)
 * @returns {string} - Valor formatado
 */
function formatCurrency(value, currency) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata data para a exibição
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Mostra mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
  resultDiv.classList.remove('hidden');
  convertedAmount.textContent = 'Erro';
  exchangeRateText.textContent = message;
  lastUpdateText;
  textContent = '';
  resultDiv.style.borderColor = '#ef4444';
}

/**
 * Mostra resultado da conversão
 * @param {number} result - Valor convertido
 * @param {number} rate - Taxa de câmbio
 */
function showResult(result, rate) {
  const fromCode = fromCurrency.value;
  const toCode = toCurrency.value;

  // Exibe o resultado
  convertedAmount.textContent = formatCurrency(result, toCode);
  exchangeRateText.textContent = `1 ${fromCode} = ${rate.toFixed(4)} ${toCode}`;
  lastUpdateText.textContent = `Última atualização: ${formatDate(new Date())}`;

  // Mostra o card de resultado
  resultDiv.style.borderColor = '#10b981';
  resultDiv.classList.remove('hidden');
}

// ===== FUNÇÃO PRINCIPAL DE CONVERSÃO =====

/**
 * Busca taxas de câmbio da API
 * @param {string} baseCurrency - Moeda base
 * @returns {Promise<Object>} - Objeto com taxas de câmbio
 */
async function fetchExchangeRates(baseCurrency) {
  try {
    const mockRates = {
      USD: {
        USD: 1,
        EUR: 0.92,
        BRL: 5.24,
        GBP: 0.79,
        JPY: 149.5,
      },
      EUR: {
        USD: 1.09,
        EUR: 1,
        BRL: 5.7,
        GBP: 0.86,
        JPY: 162.5,
      },
      BRL: {
        USD: 0.19,
        EUR: 0.18,
        BRL: 1,
        GBP: 0.15,
        JPY: 28.5,
      },
      GBP: {
        USD: 1.27,
        EUR: 1.16,
        BRL: 6.64,
        GBP: 1,
        JPY: 189.2,
      },
      JPY: {
        USD: 0.0067,
        EUR: 0.0062,
        BRL: 0.035,
        GBP: 0.0053,
        JPY: 1,
      },
    };

    // Simula delay da API (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockRates[baseCurrency];
  } catch (error) {
    throw new Error('Erro ao buscar taxas de câmbio');
  }
}

/**
 * Realiza a conversao de moedas
 */
async function convertCurrency() {
  // Validação do input
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    showError('Por favor, insira um valor válido');
    return;
  }

  const fromCode = fromCurrency.value;
  const toCode = toCurrency.value;

  // Mesma moeda
  if (fromCode == toCode) {
    showResult(amount, 1);
    return;
  }

  // Mostra loading no botão
  convertButton.textContent = 'Convertendo...';
  convertButton.disabled = true;

  try {
    // Busca taxas de câmbio
    const rates = await fetchExchangeRates(fromCode);

    // Calcula conversão
    const rate = rates[toCode];
    const result = amount * rate;

    // Exibe resultado
    showResult(result, rate);

    // Salva no cache
    exchangeRates = rates;
    lastFetchTime = new Date();
  } catch (error) {
    showError('Erro ao converter. Tente novamente.');
    console.error('Erro:', error);
  } finally {
    // Restaura botão
    convertButton.textContent = 'Converter';
    convertButton.disabled = false;
  }
}

// ===== FUNÇÃO DE TROCAR MOEDAS =====

/**
 * Troca as moedas de origem e destino
 */
function swapCurrencies() {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  // Se já tem um resultado, reconverte automaticamente
  if (!resultDiv.classList.contains('hidden')) {
    convertCurrency();
  }
}

// ===== EVENT LISTENERS =====

// Botão converter
convertButton.addEventListener('click', convertCurrency);

// Enter no input de valor
amountInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    convertCurrency();
  }
});

// Botão de trocar moedas
swapButton.addEventListener('click', swapCurrencies);

// Conversão automática ao trocar moedas (opcional)
fromCurrency.addEventListener('change', () => {
  if (!resultDiv.classList.contains('hidden')) {
    convertCurrency();
  }
});

toCurrency.addEventListener('change', () => {
  if (!resultDiv.classList.contains('hidden')) {
    convertCurrency();
  }
});

// ===== INICIALIZAÇÃO =====
console.log('✅ Conversor de moedas carregado!');
console.log('📊 Versão: 1.0.0 (Mock API)');
