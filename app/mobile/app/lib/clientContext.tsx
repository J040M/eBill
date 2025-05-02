import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EbillClient from './ebill';

type ClientContextType = EbillClient | null;

const ClientContext = createContext<ClientContextType>(null);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<EbillClient | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const apiUrl = await AsyncStorage.getItem('apiUrl');
        const accessToken = await AsyncStorage.getItem('accessToken')
        const refreshToken = await AsyncStorage.getItem('refreshToken')
        
        if (apiUrl) {
          const client = new EbillClient({
            apiUrl,
            ...(accessToken && { accessToken }),
            ...(refreshToken && { refreshToken }),
          });
          setClient(client);
        } else {
          console.error('apiUrl not found in AsyncStorage');
        }
      } catch (e) {
        console.error('Failed to init client', e);
      }
    };

    initClient();
  }, []);

  if (!client) return null;

  return (
    <ClientContext.Provider value={client}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const client = useContext(ClientContext);
  if (!client) {
    throw new Error('useClient must be used within a <ClientProvider>');
  }
  return client;
};
