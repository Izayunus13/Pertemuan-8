import 'firebase/auth';
import type { Persistence } from 'firebase/auth';

// Firebase exposes this in its React Native runtime entry; its shared web declarations omit it.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
