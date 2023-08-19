import { createContext } from 'react';

export const ListContext = createContext<Asset.Item[]>([]);
export const DefaultsListContext = createContext<Asset.Item[]>([]);
export const ViewContext = createContext<App.View>('list');

// export default useLightStore(rootStore);
