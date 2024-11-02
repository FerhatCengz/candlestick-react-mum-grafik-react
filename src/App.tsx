import StaticInitComponent from "./StaticTime";
import RealTimeChartInitComponent from "./RealTime";
import Binance from "./Binance";

export default function App() {
  return (
    <div>
      <h1>Static</h1>
      <StaticInitComponent />
      <hr />
      <h1>Real Time</h1>
      <RealTimeChartInitComponent />
      <h1>Binance BTCUSDT Real Time Chart</h1>
      <Binance />
    </div>
  );
}
