# Trading Sinergico - Trading Analytics Platform

Plataforma de análisis de trading para ayudar a traders principiantes a optimizar su proceso de aprendizaje.

## Inicio Rápido

### 1. Instalar Dependencias
```bash
install.bat
```

### 2. Ejecutar
```bash
# Terminal 1: Backend
start-backend.bat

# Terminal 2: Frontend
start-frontend.bat
```

### 3. Abrir navegador
```
http://localhost:3000
```

## Funcionalidades

### Trading
- Gráficos interactivos con múltiples timeframes (1m, 5m, 15m, 1h, 1d, 1w)
- Indicadores técnicos (RSI, MACD, SMA, EMA)
- 4 mercados: Acciones EE.UU., Acciones Colombia, Criptomonedas, Forex
- Compra/venta simulada con balance inicial de $2000
- Sistema de favoritos con estrella

### Lista de Seguimiento
- Hasta 50 activos favoritos
- Filtrado por categoría
- Precios en tiempo real (simulados)
- Agregar/quitar favoritos desde el gráfico

### Portafolio
- Visualización de holdings (1 BTC y 5 TSLA por defecto)
- Balance disponible
- P&L por posición y total
- Click en posición para operar

### Reflexión Posterior a la Inversión
- **Historial de Trades**: Todos tus trades cerrados (ventas parciales o totales)
- **Análisis Completo del Trade**:
  - Precios de entrada/salida y duración de la posición
  - Ganancia/pérdida total con comisiones
  - Rendimiento porcentual con explicación clara
  - Ratio riesgo/recompensa
- **Escenarios Alternativos Automáticos**:
  - Mantener la posición más tiempo
  - Stop-loss más estricto o amplio
  - Take-profit diferente
  - Tamaño de posición alternativo (50% o 150%)
  - Salida anticipada
- **Comparación Visual**: Lado a lado entre tu trade real y los escenarios hipotéticos
- **Insights Educativos**: Explicaciones sobre cada escenario para aprender de tus decisiones
- Se genera automáticamente al vender (parcial o total) una posición

### Seguimiento Psicológico
- Registro automático de sesiones
- Pop-ups de evaluación emocional (estrés, confianza, fatiga)
- Alertas de comportamiento de riesgo en tiempo real
- Informe psicológico con análisis y recomendaciones
- Correlación entre estados emocionales y operaciones

## Stack

**Backend**: Node.js + Express  
**Frontend**: React + Vite + TailwindCSS + React Router  
**Gráficos**: Lightweight Charts

---

Desarrollado para ayudar a traders a alcanzar la rentabilidad sostenible
