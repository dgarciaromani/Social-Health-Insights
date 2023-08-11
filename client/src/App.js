import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";
import './App.css'
import Navbar from './components/NavBar'
import StickyFooter from './components/StickyFooter'
import AddressPage from './pages/AddressPage';
import TractPage from "./pages/TractPage";
import SliderPage from "./pages/SliderPage";
import HomePage from "./pages/HomePage";
import RankPage from "./pages/RankPage";
import StatesPage from "./pages/StatesPage";

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00695c',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#efefef',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/address_page" element={<AddressPage />} />
          <Route path="/tract_info_page/:tract_id" element={<TractPage />} />
          <Route path="/slider_page" element={<SliderPage />} />
          <Route path="/health_outcomes" element={<RankPage />} />
          <Route path="/states_page" element={<StatesPage />} />
        </Routes>
      </BrowserRouter>
      <StickyFooter />
    </ThemeProvider>
  );
}