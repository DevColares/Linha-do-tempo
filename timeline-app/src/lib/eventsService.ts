import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import type { TimelineEvent } from '../types';
import { INITIAL_EXPENSES } from '../data/initialData';

const COLLECTION_NAME = 'timeline_events';

// Converte dado do Firestore em TimelineEvent
function cleanEventData(docId: string, data: any): TimelineEvent {
  return {
    id: docId,
    eventType: data.eventType || 'financial',
    title: data.title || '',
    date: data.date || '',
    description: data.description || '',
    attachments: data.attachments || [],
    location: data.location || undefined,
    amount: data.amount !== undefined ? Number(data.amount) : undefined,
    category: data.category || undefined,
    paymentMethod: data.paymentMethod || undefined,
    isEssential: data.isEssential !== undefined ? Boolean(data.isEssential) : undefined,
    momentTag: data.momentTag || undefined,
    emotion: data.emotion || undefined,
  };
}

// Ouvir atualizações em tempo real do Firestore
export function subscribeToEvents(
  onUpdate: (events: TimelineEvent[]) => void,
  onError?: (err: Error) => void
) {
  const eventsRef = collection(db, COLLECTION_NAME);
  const q = query(eventsRef, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: TimelineEvent[] = [];
      snapshot.forEach((docSnap) => {
        items.push(cleanEventData(docSnap.id, docSnap.data()));
      });
      onUpdate(items);
    },
    (err) => {
      console.error('Erro ao escutar Firestore:', err);
      if (onError) onError(err);
    }
  );
}

// Adicionar evento ao Firestore
export async function addEventToFirestore(newEvent: Omit<TimelineEvent, 'id'>): Promise<string> {
  const eventsRef = collection(db, COLLECTION_NAME);
  // Remove campos undefined para evitar erro no Firestore
  const dataToSave: any = {};
  Object.entries(newEvent).forEach(([key, val]) => {
    if (val !== undefined) {
      dataToSave[key] = val;
    }
  });

  const docRef = await addDoc(eventsRef, dataToSave);
  return docRef.id;
}

// Deletar evento do Firestore
export async function deleteEventFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

// Inicializar banco com dados padrão se estiver vazio
export async function seedInitialDataIfEmpty(): Promise<boolean> {
  const hasSeededBefore = localStorage.getItem('has_seeded_firestore_v1');
  if (hasSeededBefore) {
    return false;
  }

  const eventsRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(eventsRef);
  if (snapshot.empty) {
    const batch = writeBatch(db);
    INITIAL_EXPENSES.forEach((item) => {
      const { id, ...rest } = item;
      const newDocRef = doc(eventsRef);
      const cleanItem: any = {};
      Object.entries(rest).forEach(([k, v]) => {
        if (v !== undefined) cleanItem[k] = v;
      });
      batch.set(newDocRef, cleanItem);
    });
    await batch.commit();
    localStorage.setItem('has_seeded_firestore_v1', 'true');
    return true;
  }
  
  localStorage.setItem('has_seeded_firestore_v1', 'true');
  return false;
}

