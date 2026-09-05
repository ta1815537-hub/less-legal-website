import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

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
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return INITIAL_CONTACT_SUBMISSIONS;
    }
  },

  fetchContactSubmissionsFromCloud: async (): Promise<ContactSubmission[]> => {
    const localItems = adminStorage.getContactSubmissions();
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

      // Merge local items with cloud items so no submissions are lost
      const itemMap = new Map<string, ContactSubmission>();
      localItems.forEach(item => itemMap.set(item.id, item));
      cloudItems.forEach(item => itemMap.set(item.id, item));

      const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Could not sync contact submissions from cloud:', err);
    }
    return localItems;
  },

  addContactSubmission: async (submission: Omit<ContactSubmission, 'id' | 'timestamp' | 'status'>): Promise<ContactSubmission> => {
    const list = adminStorage.getContactSubmissions();
    const newEntry: ContactSubmission = {
      ...submission,
      id: 'c-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    
    // Construct clean payload without any undefined values for Firestore
    const firestorePayload: Record<string, any> = {
      id: newEntry.id,
      name: newEntry.name || '',
      email: newEntry.email || '',
      subject: newEntry.subject || '',
      message: newEntry.message || '',
      timestamp: newEntry.timestamp,
      status: newEntry.status
    };
    if (newEntry.transactionId) {
      firestorePayload.transactionId = newEntry.transactionId;
    }
    if (newEntry.adminNotes) {
      firestorePayload.adminNotes = newEntry.adminNotes;
    }

    // Sync to Firebase Cloud Firestore
    try {
      const docRef = await addDoc(collection(db, 'contact_submissions'), firestorePayload);
      newEntry.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc error for contact submission:', err);
    }

    const updated = [newEntry, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save submission:', e);
    }

    // Record submission timestamp for 12-hour email rate limiting
    adminStorage.recordEmailSubmission(newEntry.email);

    return newEntry;
  },

  checkEmailSubmissionRateLimit: (email: string): { isLimited: boolean; remainingMs: number; count: number } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { isLimited: false, remainingMs: 0, count: 0 };

    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();

    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('contact_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse email logs:', e);
    }

    const allSubmissions = adminStorage.getContactSubmissions();
    const subTimestamps = allSubmissions
      .filter(s => s.email.trim().toLowerCase() === cleanEmail)
      .map(s => new Date(s.timestamp).getTime());

    const localTimestamps = emailLogs[cleanEmail] || [];
    const combined = Array.from(new Set([...subTimestamps, ...localTimestamps])).sort((a, b) => a - b);

    // Filter within last 12 hours
    const recent = combined.filter(ts => (now - ts) < TWELVE_HOURS_MS);

    if (recent.length >= 2) {
      // The slot becomes available 12 hours after the oldest submission of the 2
      const oldestInWindow = recent[recent.length - 2];
      const resetTime = oldestInWindow + TWELVE_HOURS_MS;
      const remainingMs = Math.max(0, resetTime - now);
      if (remainingMs > 0) {
        return { isLimited: true, remainingMs, count: recent.length };
      }
    }

    return { isLimited: false, remainingMs: 0, count: recent.length };
  },

  recordEmailSubmission: (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();
    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('contact_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {}

    const current = (emailLogs[cleanEmail] || []).filter(ts => (now - ts) < TWELVE_HOURS_MS);
    current.push(now);
    emailLogs[cleanEmail] = current;

    try {
      localStorage.setItem('contact_form_email_submissions', JSON.stringify(emailLogs));
    } catch (e) {}
  },

  getContactSubmissionsByEmail: async (email: string): Promise<ContactSubmission[]> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return [];

    try {
      const q = query(collection(db, 'contact_submissions'));
      const querySnapshot = await getDocs(q);
      const cloudMatches: ContactSubmission[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.email && String(data.email).trim().toLowerCase() === cleanEmail) {
          cloudMatches.push({
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
        }
      });

      if (cloudMatches.length > 0) {
        cloudMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return cloudMatches;
      }
    } catch (err) {
      console.warn('Firestore fetch by email failed:', err);
    }

    // Fallback to local storage if offline or error
    const localItems = adminStorage.getContactSubmissions();
    return localItems.filter(item => item.email.trim().toLowerCase() === cleanEmail);
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
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return INITIAL_DELETION_REQUESTS;
    }
  },

  fetchDeletionRequestsFromCloud: async (): Promise<DeletionRequest[]> => {
    const localItems = adminStorage.getDeletionRequests();
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

      const itemMap = new Map<string, DeletionRequest>();
      localItems.forEach(item => itemMap.set(item.id, item));
      cloudItems.forEach(item => itemMap.set(item.id, item));

      const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Could not sync deletion requests from cloud:', err);
    }
    return localItems;
  },

  addDeletionRequest: async (req: { ticketId: string; email: string; userId?: string; reason?: string }): Promise<DeletionRequest> => {
    const list = adminStorage.getDeletionRequests();
    const newEntry: DeletionRequest = {
      ...req,
      id: 'del-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    const firestorePayload: Record<string, any> = {
      id: newEntry.id,
      ticketId: newEntry.ticketId || '',
      email: newEntry.email || '',
      timestamp: newEntry.timestamp,
      status: newEntry.status
    };
    if (newEntry.userId) firestorePayload.userId = newEntry.userId;
    if (newEntry.reason) firestorePayload.reason = newEntry.reason;
    if (newEntry.adminNotes) firestorePayload.adminNotes = newEntry.adminNotes;

    const updated = [newEntry, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save deletion request:', e);
    }

    // Sync to Firebase Cloud Firestore
    try {
      const docRef = await addDoc(collection(db, 'account_deletion_requests'), firestorePayload);
      newEntry.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc error for deletion request:', err);
    }

    adminStorage.recordDeletionSubmission(newEntry.email);

    return newEntry;
  },

  checkDeletionRequestRateLimit: (email: string): { isLimited: boolean; remainingMs: number; count: number } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { isLimited: false, remainingMs: 0, count: 0 };

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();

    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('deletion_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse deletion logs:', e);
    }

    const allRequests = adminStorage.getDeletionRequests();
    const subTimestamps = allRequests
      .filter(s => s.email.trim().toLowerCase() === cleanEmail)
      .map(s => new Date(s.timestamp).getTime());

    const localTimestamps = emailLogs[cleanEmail] || [];
    const combined = Array.from(new Set([...subTimestamps, ...localTimestamps])).sort((a, b) => a - b);

    // Filter within last 24 hours
    const recent = combined.filter(ts => (now - ts) < TWENTY_FOUR_HOURS_MS);

    // Maximum 1 deletion request per 24 hours per email
    if (recent.length >= 1) {
      const oldestInWindow = recent[recent.length - 1];
      const resetTime = oldestInWindow + TWENTY_FOUR_HOURS_MS;
      const remainingMs = Math.max(0, resetTime - now);
      if (remainingMs > 0) {
        return { isLimited: true, remainingMs, count: recent.length };
      }
    }

    return { isLimited: false, remainingMs: 0, count: recent.length };
  },

  recordDeletionSubmission: (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('deletion_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {}

    const current = (emailLogs[cleanEmail] || []).filter(ts => (now - ts) < TWENTY_FOUR_HOURS_MS);
    current.push(now);
    emailLogs[cleanEmail] = current;

    try {
      localStorage.setItem('deletion_form_email_submissions', JSON.stringify(emailLogs));
    } catch (e) {}
  },

  getDeletionRequestsByQuery: async (queryText: string): Promise<DeletionRequest[]> => {
    const clean = queryText.trim().toLowerCase();
    if (!clean) return [];

    try {
      const q = query(collection(db, 'account_deletion_requests'));
      const querySnapshot = await getDocs(q);
      const cloudMatches: DeletionRequest[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docEmail = String(data.email || '').trim().toLowerCase();
        const docTicket = String(data.ticketId || '').trim().toLowerCase();
        const docId = String(data.id || docSnap.id).trim().toLowerCase();
        const docUserId = String(data.userId || '').trim().toLowerCase();

        if (docEmail === clean || docTicket === clean || docId === clean || docUserId === clean) {
          cloudMatches.push({
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
        }
      });

      if (cloudMatches.length > 0) {
        cloudMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return cloudMatches;
      }
    } catch (err) {
      console.warn('Firestore deletion search failed:', err);
    }

    // Fallback to local storage
    const localItems = adminStorage.getDeletionRequests();
    return localItems.filter(item => {
      const itemEmail = item.email.trim().toLowerCase();
      const itemTicket = item.ticketId.trim().toLowerCase();
      const itemId = item.id.trim().toLowerCase();
      const itemUser = (item.userId || '').trim().toLowerCase();
      return itemEmail === clean || itemTicket === clean || itemId === clean || itemUser === clean;
    });
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

  // Secure Firestore Admin Authorization Checks
  verifyAdminUserInFirestore: async (user: FirebaseUser): Promise<boolean> => {
    if (!user) return false;

    // Primary Admin UID explicitly granted admin claims/access
    const PRIMARY_ADMIN_UID = 'RGZJHff9IVSXUtj28cOQmuFws613';

    if (user.uid === PRIMARY_ADMIN_UID) {
      // Background sync to Firestore admin_config
      try {
        const q = query(collection(db, 'admin_config'));
        const snap = await getDocs(q);
        let exists = false;
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.uid === PRIMARY_ADMIN_UID || (data.email && user.email && data.email.toLowerCase() === user.email.toLowerCase())) {
            exists = true;
          }
        });
        if (!exists) {
          await addDoc(collection(db, 'admin_config'), {
            type: 'admin_auth',
            uid: PRIMARY_ADMIN_UID,
            email: user.email ? user.email.toLowerCase() : 'admin@lesscreation.com',
            role: 'admin',
            admin: true,
            authorized: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Background admin_config sync for primary UID:', err);
      }
      return true;
    }

    if (!user.email) return false;
    try {
      const q = query(collection(db, 'admin_config'));
      const snap = await getDocs(q);

      if (snap.empty) {
        // Initial setup: authorize the first Firebase authenticated admin user
        await addDoc(collection(db, 'admin_config'), {
          type: 'admin_auth',
          uid: user.uid,
          email: user.email.toLowerCase(),
          role: 'admin',
          admin: true,
          authorized: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return true;
      }

      let isAuthorized = false;
      let matchedDocId: string | null = null;
      let matchedHasUid = false;

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.type === 'admin_auth' ||
          data.type === 'admin_role' ||
          data.role === 'admin' ||
          data.admin === true
        ) {
          const emailMatch = data.email && data.email.toLowerCase() === user.email?.toLowerCase();
          const uidMatch = data.uid && data.uid === user.uid;

          if (uidMatch || emailMatch) {
            isAuthorized = true;
            matchedDocId = docSnap.id;
            matchedHasUid = !!data.uid;
          }
        }
      });

      // Attach UID to existing admin document if missing
      if (isAuthorized && matchedDocId && !matchedHasUid) {
        try {
          await updateDoc(doc(db, 'admin_config', matchedDocId), {
            uid: user.uid,
            admin: true,
            updatedAt: new Date().toISOString()
          });
        } catch {
          // ignore background update error
        }
      }

      return isAuthorized;
    } catch (err) {
      console.error('Error verifying admin authorization in Firestore:', err);
      return false;
    }
  },

  registerAdminUserInFirestore: async (user: FirebaseUser): Promise<boolean> => {
    if (!user || !user.email) return false;
    try {
      const payload = {
        type: 'admin_auth',
        uid: user.uid,
        email: user.email.toLowerCase(),
        role: 'admin',
        authorized: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const q = query(collection(db, 'admin_config'));
      const snap = await getDocs(q);
      let existingDocId: string | null = null;

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.email &&
          data.email.toLowerCase() === user.email?.toLowerCase() &&
          (data.type === 'admin_auth' || data.role === 'admin')
        ) {
          existingDocId = docSnap.id;
        }
      });

      if (existingDocId) {
        await updateDoc(doc(db, 'admin_config', existingDocId), payload);
      } else {
        await addDoc(collection(db, 'admin_config'), payload);
      }
      return true;
    } catch (err) {
      console.error('Error registering admin authorization in Firestore:', err);
      return false;
    }
  }
};
