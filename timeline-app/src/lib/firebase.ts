// Firebase Client SDK – configuração do projeto linhadotempo-f75b0
// As credenciais do cliente são seguras para expor no frontend.
// O arquivo de service-account (adminsdk) NÃO deve ser importado no cliente.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQTNV4lfxIujy25J9ZZOpgArUCTDhLG0w",   // ⚠️ Substitua pela Web API Key do Console Firebase
  authDomain: "linhadotempo-f75b0.firebaseapp.com",
  projectId: "linhadotempo-f75b0",
  storageBucket: "linhadotempo-f75b0.firebasestorage.app",
  messagingSenderId: "114108436125967299736",
  appId: "1:1049899518132:web:ae1976442021c54e396fe1",     // ⚠️ Substitua pelo appId do Console Firebase
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;

