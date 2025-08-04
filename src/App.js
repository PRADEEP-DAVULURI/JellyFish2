import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Average from './components/Calculators/Average';
import Percentage from './components/Calculators/Percentage';
import ProfitAndLoss from './components/Calculators/ProfitandLoss';
import SimpleInterest from './components/Calculators/SimpleInterest';
import CompoundInterest from './components/Calculators/CompoundInterest';
import RatioAndProportion from './components/Calculators/RatioandProportion';
import TimeAndWork from './components/Calculators/TimeandWork';
import PipesAndCisterns from './components/Calculators/PipesandCisterns';
import TimeSpeedDistance from './components/Calculators/TimeSpeedandDistance';
import BoatsAndStreams from './components/Calculators/BoatsAndStreams';
import TrainProblems from './components/Calculators/TrainProblems';
import MixtureAndAlligation from './components/Calculators/MixtureAndAlligation';
import AgeProblems from './components/Calculators/AgeProblems';
import Partnership from './components/Calculators/Partnership';
import AreaAndPerimeter from './components/Calculators/AreaAndPerimeter';
import VolumeAndSurfaceArea from './components/Calculators/VolumeAndSurfaceArea';
import NumberSystem from './components/Calculators/NumberSystem';
import ProblemsOnNumbers from './components/Calculators/ProblemsOnNumbers';
import Calendar from './components/Calculators/Calendar';
import Clock from './components/Calculators/Clock';
import Probability from './components/Calculators/Probability';
import PermutationCombination from './components/Calculators/PermutationCombination';
import QuadraticEquations from './components/Calculators/QuadraticEquations';
import Geometry from './components/Calculators/Geometry';
import Trigonometry from './components/Calculators/Trigonometry';
import Mensuration from './components/Calculators/Mensuration';
import DataInterpretation from './components/Calculators/DataInterpretation';
import SurdsAndIndices from './components/Calculators/SurdsAndIndices';
import Logarithms from './components/Calculators/Logarithms';
import Simplification from './components/Calculators/Simplification';
import AlgebraQuadraticEquations from './components/Calculators/AlgebraQuadraticEquations';
import FinancialCalculator from './components/Calculators/FinancialCalculator';


import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/average" element={<Average />} />
        <Route path="/percentage" element={<Percentage />} />
        <Route path="/profit-and-loss" element={<ProfitAndLoss />} />
        <Route path="/simple-interest" element={<SimpleInterest />} />
        <Route path="/compound-interest" element={<CompoundInterest />} />
        <Route path="/ratio-and-proportion" element={<RatioAndProportion />} />
        <Route path="/time-and-work" element={<TimeAndWork />} />
        <Route path="/pipes-and-cisterns" element={<PipesAndCisterns />} />
        <Route path="/time,-speed-and-distance" element={<TimeSpeedDistance />} />
        <Route path="/boats-and-streams" element={<BoatsAndStreams />} />
        <Route path="/train-problems" element={<TrainProblems />} />
        <Route path="/mixture-and-alligation" element={<MixtureAndAlligation />} />
        <Route path="/age-problems" element={<AgeProblems />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/area-and-perimeter" element={<AreaAndPerimeter />} />
        <Route path="/volume-and-surface-area" element={<VolumeAndSurfaceArea />} />
        <Route path="/number-system" element={<NumberSystem />} />
        <Route path="/problems-on-numbers" element={<ProblemsOnNumbers />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/clock" element={<Clock />} />
        <Route path="/probability" element={<Probability />} />
        <Route path="/permutation-combination" element={<PermutationCombination />} />
        <Route path="/quadratic-equations" element={<QuadraticEquations />} />
        <Route path="/geometry" element={<Geometry />} />
        <Route path="/trigonometry" element={<Trigonometry />} />
        <Route path="/mensuration" element={<Mensuration />} />
        <Route path="/data-interpretation" element={<DataInterpretation />} />
        <Route path="/surds-and-indices" element={<SurdsAndIndices />} />
        <Route path="/logarithms" element={<Logarithms />} />
        <Route path="/simplification" element={<Simplification />} />
        <Route path="/algebra-quadratic-equations" element={<AlgebraQuadraticEquations />} />
        <Route path="/financialcalculator" element={<FinancialCalculator />} />
      </Routes>
    </div>
  );
}

export default App;