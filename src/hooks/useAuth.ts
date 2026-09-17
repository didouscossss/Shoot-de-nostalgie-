import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthState, subscribeToUserProfile } from "../services/auth";
import type { UserProfile } from "../models/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthState((u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    return subscribeToUserProfile(user.uid, setProfile);
  }, [user]);

  return { user, profile, initializing };
}
