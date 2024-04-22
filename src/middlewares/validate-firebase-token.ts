import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase-config";

export async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    res
      .status(403)
      .send({ message: "Token de autorización no proporcionado." });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken!);
    req.body.admin = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(403).send({ message: "Token de autorización no válido." });
  }
}
