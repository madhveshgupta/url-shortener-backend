import express from "express"
import cors from "cors"
import urlRoutes from "../routes/url.routes.js"
import urlModel from "../models/url.model.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/url", urlRoutes)

/**
 * GET /:code => Atomically increments click count and redirects (HTTP 302) to the original URL
 */
app.get("/:code", async function (req, res) {
    const { code } = req.params

    const url = await urlModel.findOneAndUpdate(
        { shortCode: code },
        { $inc: { clicks: 1 } },
        { new: true }
    )

    if (!url) {
        return res.status(404).json({ error: "URL not found" })
    }

    return res.redirect(302, url.originalUrl)
})

export default app
