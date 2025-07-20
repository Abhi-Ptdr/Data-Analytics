import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import ExcelVisualizer from './components/ExcelVisualizer';
import SignUp from './components/SignUp';
import ExcelUpload from './components/ExcelUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExcelVisualizer />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/analyze" element={<ExcelUpload />} />
      </Routes>
    </Router>
  );
}

export default App;

