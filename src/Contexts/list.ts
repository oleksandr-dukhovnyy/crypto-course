// TODO: migrate to reducers

/*
import { createContext } from 'react';

interface SetType {
  type: 'set';
  payload: Asset.Item[];
}

interface PutType {
  type: 'put';
  payload: Asset.Item;
}

interface RemoveType {
  type: 'remove';
  payload: string; // Asset item id
}

interface Handlers {
  set(_: Asset.Item[], action: SetType): Asset.Item[];
  put(state: Asset.Item[], action: PutType): Asset.Item[];
  remove(state: Asset.Item[], action: RemoveType): Asset.Item[];
}

const handlers: Handlers = {
  set: (_, action) => action.payload,
  put: (state, action) => [action.payload, ...state],
  remove: (state, action) => state.filter(item => item.id !== action.payload),
};

function reducer(state: Asset.Item[], action: SetType | PutType | RemoveType) {
  switch (action.type) {
    case 'set':
      return handlers.set(state, action);

    case 'put':
      return handlers.put(state, action);

    case 'remove':
      return handlers.remove(state, action);
  }
}

export const ListContext = createContext<Asset.Item[]>([]);

export default reducer;

// import { useReducer } from 'react';

// export default function Counter() {
//   const [state, dispatch] = useReducer(reducer, { age: 42 });

//   return (
//     <>
//       <button onClick={() => {
//         dispatch({ type: 'incremented_age' })
//       }}>
//         Increment age
//       </button>
//       <p>Hello! You are {state.age}.</p>
//     </>
//   );
// }

*/
