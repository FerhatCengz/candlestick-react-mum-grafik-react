import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

/* Binance bileşeni */
export default function Binance() {
  /* Durum yönetimi için useState kullanarak veri durumu oluşturma */
  const [data, setData] = useState<
    Array<{
      time: UTCTimestamp;
      open: number;
      high: number;
      low: number;
      close: number;
    }>
  >([]);

  /* Grafik konteyneri ve WebSocket referansları */
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const [wsData, setWsData] = useState<string>("");

  /* Binance API'sinden veri çekme */
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m"
      );
      const result = await response.json();
      const formattedData = result.map((item: any) => ({
        time: (item[0] / 1000) as UTCTimestamp,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      }));
      setData(formattedData);
    };

    fetchData();
  }, []);

  /* Grafik oluşturma ve tooltip ekleme */
  useEffect(() => {
    if (data.length === 0 || !chartContainerRef.current) return;

    /* Pencere yeniden boyutlandırıldığında grafiği yeniden boyutlandırma */
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    };

    /* Grafik oluşturma */
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      crosshair: {
        mode: 1, // CrosshairMode.Normal
      },
    });
    chart.timeScale().fitContent();

    /* Mum çubuğu serisi ekleme */
    const candlestickSeries: ISeriesApi<"Candlestick"> =
      chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
    candlestickSeries.setData(data);

    /* WebSocket bağlantısı kurma */
    ws.current = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
    );
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const kline = message.k;
      const newCandle = {
        time: (kline.t / 1000) as UTCTimestamp,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
      };
      candlestickSeries.update(newCandle);
      setWsData(JSON.stringify(message, null, 2)); // Gelen veriyi wsData state'ine kaydet
      document.title = `BTC/USDT: ${newCandle.close} | FC Yazılım`; // Sayfa başlığını güncelle
    };

    /* Tooltip oluşturma */
    const toolTip = document.createElement("div");
    toolTip.style.position = "absolute";
    toolTip.style.display = "none";
    toolTip.style.border = "1px solid #1976d2";
    toolTip.style.background = "white";
    toolTip.style.padding = "5px";
    toolTip.style.zIndex = "1000";
    toolTip.style.pointerEvents = "none";
    toolTip.style.fontSize = "12px";
    chartContainerRef.current.appendChild(toolTip);

    /* Crosshair hareketini dinleme ve tooltip güncelleme */
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.point || !chartContainerRef.current) {
        toolTip.style.display = "none";
        return;
      }

      /* Tooltip'in ekran dışına çıkmasını önleme */
      const { x, y } = param.point;
      if (
        x < 0 ||
        x > chartContainerRef.current.clientWidth ||
        y < 0 ||
        y > chartContainerRef.current.clientHeight
      ) {
        toolTip.style.display = "none";
        return;
      }

      /* Tarih ve saat formatlama */
      const dateStr = new Date((param.time as number) * 1000).toLocaleString(
        "tr-TR",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      /* Tooltip'i güncelleme ve konumlandırma */
      toolTip.style.display = "block";
      toolTip.style.left = `${x}px`;
      toolTip.style.top = `${y}px`;
      const seriesData = param.seriesData.get(candlestickSeries) as {
        open: number;
        high: number;
        low: number;
        close: number;
      };
      if (seriesData) {
        toolTip.innerHTML = `
                    <div>Tarih: ${dateStr}</div>
                    <div>Açılış: ${seriesData.open}</div>
                    <div>Yüksek: ${seriesData.high}</div>
                    <div>Düşük: ${seriesData.low}</div>
                    <div>Kapanış: ${seriesData.close}</div>
                `;
      }
    });

    /* Pencere yeniden boyutlandırma olayını dinleme */
    window.addEventListener("resize", handleResize);

    /* Logoyu kaldırma */
    const logo = document.querySelector("#tv-attr-logo");
    if (logo) {
      logo.remove();
    }

    /* Temizlik işlevi */
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [data]);

  return (
    <>
      {/* WebSocket'ten gelen verileri gösteren pre etiketi */}
      <pre>{wsData ? wsData : "Websocketten gelen veri yok! Lütfen bekleyin..."}</pre>
      {/* Grafik konteyneri */}
      <div ref={chartContainerRef} style={{ position: "relative" }} />;
    </>
  );
}