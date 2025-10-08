# Guía de Trading - BackTrade

## Funcionalidades de Compra y Venta

BackTrade incluye un sistema simulado de trading que permite a los usuarios practicar operaciones de compra y venta.

### Acceso al Trading

En el header de la aplicación encontrarás dos botones:

- **Comprar** (verde) - Para simular compra de activos
- **Vender** (azul) - Para simular venta de activos

## Flujo de Compra/Venta

### Paso 1: Búsqueda de Activo

1. Click en "Comprar" o "Vender"
2. Aparece un modal con buscador
3. Escribe el símbolo que deseas operar (ej: AAPL, ECOPETROL, BTC)
4. Selecciona el activo de los resultados

### Paso 2: Selección de Plataforma

Según el mercado actual, se muestran plataformas disponibles:

**Acciones EE.UU.**
- Robinhood
- TD Ameritrade
- E*TRADE

**Acciones Colombia**
- Alianza Valores
- Credicorp Capital
- Acciones y Valores

**Criptomonedas**
- Binance
- Coinbase
- Kraken

**Forex**
- MetaTrader 4
- IG Markets
- OANDA

### Paso 3: Consentimiento (Primera vez)

La primera vez que conectes un broker, deberás:

1. Leer los términos de conexión
2. Aceptar el acceso a datos
3. El consentimiento se guarda localmente

**Permisos solicitados:**
- Acceso a información de cuenta
- Sincronización de operaciones
- Lectura de portafolio y balance
- Envío de órdenes de trading

### Paso 4: Advertencia de Redirección

Antes de proceder, se muestra:

- Resumen de la operación
- Plataforma de destino
- Advertencia de sitio externo
- Botón para continuar o cancelar

### Paso 5: Simulación

Al confirmar:
- Se muestra un alert con los detalles
- En producción, aquí se redireccionaría al broker
- La operación queda registrada (simulado)

## Seguridad

### Advertencias Implementadas

1. **Advertencia de Redirección**
   - Aviso antes de salir de BackTrade
   - Información clara del destino
   - Opción de cancelar

2. **Consentimiento Explícito**
   - Solo se solicita la primera vez
   - Información detallada de permisos
   - Se guarda en localStorage

3. **Transparencia**
   - URL visible del broker
   - Resumen completo de la operación
   - Sin sorpresas

## Notas del Prototipo

Este es un prototipo educativo:

- No se realizan transacciones reales
- No se conecta a brokers reales
- Los datos son simulados
- Sirve para aprender el flujo de trabajo
- En producción se integraría con APIs de brokers

## Limitaciones Actuales

- No hay sistema de autenticación
- No hay persistencia de operaciones
- No hay portafolio real
- Las redirecciones son simuladas

## Próximas Funcionalidades

- Sistema de autenticación
- Historial de operaciones
- Portafolio virtual
- Simulador de balance
- Conexión real con brokers (producción)

---

Desarrollado para ayudar a traders a practicar operaciones de forma segura

