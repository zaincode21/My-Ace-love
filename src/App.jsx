import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProposalPage from "./pages/ProposalPage";
import CelebrationPage from "./pages/CelebrationPage";

/**
 * Multi-page romantic site:
 *   /             — landing hero
 *   /proposal     — love letter + question
 *   /celebration  — after Yes
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="proposal" element={<ProposalPage />} />
          <Route path="celebration" element={<CelebrationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
