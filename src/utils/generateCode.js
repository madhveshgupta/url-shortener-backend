import crypto from "crypto"

/**
 * Generates a 6-character Base62 short code (a-z, A-Z, 0-9) using Node's crypto module.
 */
const generateCode = () => {
    const mainString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const randomBytes = crypto.randomBytes(6)

    let shortCode = ""

    for (let i = 0; i < 6; i++) {
        shortCode += mainString.charAt(randomBytes[i] % 62)
    }

    return shortCode
}

export default generateCode
