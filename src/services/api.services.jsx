import { Buffer } from "buffer";

import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

import { sha3_256 } from "js-sha3";
import { ChaCha20Poly1305 } from "@stablelib/chacha20poly1305";

function encryptSeedPhrase(
    password,
    seedPhrase,
    walletTime,
    walletName = "",
    walletPasswordHint = ""
) {
    const nonce = crypto.getRandomValues(new Uint8Array(16));
    const nonceString = Buffer.from(nonce).toString("base64");

    const hashedPasswordHexString = sha3_256(nonceString + password);
    const hashedPasswordByte = Buffer.from(hashedPasswordHexString, "hex");

    const cipher = new ChaCha20Poly1305(hashedPasswordByte);

    const seedPhraseByte = Buffer.from(seedPhrase.join(" "), "utf8");
    const encryptedSeedPhraseByte = cipher.seal(
        nonce,
        seedPhraseByte,
        walletTime
    );
    const encryptedSeedPhraseBase64String = Buffer.from(
        encryptedSeedPhraseByte
    ).toString("base64");

    var encryptedWalletData = {
        v: 1,
        alg: "ChaCha20Poly1305",
        name: walletName,
        nonce: nonceString,
        password: hashedPasswordHexString,
        hint: walletPasswordHint,
        walletTime: walletTime,
        ciphertext: encryptedSeedPhraseBase64String,
    };

    const encryptedWalletDataBase64String = Buffer.from(
        JSON.stringify(encryptedWalletData)
    ).toString("base64");

    return encryptedWalletDataBase64String;
}

function getQrCodeData(encryptedWalletDataBase64String) {
    try {
        const encryptedWalletData = JSON.parse(
            Buffer.from(encryptedWalletDataBase64String, "base64").toString(
                "utf8"
            )
        );

        const { nonce, password, hint, walletTime, name } = encryptedWalletData;

        const walletTimeNumber = parseInt(walletTime, 10);

        // If hashedPasswordHexString is equal to password, then password is not required
        const hashedPasswordHexString = sha3_256(nonce);

        return {
            walletName: name,
            walletTime: walletTimeNumber,
            walletPasswordHint: hint,
            passwordRequired: hashedPasswordHexString !== password,
        };
    } catch (error) {
        console.error("Error parsing QR code data:", error);
        return null;
    }
}

function decryptSeedPhrase(encryptedWalletDataBase64String, password = "") {
    try {
        const encryptedWalletData = JSON.parse(
            Buffer.from(encryptedWalletDataBase64String, "base64").toString(
                "utf8"
            )
        );

        const { nonce, walletTime, ciphertext } = encryptedWalletData;

        const nonceByte = Buffer.from(nonce, "base64");
        const walletTimeNumber = parseInt(walletTime, 10);
        const encryptedSeedPhraseByte = Buffer.from(ciphertext, "base64");

        const hashedPasswordHexString = sha3_256(nonce + password);
        const hashedPasswordByte = Buffer.from(hashedPasswordHexString, "hex");

        const cipher = new ChaCha20Poly1305(hashedPasswordByte);

        const decryptedSeedPhraseByte = cipher.open(
            nonceByte,
            encryptedSeedPhraseByte,
            walletTimeNumber
        );

        if (!decryptedSeedPhraseByte) {
            console.log("Decryption failed. Incorrect password or data.");
            return null;
        }

        const decryptedSeedPhrase = Buffer.from(
            decryptedSeedPhraseByte
        ).toString("utf8");

        return decryptedSeedPhrase.split(" ");
    } catch (error) {
        console.error("Error decrypting seed phrase:", error);
        return null;
    }
}

function getSeedPhrase(size = 256) {
    return bip39.generateMnemonic(wordlist, size);
}

const apiServices = {
    encryptSeedPhrase,
    decryptSeedPhrase,
    getQrCodeData,
    getSeedPhrase,
};

export default apiServices;
