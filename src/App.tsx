import { Container } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EditNotePage from "./pages/EditNotePage";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <SnackbarProvider
      maxSnack={1}
      autoHideDuration={1500}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Container maxWidth="xl">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new" element={<EditNotePage />} />
            <Route path="/edit/:id" element={<EditNotePage />} />
          </Routes>
        </Router>
      </Container>
    </SnackbarProvider>
  );
};

export default App;
