import React, { useContext } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { showSearch, search, setSearch } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate('/collections'); 
    }
  };

  return (
    <div>
      {showSearch && (
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center justify-center w-full p-4"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded"
            placeholder="Search for products..."
          />
        </form>
      )}

      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
};

export default Home;
