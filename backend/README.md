# Trading Sinergico Backend

Backend API con datos simulados para la plataforma Trading Sinergico.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:5000`

## Características

- Datos simulados realistas (sin necesidad de API keys)
- 15+ símbolos disponibles
- Múltiples timeframes (1m, 5m, 15m, 1h, 1d, 1w)
- Indicadores técnicos (RSI, MACD, SMA, EMA)
- Respuesta instantánea

## Endpoints

- `GET /api/health` - Estado del servidor
- `GET /api/market/quote/:symbol` - Cotización actual
- `GET /api/market/historical/:symbol?timeframe=1d` - Datos históricos
- `GET /api/search/symbols?query=AAPL` - Búsqueda de símbolos
