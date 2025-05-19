import { v4 as uuidv4 } from 'uuid';

export interface Session {
  id: string;
  figure: string;
  title: string;
  startSessionInSec: number;
  endSessionInSec: number;
  progressValue?: number;
  createdAt: number;
}

// Initial mock data
let sessions: Session[] = [];

/**
 * Get all sessions sorted by creation date (newest first)
 */
export const getAllSessions = (): Session[] => {
  return [...sessions].sort((a, b) => b.createdAt - a.createdAt);
};

/**
 * Get active session (current or upcoming)
 */
export const getActiveSession = (): Session | undefined => {
  const now = Math.floor(Date.now() / 1000);
  
  // First check for a session that's currently active
  const currentSession = sessions.find(session => 
    session.startSessionInSec <= now && session.endSessionInSec > now
  );
  
  if (currentSession) return currentSession;
  
  // If no current session, find the next upcoming session
  const upcomingSessions = sessions.filter(session => session.startSessionInSec > now);
  if (upcomingSessions.length === 0) return undefined;
  
  // Return the session that will start soonest
  return upcomingSessions.sort((a, b) => a.startSessionInSec - b.startSessionInSec)[0];
};

/**
 * Add a new session
 */
export const addSession = (session: Omit<Session, 'id' | 'createdAt'>): Session => {
  const newSession: Session = {
    ...session,
    id: uuidv4(),
    createdAt: Math.floor(Date.now() / 1000)
  };
  
  sessions.push(newSession);
  return newSession;
};

/**
 * Delete a session by ID
 */
export const deleteSession = (id: string): boolean => {
  const initialLength = sessions.length;
  sessions = sessions.filter(session => session.id !== id);
  return sessions.length < initialLength;
};
