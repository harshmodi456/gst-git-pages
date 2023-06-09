import { ToastContainer } from "react-toastify";
import "./App.css";
import Header from "./Components/Header/Header";
import Main from "./Components/Main/Main";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
      <Footer/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
