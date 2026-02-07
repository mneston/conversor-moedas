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
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// ===== OBJETO PARA CACHE DE TAXAS =====
let exchangeRates = {};
let lastFetchTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 1 hora em microssegundos

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
  lastUpdateText.textContent = '';
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

/**
 * Verifica se o cache ainda é válido
 * @params {string} baseCurrency - Moeda base
 * @returns {boolean} - True se cache válido
 */
function isCacheValid(baseCurrency) {
  if (!exchangeRates[baseCurrency] || !lastFetchTime) {
    return false;
  }

  const now = new Date().getTime();
  const last = lastFetchTime.getTime();
  const timeDiff = now - last;

  return timeDiff < CACHE_DURATION;
}

// ===== FUNÇÃO PRINCIPAL DE CONVERSÃO =====

/**
 * Busca taxas de câmbio da API
 * @param {string} baseCurrency - Moeda base
 * @returns {Promise<Object>} - Objeto com taxas de câmbio
 */
async function fetchExchangeRates(baseCurrency) {
  // Verifica cache primeiro
  if (isCacheValid(baseCurrency)) {
    console.log('📦 Usando taxas do cache');

    return {
      rates: exchangeRates[baseCurrency],
      timestamp: lastFetchTime,
    };
  }

  console.log('🌐 Buscando taxas da API...');

  try {
    const response = await fetch(`${API_URL}/latest/${baseCurrency}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Verifica se a API retornou sucesso
    if (data.result !== 'success') {
      throw new Error(data['error-type'] || 'Erro desconhecido na API');
    }

    // Atualiza o cache
    exchangeRates[baseCurrency] = data.conversion_rates;
    lastFetchTime = new Date(data.time_last_update_unix * 1000);

    console.log('✅ Taxas atualizadas com sucesso!');

    return {
      rates: data.conversion_rates,
      timestamp: lastFetchTime,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar taxas:', error);
    throw error;
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
    showResult(amount, 1, new Date());
    return;
  }

  // Mostra loading no botão
  const originalText = convertButton.textContent;
  convertButton.innerHTML = '<span>Convertendo...</span>';
  convertButton.disabled = true;

  try {
    // Busca taxas de câmbio
    const { rates, timestamp } = await fetchExchangeRates(fromCode);

    // Verifica se a moeda destino existe
    if (!rates[toCode]) {
      throw new Error(`Moeda ${toCode} não encontrada`);
    }

    // Calcula conversão
    const rate = rates[toCode];
    const result = amount * rate;

    // Exibe resultado
    showResult(result, rate, timestamp);
  } catch (error) {
    let errorMessage = 'Erro ao converter. Tente novamente.';

    // Mensagem de erro específica
    if (error.message.includes('API key')) {
      errorMessage = 'Erro: Chave da API inválida';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = 'Erro de conexão. Verifique sua internet.';
    }

    showError(errorMessage);
    console.error('Erro detalhado:', error);
  } finally {
    // Restaura botão
    convertButton.textContent = originalText;
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
console.log('📊 Versão: 1.0.0 (API Real)');
console.log('🔑 API Key configurada:', API_KEY !== 'YOUR_API_KEY' ? '✓' : '✗ Configure sua chave!');
