import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Listings from './pages/Listings';
import MapView from './pages/MapView';
import PostListing from './pages/PostListing';
import RoomDetail from './pages/RoomDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/post-listing" element={<PostListing />} />
              <Route path="/room/:id" element={<RoomDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </Router>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
