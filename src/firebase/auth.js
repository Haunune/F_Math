import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";


export const CreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email,password);
};

export const SignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email,password);
};

export const SignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result
};

export const SignOut = () => {
    return auth.signOut();
}

export const ResetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const ChangePassword = (password) => {
    return updatePassword(auth.currentUser, password);
}

export const SendEmailVertify = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
}