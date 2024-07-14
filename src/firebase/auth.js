import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";
import { Slide, toast } from "react-toastify";


export const CreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email,password);
};

export const SignInWithEmailAndPassword = (email, password) => {
    try {
        const userCredential = signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        toast.error(error, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        })
        return error;
    }
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