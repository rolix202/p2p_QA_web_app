import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from './pages/Home'
import AddQuestionForm from './pages/AddQuestionForm'
import LoginPage from './pages/LoginPage'
import SingleQuestionPage from "./pages/SingleQuestionPage";
import QuestionPage from "./pages/QuestionPage";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
          <Route path='/' element={<Home/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route path="/questions" element={<QuestionPage />} />
            <Route path="/add-question" element={<AddQuestionForm />} />
            <Route path="/question/:id/detail" element={<SingleQuestionPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

