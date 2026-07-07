import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './Front-end/Auth/AuthContext'
import ProtectedRoute from './Front-end/Auth/ProtectedRoute'
import LandingPage from './Front-end/Landing/LandingPage'
import SignIn from './Front-end/Auth/SignIn'
import StudentLayout from './Front-end/Student/StudentLayout'
import Dashboard from './Front-end/Student/Dashboard'
import SeparatingMixtures from './Front-end/Student/Practicals/SeparatingMixtures/SeparatingMixtures'
import AcidsBases from './Front-end/Student/Practicals/AcidsBases/AcidsBases'
import Magnetism from './Front-end/Student/Practicals/Magnetism/Magnetism'
import CircuitBuilder from './Front-end/Student/Practicals/CircuitBuilder/CircuitBuilder'
import BunsenBurner from './Front-end/Student/Practicals/BunsenBurner/BunsenBurner'
import PageNotFound from './Front-end/PageNotFound'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="practicals/separating-mixtures" element={<SeparatingMixtures />} />
            <Route path="practicals/acids-bases" element={<AcidsBases />} />
            <Route path="practicals/magnetism" element={<Magnetism />} />
            <Route path="practicals/circuits" element={<CircuitBuilder />} />
            <Route path="practicals/bunsen-burner" element={<BunsenBurner />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
