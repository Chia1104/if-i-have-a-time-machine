import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useReducer,
  type FC,
} from "react";
import { api } from "@/utils";
import { useSession } from "next-auth/react";

interface State {
  status: Status;
  raw?: string | null;
}

enum Status {
  IDLE = "idle",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

enum ActionType {
  SET_TOKEN,
}

interface Action {
  type: ActionType;
  payload: {
    status: Status;
    raw: string | null;
  };
}

const initialState: State = {
  status: Status.IDLE,
  raw: null,
};

const TokenContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.SET_TOKEN:
      return {
        status: action.payload.status,
        raw: action.payload.raw,
      };
    default:
      return state;
  }
};

const TokenWrapped: FC = () => {
  const { dispatch } = useContext(TokenContext);
  const { data: sessionData } = useSession();
  api.auth.getAccessToken.useQuery(undefined, {
    onSuccess: (data) => {
      if (!data || !data.access_token) {
        dispatch({
          type: ActionType.SET_TOKEN,
          payload: {
            status: Status.UNAUTHENTICATED,
            raw: null,
          },
        });
        return;
      }
      dispatch({
        type: ActionType.SET_TOKEN,
        payload: {
          status: Status.AUTHENTICATED,
          raw: data?.access_token || null,
        },
      });
    },
    onError: () => {
      dispatch({
        type: ActionType.SET_TOKEN,
        payload: {
          status: Status.UNAUTHENTICATED,
          raw: null,
        },
      });
    },
    enabled: sessionData?.user !== undefined,
  });

  return null;
};

const TokenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TokenContext.Provider value={{ state, dispatch }}>
      <TokenWrapped />
      {children}
    </TokenContext.Provider>
  );
};

export { TokenProvider, TokenContext, type State as TokenState };
