import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './config';
import { User } from '@/types';

// Sign up a new user
export const signUp = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // TODO: After sign up, create a corresponding user document in Firestore
    // with isAdmin set to false by default.
    // e.g., await createUserProfile(userCredential.user.uid, { email, isAdmin: false });
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out the current user
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // --- Placeholder for isAdmin Check --- 
      // Replace this with your actual logic to determine admin status.
      // Option 1: Fetch from Firestore (requires a Firestore read function)
      // const userProfile = await getUserProfile(firebaseUser.uid);
      // const isAdmin = userProfile?.isAdmin || false;
      // Option 2: Check Custom Claims (if set)
      // const idTokenResult = await firebaseUser.getIdTokenResult();
      // const isAdmin = idTokenResult.claims.isAdmin || false;
      // Option 3: Simple check for testing (e.g., specific email)
      const isAdmin = firebaseUser.email === 'admin@example.com'; // <<< REPLACE THIS LINE
      // -------------------------------------

      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        isAdmin: isAdmin, // Set isAdmin status
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};
