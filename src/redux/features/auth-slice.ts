import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginWithGoogle, logout } from '@/firebase/auth/login';

type InitialState = {
    value : AuthState
}

type AuthState = {
    isAuth: boolean,
    id: string,
    name: string,
    email: string,
    picture: string
}

const initialState = {
    value: {
        isAuth: false,
        id: "",
        name: "",
        email: "",
        picture: ""
    }
} as InitialState;

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            
            return initialState;
        },
        logIn: (state, action: PayloadAction<AuthState>) => {
            return {
                value: {
                    isAuth: true,
                    id: action.payload.id,
                    name: action.payload.name,
                    email: action.payload.email,
                    picture: action.payload.picture
                }
            }
        }
    },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;