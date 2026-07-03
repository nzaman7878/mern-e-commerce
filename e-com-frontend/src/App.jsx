import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Journal from './pages/Journal'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Verify from './pages/Verify'
import { ToastContainer} from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <>
      <div className='w-full min-h-screen flex flex-col relative'>
        <ToastContainer />
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/journal' element={<Journal />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
