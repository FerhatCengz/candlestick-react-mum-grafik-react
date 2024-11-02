import StaticInitComponent from "./StaticTime";
import RealTimeChartInitComponent from "./RealTime";

export default function App() {
  return (
    <div>
      <h1>Static</h1>
      <StaticInitComponent />
      <hr />
      <h1>Real Time</h1>
      <RealTimeChartInitComponent />
    </div>
  );
}
