import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";

const generateData = (numberOfCandles = 500, updatesPerCandle = 5, startAt = 100) => {
  const samplePoint = (i) =>
    i *
      (0.5 +
        Math.sin(i / 1) * 0.2 +
        Math.sin(i / 2) * 0.4 +
        Math.sin(i / (25 + Math.random() * 25)) * 0.8 +
        Math.sin(i / 50) * 0.5) +
    200 +
    i * 2;

  const createCandle = (val, time) => ({
    time,
    open: val,
    high: val,
    low: val,
    close: val,
  });

  const updateCandle = (candle, val) => ({
    time: candle.time,
    close: val,
    open: candle.open,
    low: Math.min(candle.low, val),
    high: Math.max(candle.high, val),
  });

  const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
  const numberOfPoints = numberOfCandles * updatesPerCandle;
  const initialData = [];
  const realtimeUpdates = [];
  let lastCandle;
  let previousValue = samplePoint(-1);
  for (let i = 0; i < numberOfPoints; ++i) {
    if (i % updatesPerCandle === 0) {
      date.setUTCDate(date.getUTCDate() + 1);
    }
    const time = date.getTime() / 1000;
    let value = samplePoint(i);
    const diff = (value - previousValue) * Math.random();
    value = previousValue + diff;
    previousValue = value;
    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time);
      lastCandle = candle;
      if (i >= startAt) {
        realtimeUpdates.push(candle);
      }
    } else {
      const newCandle = updateCandle(lastCandle, value);
      lastCandle = newCandle;
      if (i >= startAt) {
        realtimeUpdates.push(newCandle);
      } else if ((i + 1) % updatesPerCandle === 0) {
        initialData.push(newCandle);
      }
    }
  }

  return {
    initialData,
    realtimeUpdates,
  };
};

export const RealTimeChartComponent = (props: any) => {
  const {
    data,
    colors: {
      backgroundColor = "white",
      textColor = "black",
      upColor = "#26a69a",
      downColor = "#ef5350",
      wickUpColor = "#26a69a",
      wickDownColor = "#ef5350",
    } = {},
  } = props;

  const chartContainerRef = useRef<any>();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const candlestickSeries = chart.addCandlestickSeries({
      upColor,
      downColor,
      borderVisible: false,
      wickUpColor,
      wickDownColor,
    });
    candlestickSeries.setData(data.initialData);

    window.addEventListener("resize", handleResize);

    const streamingDataProvider = (function* getNextRealtimeUpdate(realtimeData) {
      for (const dataPoint of realtimeData) {
        yield dataPoint;
      }
      return null;
    })(data.realtimeUpdates);

    const intervalID = setInterval(() => {
      const update = streamingDataProvider.next();
      if (update.done) {
        clearInterval(intervalID);
        return;
      }
      candlestickSeries.update(update.value);
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalID);
      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    textColor,
    upColor,
    downColor,
    wickUpColor,
    wickDownColor,
  ]);

  return <div ref={chartContainerRef} />;
};

const initialData = generateData(2500, 20, 1000);

export default function RealTimeChartInitComponent(props: any) {
  useEffect(() => {
    document.querySelector("#tv-attr-logo")?.remove();
  }, []);
  return <RealTimeChartComponent {...props} data={initialData}></RealTimeChartComponent>;
}