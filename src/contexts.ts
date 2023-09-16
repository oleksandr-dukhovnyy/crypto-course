import { createContext } from 'react';

export const ListContext = createContext<Asset.Item[]>([]);
export const DefaultsListContext = createContext<Asset.Item[]>([]);
export const ViewContext = createContext<App.View>('list');
export const ThemeContext = createContext<App.Theme>('light');

// export default useLightStore(rootStore);
