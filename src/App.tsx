import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";

export const ChartComponent = (props: any) => {
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
    candlestickSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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

// const initialData = [
//   { time: "2018-12-22", open: 32.51, high: 35.00, low: 30.00, close: 33.00 },
//   { time: "2018-12-23", open: 33.00, high: 34.00, low: 31.00, close: 32.00 },
//   // Add more data points here
// ];
const generateRandomData = (numPoints: number) => {
  const data = [];
  let currentTime = new Date("2018-12-22").getTime() / 1000;
  for (let i = 0; i < numPoints; i++) {
    const open = Math.random() * 100;
    const close = Math.random() * 100;
    const high = Math.max(open, close) + Math.random() * 10;
    const low = Math.min(open, close) - Math.random() * 10;
    data.push({
      time: currentTime,
      open,
      high,
      low,
      close,
    });
    currentTime += 24 * 60 * 60; // increment by one day
  }
  return data;
};

// Dummy random
const initialData = generateRandomData(100);
export default function App(props: any) {
  useEffect(() => {
    document.querySelector("#tv-attr-logo")?.remove();
  }, []);
  return <ChartComponent {...props} data={initialData}></ChartComponent>;
}
