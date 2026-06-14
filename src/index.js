import express from "express";
const app = express()

import bookRoutes from "./routes/books.routes.js"
import categoryRoutes from "./routes/categories.routes.js"
import userRoutes from "./routes/user.routes.js"

app.use(express.json())

app.use('/api', bookRoutes)
app.use('/api', categoryRoutes)
app.use('/api', userRoutes)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})