import * as express from "express";
import * as functions from "firebase-functions";
import * as cors from "cors";

import { usersRoute } from "./routes/users-route";
import { vehiculosRoute } from "./routes/vehiculos-route";
import { verifyFirebaseToken } from "./middlewares/validate-firebase-token";

const app = express();
app.use(cors());

app.use(verifyFirebaseToken);

app.use("/api/users", usersRoute);
app.use("/api/vehiculos", vehiculosRoute);

exports.app = functions.https.onRequest(app);
