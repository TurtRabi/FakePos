import { useState, useEffect } from 'react'; // Import useState and useEffect
import { ApiConfig } from '@/types/pos';

const LOCAL_STORAGE_KEY = 'posApiConfig';

export const useApiConfig = () => {
  const [config, setConfig] = useState<ApiConfig>(() => {
    const defaultApiConfig: ApiConfig = {
      serviceCode: 'YOUR_SERVICE_CODE',
      posAppId: 'YOUR_POS_APP_ID',
      //apiUrl: 'https://unipoint.id.vn/api/pos/earn',
      apiUrl: 'http://localhost:5078/api/pos/earn',
    };
    console.log('useApiConfig: Initializing with defaults:', defaultApiConfig);
    try {
      const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        const mergedConfig = { ...defaultApiConfig, ...parsedConfig };
        console.log('useApiConfig: Loaded from localStorage and merged:', mergedConfig);
        return mergedConfig;
      }
    } catch (error) {
      console.error("useApiConfig: Failed to parse stored API config, using defaults:", error);
    }
    return defaultApiConfig;
  });

  useEffect(() => {
    console.log('useApiConfig: config changed, saving to localStorage:', config);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error("useApiConfig: Failed to save API config to localStorage:", error);
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    console.log('useApiConfig: updateConfig called with:', newConfig);
    setConfig(prevConfig => {
      const updated = { ...prevConfig, ...newConfig };
      console.log('useApiConfig: config updated to:', updated);
      return updated;
    });
  };

  return { config, updateConfig };
};

