import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/users-controller";

const usersRoute = Router();


usersRoute.post("", createUser);
usersRoute.delete("/:userId", deleteUser);
usersRoute.get("", getUsers);
usersRoute.get("/:userId", getUserById);
usersRoute.put("/:userId", updateUser);

export { usersRoute };
