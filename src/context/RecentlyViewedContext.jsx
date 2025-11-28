import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch recently viewed items when user logs in
  useEffect(() => {
    if (user) {
      fetchRecentlyViewed();
    } else {
      setRecentlyViewed([]);
    }
  }, [user]);

  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('fabricToken');
      const response = await fetch('http://localhost:5000/api/recently-viewed', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentlyViewed(data);
      } else {
        console.error('Failed to fetch recently viewed');
        setRecentlyViewed([]);
      }
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
      setRecentlyViewed([]);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentlyViewed = async (product) => {
  if (!user) return;

  try {
    const token = localStorage.getItem('fabricToken');
    const response = await fetch('http://localhost:5000/api/recently-viewed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.imageUrl,
        category: product.category,
        // ADD THESE CRITICAL FIELDS:
        inStock: product.inStock,
        stock: product.stock,
        status: product.status,
        rating: product.rating,
        reviews: product.reviews
      }),
    });

    if (response.ok) {
      const updatedRecentlyViewed = await response.json();
      setRecentlyViewed(updatedRecentlyViewed);
    } else {
      console.error('Failed to add to recently viewed');
    }
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
};

  const clearRecentlyViewed = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('fabricToken');
      const response = await fetch('http://localhost:5000/api/recently-viewed', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRecentlyViewed([]);
      } else {
        console.error('Failed to clear recently viewed');
      }
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  const removeFromRecentlyViewed = async (productId) => {
    if (!user) return;

    try {
      const updatedItems = recentlyViewed.filter(item => item.productId !== productId);
      setRecentlyViewed(updatedItems);
    } catch (error) {
      console.error('Error removing from recently viewed:', error);
    }
  };

  const value = {
    recentlyViewed,
    loading,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed,
    refreshRecentlyViewed: fetchRecentlyViewed,
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};