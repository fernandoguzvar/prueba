export type TUser = {
  displayName?: string;
  email: string;
  fcmToken?: string;
  phoneNumber: string;
  photoURL?: string;
  uid: string;
  id: string;
  documentType?: string;
  documentId?: string;
  deleted: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: Date;
  userType: TUSerType;
};

type TUSerType = "ADMIN" | "STUDENT" | "TRANSPORTER";
