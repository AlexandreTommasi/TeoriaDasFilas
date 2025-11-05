import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  Home,
  MM1,
  MMs,
  MM1K,
  MMsK,
  MM1N,
  MMsN,
  MG1,
  Priority1,
  Priority2,
  Priority3,
  Priority4,
} from './pages';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mm1" element={<MM1 />} />
          <Route path="/mms" element={<MMs />} />
          <Route path="/mm1k" element={<MM1K />} />
          <Route path="/mmsk" element={<MMsK />} />
          <Route path="/mm1n" element={<MM1N />} />
          <Route path="/mmsn" element={<MMsN />} />
          <Route path="/mg1" element={<MG1 />} />
          <Route path="/priority/1" element={<Priority1 />} />
          <Route path="/priority/2" element={<Priority2 />} />
          <Route path="/priority/3" element={<Priority3 />} />
          <Route path="/priority/4" element={<Priority4 />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
