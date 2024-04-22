import { Request, Response } from "express";
import { firestore } from "../config/firebase-config";
import { keyCollectionUsers } from "../config/constans";
import { createAccount, deleteAccount } from "./auth.controller";
import { TClientType, TUser } from "../models/types";

export const createUser = async (req: Request, res: Response) => {
  const clientType: TClientType = req.headers["client-type"] as any;
  const user: TUser = req.body;
  const { email, documentId } = user;

  try {
    switch (clientType) {
      case "mobile":
        if (email.endsWith("@fet.edu.co")) {
          await createAndSaveUser(user, req.body.admin);
          res.status(200).send({ message: "Usuario creado correctamente" });
        } else {
          await deleteAccount(user.uid);
          res
            .status(200)
            .send({ message: "Debe ingresar con la cuenta institucional" });
        }
        break;

      case "web":
        if (!email || !documentId) {
          res.status(400).send({
            message:
              "El correo electrónico y el documento son campos obligatorios",
          });
        }

        const authResponse = await createAccount(
          email!,
          documentId!.toString()
        );
        if (authResponse.success) {
          await createAndSaveUser(
            { ...user, uid: authResponse.uid! },
            req.body.admin
          );
          res.status(200).send({ message: "Usuario creado correctamente" });
        } else {
          res.status(500).send({ message: authResponse.message });
        }
        break;

      default:
        res.status(500).send({ message: "Error al crear el usuario" });
        break;
    }
  } catch (error: any) {
    res.status(500).send({message: error.message});
}
};

const createAndSaveUser = async (user: TUser, uid: string) => {
  const userData = await setData(user, uid);
  await saveUserToFirestore(userData);
};

const setData = async (user: TUser, uid: string): Promise<TUser> => {
  const data: TUser = {
    ...user,
    id: user.uid,
    deleted: false,
    createdAt: new Date(),
    createdBy: uid,
    updatedAt: new Date(),
  };
  return data;
};

const saveUserToFirestore = async (userData: TUser) => {
  const userRef = firestore.collection(keyCollectionUsers).doc(userData.id);
  await userRef.set(userData);
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
      const userSnapshot = await firestore.collection(keyCollectionUsers).doc(userId).get();

      if (!userSnapshot.exists) {
           res.status(404).send({ message: "Usuario no encontrado" });
      }

      await deleteAccount(userId);

      await firestore.collection(keyCollectionUsers).doc(userId).update({ deleted: true });

      res.status(200).send({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
      res.status(500).send({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersSnapshot = await firestore
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();

    const users: any[] = [];
    for await (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      users.push(userData);
    }

    res.status(200).send({ content: users });
  } catch (error: any) {
    res.status(500).send({message: error.message});
}
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
      const userSnapshot = await firestore.collection(keyCollectionUsers).doc(userId).get();

      if (!userSnapshot.exists) {
           res.status(404).send({ message: "Usuario no encontrado" });
      }

      const userData = userSnapshot.data();

      res.status(200).send({ content: userData });
  } catch (error: any) {
      res.status(500).send({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userSnapshot = await firestore.collection("users").doc(userId).get();

    if (!userSnapshot.exists) {
     res.status(404).send({ message: "Usuario no encontrado" });
  }

    const oldData = userSnapshot.data();

    const data = req.body;

    const newData = {
      phoneNumber: data.phoneNumber ?? oldData?.phoneNumber ?? '',
      userType: data.userType ?? oldData?.userType ?? '',
      displayName: data.displayName ?? oldData?.displayName ?? '',
      documentId: data.documentId ?? oldData?.documentId ?? '',
      documentType: data.documentType ?? oldData?.documentType ?? '',
      fcmToken: data.fcmToken ?? oldData?.fcmToken ?? '',
      updatedAt: new Date(),
      updatedBy: req.body.admin,
    };
    await firestore.collection("users").doc(userId).update(newData);

    res
      .status(200)
      .json({ message: "Información de usuario actualizada correctamente" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al actualizar la información del usuario.", error: error.message });
  }
};
