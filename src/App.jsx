import { Route, Routes } from 'react-router-dom'
import Navbar from './sections/Navbar'
import Footer from './sections/Footer'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import BookDemo from './pages/BookDemo'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <ScrollManager />
      <Navbar />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-a-demo" element={<BookDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
