import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export function initializePersistentAuth(app: FirebaseApp) { return getAuth(app); }
