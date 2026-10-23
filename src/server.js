import app from "./app/app.js"
import { connectDB } from "./config/db.js"
import config from "./config/config.js"

await connectDB()

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})
