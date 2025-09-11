import AppRouter from './routes/AppRouter'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {


  return (
    <>
      <AppRouter />
      <ToastContainer autoClose={1000} limit={1} />

    </>
  )
}

export default App