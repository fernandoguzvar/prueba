export type TVehiculo = {
  id: string;
  licensePlate?: string; // Placa
  brand?: string; // Marca
  model?: string; // Modelo
  passengerCapacity?: number; // Numero de pasajeros
  deleted: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: Date;
};
  
  
