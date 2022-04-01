import React from 'react';
import Settings from '../types/Settings';
import User from '../types/User';

type UserContextType = {
  user: User | null,
  settings: Settings | null,
  setSettings: (settings: Settings) => void,
};

const defaultUserContext: UserContextType = {
  user: null,
  settings: null,
  setSettings: () => {},
};

const UserContext = React.createContext<UserContextType>(defaultUserContext);

export default UserContext;
