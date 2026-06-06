import { useState, useEffect } from 'react';
import api from '../utils/api';

export const usePremiumAccess = (userEmail) => {
  const [hasPremium, setHasPremium] = useState(false);
  const [premiumFeatures, setPremiumFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      checkPremiumAccess();
    }
  }, [userEmail]);

  const checkPremiumAccess = async () => {
    try {
      const response = await api.get('/subscriptions/check_premium_access/', {
        params: { email: userEmail }
      });
      setHasPremium(response.data.has_premium);
      setPremiumFeatures(response.data);
    } catch (error) {
      console.error('Error checking premium access:', error);
      setHasPremium(false);
    } finally {
      setLoading(false);
    }
  };

  return { hasPremium, premiumFeatures, loading, checkPremiumAccess };
};