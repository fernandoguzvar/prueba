import { Router } from "express";
import { createVehiculos, getVehiculos, getVehiculoById, updateVehiculo, deleteVehiculo } from "../controllers/vehiculos-controllers";

const vehiculosRoute = Router();


vehiculosRoute.post("", createVehiculos);

vehiculosRoute.delete("/:vehiculoId", deleteVehiculo);
vehiculosRoute.get("", getVehiculos);
vehiculosRoute.get("/:vehiculoId", getVehiculoById);
vehiculosRoute.put("/:vehiculoId", updateVehiculo);

export { vehiculosRoute };