import { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import { getHistoricalData } from '../services/api'
import { Loader2, AlertCircle } from 'lucide-react'

function Chart({ symbol, timeframe, activeIndicators }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    loadChartData();
  }, [symbol, timeframe]);

  useEffect(() => {
    updateIndicators();
  }, [activeIndicators]);

  const loadChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHistoricalData(symbol, timeframe);
      
      if (!chartRef.current || !data.data) return;

      // Clear existing series
      Object.keys(seriesRef.current).forEach(key => {
        if (key !== 'indicatorsData' && seriesRef.current[key]) {
          try {
            chartRef.current.removeSeries(seriesRef.current[key]);
          } catch (e) {
            console.log('Error removing series:', e);
          }
        }
      });
      seriesRef.current = {};

      // Add candlestick series
      const candlestickSeries = chartRef.current.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      const formattedData = data.data.map(d => {
        // Formatear tiempo según el timeframe
        let time = d.time;
        if (typeof time === 'string') {
          // Si contiene espacio, es formato "YYYY-MM-DD HH:MM:SS"
          if (time.includes(' ')) {
            time = time.split(' ')[0]; // Solo fecha
          }
        }
        
        return {
          time: time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        };
      });

      candlestickSeries.setData(formattedData);
      seriesRef.current.candlestick = candlestickSeries;

      // Store indicators data
      seriesRef.current.indicatorsData = {
        data: formattedData,
        indicators: data.indicators
      };

      updateIndicators();
      chartRef.current.timeScale().fitContent();
      
    } catch (err) {
      console.error('Error loading chart:', err);
      setError('No se pudieron cargar los datos. Verifica que el backend esté ejecutándose en el puerto 5000.');
    } finally {
      setLoading(false);
    }
  };

  const updateIndicators = () => {
    if (!chartRef.current || !seriesRef.current.indicatorsData) return;

    const { data, indicators } = seriesRef.current.indicatorsData;

    // Remove existing indicator series
    ['sma20', 'sma50', 'ema12', 'ema26', 'rsi', 'macd'].forEach(key => {
      if (seriesRef.current[key]) {
        try {
          chartRef.current.removeSeries(seriesRef.current[key]);
        } catch (e) {
          console.log('Error removing indicator:', e);
        }
        delete seriesRef.current[key];
      }
    });

    // Add SMA 20
    if (activeIndicators.sma20 && indicators.sma20?.length > 0) {
      const sma20Series = chartRef.current.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
        title: 'SMA 20',
      });
      const sma20Data = indicators.sma20.map((value, index) => {
        const dataPoint = data[data.length - indicators.sma20.length + index];
        if (!dataPoint || value === null || value === undefined) return null;
        return {
          time: dataPoint.time,
          value: value
        };
      }).filter(d => d !== null);
      
      if (sma20Data.length > 0) {
        sma20Series.setData(sma20Data);
        seriesRef.current.sma20 = sma20Series;
      }
    }

    // Add SMA 50
    if (activeIndicators.sma50 && indicators.sma50?.length > 0) {
      const sma50Series = chartRef.current.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'SMA 50',
      });
      const sma50Data = indicators.sma50.map((value, index) => {
        const dataPoint = data[data.length - indicators.sma50.length + index];
        if (!dataPoint || value === null || value === undefined) return null;
        return {
          time: dataPoint.time,
          value: value
        };
      }).filter(d => d !== null);
      
      if (sma50Data.length > 0) {
        sma50Series.setData(sma50Data);
        seriesRef.current.sma50 = sma50Series;
      }
    }

    // Add EMA 12
    if (activeIndicators.ema12 && indicators.ema12?.length > 0) {
      const ema12Series = chartRef.current.addLineSeries({
        color: '#06b6d4',
        lineWidth: 2,
        title: 'EMA 12',
      });
      const ema12Data = indicators.ema12.map((value, index) => {
        const dataPoint = data[data.length - indicators.ema12.length + index];
        if (!dataPoint || value === null || value === undefined) return null;
        return {
          time: dataPoint.time,
          value: value
        };
      }).filter(d => d !== null);
      
      if (ema12Data.length > 0) {
        ema12Series.setData(ema12Data);
        seriesRef.current.ema12 = ema12Series;
      }
    }

    // Add EMA 26
    if (activeIndicators.ema26 && indicators.ema26?.length > 0) {
      const ema26Series = chartRef.current.addLineSeries({
        color: '#ec4899',
        lineWidth: 2,
        title: 'EMA 26',
      });
      const ema26Data = indicators.ema26.map((value, index) => {
        const dataPoint = data[data.length - indicators.ema26.length + index];
        if (!dataPoint || value === null || value === undefined) return null;
        return {
          time: dataPoint.time,
          value: value
        };
      }).filter(d => d !== null);
      
      if (ema26Data.length > 0) {
        ema26Series.setData(ema26Data);
        seriesRef.current.ema26 = ema26Series;
      }
    }

    // Note: RSI and MACD would ideally be in separate panes
    // For this MVP, we're keeping them simple
  };

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          Gráfico de {symbol} - {timeframe}
        </h3>
        {loading && (
          <div className="flex items-center text-accent-blue">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm">Cargando...</span>
          </div>
        )}
      </div>

      <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />
      
      {error && (
        <div className="mt-4 bg-accent-red/10 border border-accent-red/30 rounded-lg p-4 text-center">
          <p className="text-accent-red font-semibold mb-2">Error al cargar</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button 
            onClick={loadChartData}
            className="mt-3 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}

export default Chart

