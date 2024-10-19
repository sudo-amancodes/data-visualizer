import CandleStickChart from './components/CandleStickChart';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 md:px-8 xl:px-10 py-5">
      <div className="grid xl:grid-cols-2 lg:grid-cols-2 w-full gap-5 max-w-[1300px]">
        <GridItem title="CandleStick Chart">
          <CandleStickChart />
        </GridItem>

        <GridItem title="Line Chart">
          <LineChart />
        </GridItem>

        <GridItem title="Bar Chart">
          <BarChart />
        </GridItem>

        <GridItem title="Pie Chart">
          <PieChart />
        </GridItem>
      </div>
    </main>
  );
}

function GridItem({ title, children }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-400 bg-slate-900/50 rounded-xl h-[380px]">
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
