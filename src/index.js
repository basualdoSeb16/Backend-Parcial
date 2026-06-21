import express from "express";
import cors from "cors";

const app = express();

import bookRoutes from "./routes/books.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use(cors());
app.use(express.json());

app.use("/api", bookRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes)

// Middleware de manejo de errores
app.use((err, req, res, next) => {
     console.log("ENTRO AL MIDDLEWARE DE ERRORES");
    console.log(err);

    res.status(err.statusCode || 500).json({
        error: err.message || "Error interno del servidor",
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});