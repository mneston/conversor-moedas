# Conversor de moedas

![Status](https://img.shields.io/badge/Status-Concluido-success) ![Licença](https://img.shields.io/badge/Licença-MIT-green)

**Conversor de moedas em tempo real com interface moderna e responsiva**

[Demo ao vivo](https://mneston.github.io/conversor-moedas/) • [Reportar Bug](../../issues) • [Sugerir Feature](../../issues)

---

## Funcionalidade

- **Conversão em tempo real** usando API de taxas de câmbio
- **5 moedas principais:** USD, EUR, BRL, GBP e JPY
- **Sistema de cache inteligente** (10 minutos)
- **Interface responsiva** - funciona em qualquer dispositivo
- **Tema dark moderno** com gradientes
- **Animações suaves** e feedback visual
- **Troca rápida de moedas** com um clique
- **Conversão automática** ao mudar seleção
- **Validação de entrada** com mensagens claras

---

## Tecnologias utilizadas

| Tecnologia                                                                                                        | Descrição               |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)                | Estrutura semântica     |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)                   | Estilização moderna     |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Lógica e interatividade |
| ![API](https://img.shields.io/badge/API-ExchangeRate-00ADD8?style=for-the-badge)                                  | Dados de câmbio         |

### Conceitos aplicados

- **HTML Semântico:** `<header>`, `<main>`, `<footer>`
- **CSS Moderno:** Variáveis CSS, Flexbox, Animações
- **JavaScript ES6+:** Async/Await, Fetch API, Arrow Functions
- **API Rest:** Consumo de dados externos
- **Responsividade:** Mobile-first design
- **Acessibilidade:** Labels, WAI-ARIA, foco visível

---

## Como usar

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet
- Chave de API **gratuita** da [ExchangeRate-API](https://www.exchangerate-api.com/)

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/mneston/conversor-moedas.git
cd conversor-moedas
```

2. **Configure a API Key**

```bash
# Copie o arquivo de exemplo
cp js/config.example.js js/config.js
```

Edite `js/config.js` e substitua `'YOUR_API_KEY'` pela sua chave:

```javascript
const CONFIG = {
  API_KEY: 'sua-chave-aqui', // <- Cole sua key aqui
  API_URL: 'https://v6.exchangerate-api.com/v6',
};
```

> 💡 **Como obter sua API Key**
>
> 1. Acesse https://www.exchangerate-api.com/
> 2. Clique em "Get Free Key"
> 3. Cadastre o seu e-mail
> 4. Copie a chave e cole no arquivo `config.js`

3. **Abra o projetos**

Simplesmente abra o arquivo `index.html` no navegador!

---

## Como funciona

### Fluxo de dados

```
┌─────────────┐
│   Usuário   │
│ (Input)     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Validação JS   │
│  - Valor > 0?   │
│  - Moedas ≠?    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      ┌──────────────┐
│  Cache Local?   │─SIM─▶│ Usar Cache   │
└──────┬──────────┘      └──────┬───────┘
       │ NÃO                    │
       ▼                        │
┌─────────────────┐             │
│  Fetch API      │             │
│  exchangerate   │             │
└──────┬──────────┘             │
       │                        │
       ▼                        │
┌─────────────────┐             │
│  Salvar Cache   │             │
│  (10 min)       │             │
└──────┬──────────┘             │
       │                        │
       └────────┬───────────────┘
                ▼
       ┌─────────────────┐
       │  Cálculo        │
       │  valor × taxa   │
       └──────┬──────────┘
              ▼
       ┌─────────────────┐
       │  Exibir         │
       │  Resultado      │
       └─────────────────┘
```

### Estrutura de código

```javascript
// 1. Captura elementos DOM
const amountinput = document.getElementById('amount');

// 2. Função assíncrona para buscar taxas
async function fetchExchangeRates(baseCurrency) {
  const response = await fetch(API_URL);
  return await response.json();
}

// 3. Conversão com validação
async function convertCurrency() {
  if (amount <= 0) return showError();
  const rates = await fetchExchangeRates();
  showResult(amount * rates[toCurrency]);
}
```

---

## Customização

### Alterar cores

Edite as variáveis CSS em `css/style.css`:

```css
:root {
  --primary-color: #6366f1; /* Cor principal */
  --secondary-color: #10b981; /* Cor de sucesso */
  --background: #0f172a; /* Fundo escuro */
}
```

### Adicionar Moedas

1. Adicione no HTML (`index.html`):

```html
CAD - Dólar canadense
```

2. A API suporta 160+ moedas automaticamente!

### Ajustar cache

Em `js/app.js`:

```javascript
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
```

---

## Responsividade

O design se adapta perfeitamente a diferentes tamanhos de tela:

| Dispositivo | Largura   | Layout                          |
| ----------- | --------- | ------------------------------- |
| Mobile      | < 480px   | Coluna única, botões empilhados |
| Tablet      | 481-768px | Card centralizado               |
| Desktop     | > 768px   | Layout completo                 |

---

## Testes realizados

- [x] Conversão com valores válidos
- [x] Validação de valores negativos
- [x] Validação de valores zero
- [x] Mesma moeda (retorna o valor original)
- [x] Troca de moedas (swap)
- [x] Enter para converter
- [x] Sistema de cache
- [x] Tratamento de erros de rede
- [x] Responsividade mobile
- [x] Acessibilidade (tab navigation)

---

## Problemas conhecidos

- API gratuita limitada a 1.500 requisições/mês
- Cache persiste apenas durante a sessão do navegador

---

## Proximas melhorias

- [ ] Adicionar mais moedas (criptomoedas)
- [ ] Gráfico de histórico de taxas
- [ ] Modo claro/escuro (toggle)
- [ ] Salvar conversões favoritas (LocalStorage)
- [ ] PWA (funcionar offline)
- [ ] Comparação de múltiplas moedas simultaneamente

---

## Aprendizado

Este projeto foi desenvolvido para praticar:

1. **Git Flow:** Commits semânticos e versionamento
2. **JavaScript Assíncrono:** Promises, Async/Await
3. **Consumo de APIs:** Fetch, tratamento de erros
4. **Componentização:** Funções reutilizáveis e modulares
5. **UX/UI:** Feedback visual, loading states
6. **Otimização:** Sistema de cache para performance

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Autor

**Márcio Dias Pereira**

- GitHub: [@mneston](https://github.com/mneston)
- LinkedIn: [Márcio Dias Pereira](https://www.linkedin.com/in/m%C3%A1rcio-dias-pereira-53789820)
- Email: mnestonweb@gmail.com

---

## Agradecimentos

- [ExchangeRate-API](https://www.exchangerate-api.com/) - API de taxas de câmbio
- [Shields.io](https://shields.io/) - Badges do README

---

**Se este projeto te ajudou, deixe uma ⭐!**

Feito com 🩷 e ☕
