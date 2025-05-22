import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, functions } from '../firebase'; // Assuming functions is also exported from firebase.ts for calling getUserData
import { httpsCallable } from 'firebase/functions';

interface UserData {
  // Define structure based on what getUserData returns, e.g., roles, custom claims
  // For now, let's assume it might return roles or other app-specific user info
  roles?: string[];
  // Add other fields as necessary
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null; // For custom claims and other app-specific user data
  loading: boolean;
  error: Error | null;
  loginWithGoogle: () => Promise<void>; // Example login method
  logout: () => Promise<void>;
  // getUserData: () => Promise<void>; // Potentially to refresh user data manually
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        try {
          setLoading(true);
          setError(null);
          // Call getUserData Firebase function to get custom claims and other user details
          const getUserDataFn = httpsCallable(functions, 'getUserData');
          const result = await getUserDataFn();
          setUserData(result.data as UserData); // Cast to your UserData interface
        } catch (e) {
          console.error("Error fetching user data:", e);
          setError(e as Error);
          setUserData(null); // Clear user data on error
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        setUserData(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in useEffect will then be triggered,
      // which will call getUserData and update loading state.
    } catch (e) {
      console.error("Error during Google sign-in:", e);
      setError(e as Error);
      setLoading(false); // Set loading false here only if signInWithPopup fails
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle clearing currentUser and userData
    } catch (e) {
      console.error("Error signing out:", e);
      setError(e as Error);
    } finally {
      // setLoading(false); // onAuthStateChanged will set loading to false after user is null
    }
  };
  
  // Optional: A function to manually refresh user data if needed
  // const refreshUserData = async () => {
  //   if (currentUser) {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const getUserDataFn = httpsCallable(functions, 'getUserData');
  //       const result = await getUserDataFn();
  //       setUserData(result.data as UserData);
  //     } catch (e) {
  //       console.error("Error refreshing user data:", e);
  //       setError(e as Error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
