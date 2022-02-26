import { Router, Route, Routes } from 'solid-app-router';
import Predictions from './pages/predictions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Predictions />} />
        {/*<Route path="/*all" element={<NotFound />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
