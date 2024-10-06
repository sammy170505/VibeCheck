import * as SecureStore from 'expo-secure-store';
import { CLERK_PUBLISHABLE_KEY } from '@env';

export const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const publishableKey = CLERK_PUBLISHABLE_KEY;