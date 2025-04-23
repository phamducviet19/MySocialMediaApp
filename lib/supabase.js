import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { supabaseAnonKey, supabaseUrl } from '../constants/index';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true, 
    persistSession: true,
    detectSessionInUrl: false, 
  },
});


const appStateListener = AppState.addEventListener('change', (state) => {
  console.log("App State:", state);
  if (state === 'active') {
    console.log("App is active");
  }
});

export const removeAppStateListener = () => {
  appStateListener.remove();
};
