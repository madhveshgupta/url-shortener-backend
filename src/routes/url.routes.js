import express from "express"
import generateCode from "../utils/generateCode.js"
import urlModel from "../models/url.model.js"

const router = express.Router()

/**
 * @POST /api/url
 * req.body = { url: "https://longurl.com" }
 */
router.post("/", async function (req, res) {
    const { url } = req.body

    if (!url || !url.trim()) {
        return res.status(400).json({ error: "Please enter a URL" })
    }

    const cleanUrl = url.trim()

    if (cleanUrl.startsWith("http://") === false && cleanUrl.startsWith("https://") === false) {
        return res.status(400).json({
            error: "Please enter a valid URL starting with http:// or https://"
        })
    }

    if (cleanUrl.length > 2048) {
        return res.status(400).json({ error: "URL is too long." })
    }

    try {
        new URL(cleanUrl)
    } catch (err) {
        return res.status(400).json({
            error: "Please enter a valid URL starting with http:// or https://"
        })
    }

    // Generate a unique 6-character Base62 short code
    let code = generateCode()
    while (await urlModel.findOne({ shortCode: code })) {
        code = generateCode()
    }

    const newUrl = await urlModel.create({
        originalUrl: cleanUrl,
        shortCode: code
    })

    return res.status(201).json({
        message: "URL shortened successfully",
        data: {
            id: newUrl._id,
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode,
            clicks: newUrl.clicks
        }
    })
})

/**
 * @GET /api/url
 */
router.get("/", async function (req, res) {
    const urls = await urlModel.find().sort({ createdAt: -1 })

    return res.status(200).json({
        message: "URLs fetched successfully",
        data: {
            urls
        }
    })
})

/**
 * @DELETE /api/url/:id
 */
router.delete("/:id", async function (req, res) {
    const { id } = req.params

    const url = await urlModel.findById(id)

    if (!url) {
        return res.status(404).json({
            message: "URL not found"
        })
    }

    await urlModel.findByIdAndDelete(id)

    return res.status(200).json({
        message: "URL deleted successfully"
    })
})

export default router
