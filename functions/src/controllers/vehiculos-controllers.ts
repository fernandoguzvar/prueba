import { Request, Response } from "express";
import { firestore } from "../config/firebase-config";
import { keyCollectionVehiculos } from "../config/constans";
import { TVehiculo } from "../models/types/vehiculo";

export const createVehiculos = async (req: Request, res: Response) => {
    const vehiculo: TVehiculo = req.body;

    try {
        await createAndSaveVehiculo(vehiculo, req.body.admin)
        res.status(200).send({ message: "Creado exitosamente" })
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
};

const createAndSaveVehiculo = async (vehiculo: TVehiculo, uid: string) => {
    const vehiculoData = await setData(vehiculo, uid);
    await saveVehiculosToFirestore(vehiculoData);
};

const setData = async (vehiculo: TVehiculo, uid: string): Promise<TVehiculo> => {
    const data: TVehiculo = {
        ...vehiculo,
        deleted: false,
        createdAt: new Date(),
        createdBy: uid,
        updatedAt: new Date(),
    };
    return data;
};

const saveVehiculosToFirestore = async (vehiculoData: TVehiculo) => {
    const vehiculoRef = firestore.collection(keyCollectionVehiculos).doc();
    await vehiculoRef.set({ ...vehiculoData, id: vehiculoRef.id });
};


export const getVehiculos = async (req: Request, res: Response) => {
    try {
        const vehiculosSnapshot = await firestore
            .collection(keyCollectionVehiculos)
            .orderBy("createdAt", "desc")
            .get();

        const vehiculos: any[] = [];
        for await (const doc of vehiculosSnapshot.docs) {
            const vehiculoData = doc.data();
            vehiculos.push(vehiculoData);
        }

        res.status(200).send({ content: vehiculos });
    } catch (error: any) {
        res.status(500).send({ message: error.messagge });
    }
};
export const getVehiculoById = async (req: Request, res: Response) => {
    const vehiculoId = req.params.vehiculoId;

    try {
        const vehiculoSnapshot = await firestore.collection(keyCollectionVehiculos).doc(vehiculoId).get();

        if (!vehiculoSnapshot.exists) {
            res.status(404).send({ message: "Vehículo no encontrado" });
        }

        const vehiculoData = vehiculoSnapshot.data();

        res.status(200).send({ content: vehiculoData });
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
};

export const updateVehiculo = async (req: Request, res: Response) => {
    try {
        const vehiculoId = req.params.vehiculoId;
        const vehiculoSnapshot = await firestore.collection(keyCollectionVehiculos).doc(vehiculoId).get();

        if (!vehiculoSnapshot.exists) {
            res.status(404).send({ message: "Vehículo no encontrado" });
        }

        const oldData = vehiculoSnapshot.data();

        const data = req.body;

        const newData = {
            licensePlate: data?.licensePlate ?? oldData?.licensePlate ?? "", // Placa
            brand: data?.brand ?? oldData?.brand ?? "", // Marca
            model: data?.model ?? oldData?.model ?? "", // Modelo
            passengerCapacity: data?.passengerCapacity ?? oldData?.passengerCapacity ?? 0, // Numero de pasajeros
            updatedAt: new Date(),
            updatedBy: req.body.admin,
        };
        await firestore.collection(keyCollectionVehiculos).doc(vehiculoId).update(newData);

        res
            .status(200)
            .json({ message: "Información del vehículo actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la información del vehículo:", error);
        res
            .status(500)
            .json({ message: "Error al actualizar la información del vehículo." });
    }
};

export const deleteVehiculo = async (req: Request, res: Response) => {
    try {
        const vehiculoId = req.params.vehiculoId;
        const vehiculoRef = firestore.collection(keyCollectionVehiculos).doc(vehiculoId);
        const vehiculoSnapshot = await vehiculoRef.get();

        if (!vehiculoSnapshot.exists) {
             res.status(404).send({ message: "Vehículo no encontrado" });
        }

        const newData = {
            deleted: true,
            updatedAt: new Date(),
            updatedBy: req.body.admin,
        };

        await vehiculoRef.update(newData);

        res.status(200).json({ message: "El vehículo fue eliminado correctamente" });
    } catch (error: any) {
        console.error("Error al eliminar el vehículo:", error);
        res.status(500).json({ message: "Error al eliminar la información del vehículo." });
    }
};
