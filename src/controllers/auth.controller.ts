import { auth } from "../config/firebase-config";

export const deleteAccount = async (uid: string) => {
  try {
    return auth.deleteUser(uid);
  } catch (error) {
    return { error: error };
  }
};

export const createAccount = async (email: string, password: string) => {
  try {
    const user = await auth.createUser({
      email: email,
      password: password,
    });
    return { uid: user.uid, success: true };
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-exists":
        return {
          message:
            "La dirección de correo electrónico ya está en uso en otra cuenta.",
          success: false,
        };
      default:
        return {
          message: error.message,
          success: false,
        };
    }
  }
};