import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  transactionId?: string;
  message: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  adminNotes?: string;
  firestoreDocId?: string;
}

export interface DeletionRequest {
  id: string;
  ticketId: string;
  email: string;
  userId?: string;
  reason?: string;
  timestamp: string;
  status: 'Pending' | 'Processing' | 'Completed';
  adminNotes?: string;
  firestoreDocId?: string;
}

const STORAGE_KEY_CONTACTS = 'less_legal_contact_submissions';
const STORAGE_KEY_DELETIONS = 'less_legal_deletion_requests';
// Initial seed data is empty so only real submissions are shown
const INITIAL_DELETION_REQUESTS: DeletionRequest[] = [];
const INITIAL_CONTACT_SUBMISSIONS: ContactSubmission[] = [];

export const adminStorage = {
  // Contact Submissions
  getContactSubmissions: (): ContactSubmission[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONTACTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(INITIAL_CONTACT_SUBMISSIONS));
        return INITIAL_CONTACT_SUBMISSIONS;
      }
      const parsed: ContactSubmission[] = JSON.parse(data);
      // Clean up old dummy items if any
      const realOnly = parsed.filter(item => !item.id.startsWith('c-20'));
      return realOnly;
    } catch {
      return INITIAL_CONTACT_SUBMISSIONS;
    }
  },

  fetchContactSubmissionsFromCloud: async (): Promise<ContactSubmission[]> => {
    try {
      const q = query(collection(db, 'contact_submissions'));
      const querySnapshot = await getDocs(q);
      const cloudItems: ContactSubmission[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: data.id || docSnap.id,
          firestoreDocId: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          subject: data.subject || '',
          transactionId: data.transactionId || undefined,
          message: data.message || '',
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || ''
        });
      });

      cloudItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(cloudItems));
      return cloudItems;
    } catch (err) {
      console.warn('Could not sync contact submissions from cloud:', err);
    }
    return adminStorage.getContactSubmissions();
  },

  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'timestamp' | 'status'>): ContactSubmission => {
    const list = adminStorage.getContactSubmissions();
    const newEntry: ContactSubmission = {
      ...submission,
      id: 'c-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    const updated = [newEntry, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save submission:', e);
    }

    // Sync to Firebase Cloud Firestore asynchronously
    addDoc(collection(db, 'contact_submissions'), newEntry).then((docRef) => {
      newEntry.firestoreDocId = docRef.id;
    }).catch(err => {
      console.warn('Firestore addDoc error for contact submission:', err);
    });

    return newEntry;
  },

  updateContactStatus: (id: string, status: ContactSubmission['status'], adminNotes?: string): boolean => {
    const list = adminStorage.getContactSubmissions();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;

    list[index].status = status;
    if (adminNotes !== undefined) {
      list[index].adminNotes = adminNotes;
    }

    const docId = list[index].firestoreDocId || list[index].id;

    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(list));
    } catch {
      // ignore
    }

    // Cloud update
    if (docId) {
      updateDoc(doc(db, 'contact_submissions', docId), {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {})
      }).catch(err => console.warn('Cloud update failed:', err));
    }

    return true;
  },

  deleteContactSubmission: (id: string): boolean => {
    const list = adminStorage.getContactSubmissions();
    const target = list.find(item => item.id === id);
    const filtered = list.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (target) {
      const docId = target.firestoreDocId || target.id;
      deleteDoc(doc(db, 'contact_submissions', docId)).catch(err => console.warn('Cloud delete failed:', err));
    }

    return true;
  },

  // Account Deletion Requests
  getDeletionRequests: (): DeletionRequest[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DELETIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(INITIAL_DELETION_REQUESTS));
        return INITIAL_DELETION_REQUESTS;
      }
      const parsed: DeletionRequest[] = JSON.parse(data);
      const realOnly = parsed.filter(item => !item.id.startsWith('del-10'));
      return realOnly;
    } catch {
      return INITIAL_DELETION_REQUESTS;
    }
  },

  fetchDeletionRequestsFromCloud: async (): Promise<DeletionRequest[]> => {
    try {
      const q = query(collection(db, 'account_deletion_requests'));
      const querySnapshot = await getDocs(q);
      const cloudItems: DeletionRequest[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: data.id || docSnap.id,
          firestoreDocId: docSnap.id,
          ticketId: data.ticketId || '',
          email: data.email || '',
          userId: data.userId || undefined,
          reason: data.reason || undefined,
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || ''
        });
      });

      cloudItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(cloudItems));
      return cloudItems;
    } catch (err) {
      console.warn('Could not sync deletion requests from cloud:', err);
    }
    return adminStorage.getDeletionRequests();
  },

  addDeletionRequest: (req: { ticketId: string; email: string; userId?: string; reason?: string }): DeletionRequest => {
    const list = adminStorage.getDeletionRequests();
    const newEntry: DeletionRequest = {
      ...req,
      id: 'del-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    const updated = [newEntry, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save deletion request:', e);
    }

    // Sync to Firebase Cloud Firestore asynchronously
    addDoc(collection(db, 'account_deletion_requests'), newEntry).then((docRef) => {
      newEntry.firestoreDocId = docRef.id;
    }).catch(err => {
      console.warn('Firestore addDoc error for deletion request:', err);
    });

    return newEntry;
  },

  updateDeletionStatus: (id: string, status: DeletionRequest['status'], adminNotes?: string): boolean => {
    const list = adminStorage.getDeletionRequests();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;

    list[index].status = status;
    if (adminNotes !== undefined) {
      list[index].adminNotes = adminNotes;
    }

    const docId = list[index].firestoreDocId || list[index].id;

    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(list));
    } catch {
      // ignore
    }

    if (docId) {
      updateDoc(doc(db, 'account_deletion_requests', docId), {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {})
      }).catch(err => console.warn('Cloud update failed:', err));
    }

    return true;
  },

  deleteDeletionRequest: (id: string): boolean => {
    const list = adminStorage.getDeletionRequests();
    const target = list.find(item => item.id === id);
    const filtered = list.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (target) {
      const docId = target.firestoreDocId || target.id;
      deleteDoc(doc(db, 'account_deletion_requests', docId)).catch(err => console.warn('Cloud delete failed:', err));
    }

    return true;
  },

  // Firestore Admin Auth fallback methods
  registerFirestoreAdminDoc: async (email: string, pass: string): Promise<boolean> => {
    try {
      const q = query(collection(db, 'admin_config'));
      const snap = await getDocs(q);
      let existingDocId: string | null = null;
      snap.forEach(d => {
        if (d.data().type === 'admin_auth') existingDocId = d.id;
      });

      const payload = {
        type: 'admin_auth',
        email: email.trim().toLowerCase(),
        password: btoa(pass),
        updatedAt: new Date().toISOString()
      };

      if (existingDocId) {
        await updateDoc(doc(db, 'admin_config', existingDocId), payload);
      } else {
        await addDoc(collection(db, 'admin_config'), payload);
      }
      localStorage.setItem('less_legal_admin_session', JSON.stringify({ email: email.trim(), loggedInAt: Date.now() }));
      return true;
    } catch (e) {
      console.error('Firestore admin reg error:', e);
      localStorage.setItem('less_legal_admin_creds', JSON.stringify({ email: email.trim().toLowerCase(), password: btoa(pass) }));
      localStorage.setItem('less_legal_admin_session', JSON.stringify({ email: email.trim(), loggedInAt: Date.now() }));
      return true;
    }
  },

  verifyFirestoreAdminDoc: async (email: string, pass: string): Promise<{ success: boolean; reason?: string }> => {
    try {
      const q = query(collection(db, 'admin_config'));
      const snap = await getDocs(q);
      let foundCred: { email: string; password: string } | null = null;
      snap.forEach(d => {
        if (d.data().type === 'admin_auth') {
          foundCred = { email: d.data().email, password: d.data().password };
        }
      });

      if (!foundCred) {
        const localCred = localStorage.getItem('less_legal_admin_creds');
        if (localCred) {
          foundCred = JSON.parse(localCred);
        }
      }

      if (!foundCred) {
        await adminStorage.registerFirestoreAdminDoc(email, pass);
        return { success: true };
      }

      if (foundCred.email.toLowerCase() === email.trim().toLowerCase() && foundCred.password === btoa(pass)) {
        localStorage.setItem('less_legal_admin_session', JSON.stringify({ email: email.trim(), loggedInAt: Date.now() }));
        return { success: true };
      } else {
        return { success: false, reason: 'Invalid email or password' };
      }
    } catch {
      const localCred = localStorage.getItem('less_legal_admin_creds');
      if (localCred) {
        const parsed = JSON.parse(localCred);
        if (parsed.email === email.trim().toLowerCase() && parsed.password === btoa(pass)) {
          localStorage.setItem('less_legal_admin_session', JSON.stringify({ email: email.trim(), loggedInAt: Date.now() }));
          return { success: true };
        }
      }
      await adminStorage.registerFirestoreAdminDoc(email, pass);
      return { success: true };
    }
  }
};
