import { useDispatch } from "react-redux";
import firebase_app from "../config";
import { getAuth, onAuthStateChanged, signInWithRedirect, signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";


//Use Redux state for login-ed

const auth = getAuth(firebase_app);

let useRedirect = false;
let user = auth.currentUser

type userDetails = {
    isAuth: boolean,
    user_id: string,
    name: string,
    email: string,
    picture: string
}

const userMapper = (claims: userDetails) => ({
    isAuth: true,
    id: claims.user_id,
    name: claims.name,
    email: claims.email,
    picture: claims.picture
  });

export const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider).catch((error)=>{
        if(error.code === 'auth/popup-closed-by-user') {
            
        } else if (error.code === 'auth/popup-blocked') {
            
        }
    })

};


export const logout = () => {
    auth.signOut();
}

export const useAuth = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async fireUser => {
            if (fireUser) {
                const token = await fireUser.getIdTokenResult();
                const user = userMapper(token.claims as userDetails);
                dispatch({ type: "auth/logIn", payload: user })
            } else {
                user = null;
            }
        });
        return unsubscribe
    },[])
}

// // will be fired every time auth state changes
// auth.onAuthStateChanged(async fireUser => {
//     const dispatch = useDispatch()
//     if (fireUser) {
//         // in here you might want to do some further actions
//         // such as loading more data, etc.

//         // if you want to set custom claims such as roles on a user
//         // this is how to get them because they will be present
//         // on the token.claims object
//         const token = await fireUser.getIdTokenResult();
//         const user = userMapper(token.claims as userDetails); // Update the type of token.claims
//         dispatch({ type: "auth/logIn", payload: user })
//     } else {
//         user = null;
//     }
// });
