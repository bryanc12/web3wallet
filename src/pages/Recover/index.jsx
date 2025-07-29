import { useState, useEffect, useRef } from "react";

import { Jimp } from "jimp";
import jsQR from "jsqr";

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Upload from "../../assets/img/upload";

import apiServices from "../../services/api.services";
import icons from "../../assets/img";

export default function Recover() {
    const qrImageUploadRef = useRef(null);

    const [qrFound, setQrFound] = useState(false);
    const [qrText, setQrText] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [seedPhrase, setSeedPhrase] = useState(null);

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files.length === 0) {
            console.error("No files dropped.");
            return;
        }

        const files = Array.from(e.dataTransfer.files);
        const file = files[0];

        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            console.error(
                "Unsupported file type. Please upload a PNG or JPEG image."
            );
            return;
        }

        processImage(file);
    };

    const processImage = async (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            Jimp.read(event.target.result)
                .then((image) => {
                    const { width, height } = image.bitmap;
                    const imageData = new Uint8ClampedArray(image.bitmap.data);

                    const code = jsQR(imageData, width, height);
                    if (code) {
                        setQrText(code.data);
                        setQrFound(true);
                    } else {
                        setQrFound(false);
                        console.error("No QR code found in the image.");
                    }
                })
                .catch((err) => {
                    console.error("Error reading image:", err);
                });
        };
        reader.readAsDataURL(file);
    };

    const handleImageUploadClick = () => {
        if (qrImageUploadRef.current) {
            qrImageUploadRef.current.click();
        }
    };

    const handleImageUploadChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                console.error(
                    "Unsupported file type. Please upload a PNG or JPEG image."
                );
                return;
            }
            processImage(file);
        }
        e.target.value = ""; // Reset the input value
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        handleDecryptSeedPhrase(e.target.value);
        setShowPassword(false);
    };

    const handleCancel = () => {
        setQrFound(false);
        setQrText(null);
        setWalletData(null);
        setSeedPhrase(null);
        setPassword("");
        setShowPassword(false);
    };

    const handleDecryptSeedPhrase = (password) => {
        const decryptedSeedPhrase = apiServices.decryptSeedPhrase(
            qrText,
            password
        );

        if (decryptedSeedPhrase) {
            setSeedPhrase(decryptedSeedPhrase);
        }
    };

    useEffect(() => {
        if (!qrText) return;

        const walletData = apiServices.getQrCodeData(qrText);
        if (!walletData) {
            console.error("No wallet data found for the provided QR uploaded.");
            alert(
                "No wallet data found for the provided QR code. Please try again."
            );

            setQrFound(false);
            setQrText(null);
            return;
        }

        setWalletData(walletData);
        if (!walletData.passwordRequired) {
            handleDecryptSeedPhrase();
        }
    }, [qrText]);

    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 flex px-8 gap-8 my-3 min-h-fit">
                    <div className="w-1/3 flex flex-col gap-4">
                        <div className="text-2xl ml-1">Wallet Recovery</div>
                        <div className="bg-white flex-1 rounded flex flex-col justify-center text-black">
                            {qrFound ? (
                                <div>
                                    {walletData && (
                                        <>
                                            <div className="text-lg font-medium text-center">
                                                {walletData.walletName}
                                            </div>
                                            <div className="text-sm text-gray-500 text-center">
                                                {new Date(
                                                    walletData.walletTime
                                                ).toLocaleString()}
                                            </div>
                                            {walletData.passwordRequired && (
                                                <div className="w-full flex flex-col items-center justify-center mt-10">
                                                    <div className="flex justify-center items-center gap-2 w-2/3">
                                                        <input
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            className={
                                                                "w-full border border-slate-200 focus:border-slate-500 outline-none rounded px-2 py-1 font-medium" +
                                                                (!showPassword &&
                                                                    " tracking-widest")
                                                            }
                                                            value={password}
                                                            onChange={(e) =>
                                                                handlePasswordChange(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                        <div
                                                            className="w-5 h-5"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword
                                                                )
                                                            }
                                                        >
                                                            {showPassword ? (
                                                                <icons.eye />
                                                            ) : (
                                                                <icons.eyeCrossed />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="break-all text-center">
                                                        Password Hint:{" "}
                                                        {
                                                            walletData.walletPasswordHint
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex flex-col items-center justify-center px-32 gap-4 mt-10">
                                        {walletData?.passwordRequired && (
                                            <div
                                                onClick={
                                                    handleDecryptSeedPhrase
                                                }
                                                className="bg-green-400 hover:bg-green-500 duration-200 select-none cursor-pointer text-white rounded px-4 py-2 font-medium w-full text-center"
                                            >
                                                Unlock
                                            </div>
                                        )}
                                        <div
                                            onClick={handleCancel}
                                            className="bg-slate-400 hover:bg-slate-500 duration-200 select-none cursor-pointer text-white rounded px-4 py-2 font-medium w-full text-center"
                                        >
                                            Cancel
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center h-full gap-10"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleImageUploadClick}
                                >
                                    <input
                                        type="file"
                                        hidden={true}
                                        ref={qrImageUploadRef}
                                        accept="image/png, image/jpeg"
                                        onChange={handleImageUploadChange}
                                    />
                                    <div className="rounded w-1/6">
                                        <Upload />
                                    </div>
                                    Drag or click to upload a QR code image
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded w-2/3 text-black px-10 py-5">
                        {seedPhrase ? (
                            <div>
                                <div className="mb-2">
                                    BIP39 Mnemonic Seed Phrase
                                </div>
                                <div
                                    className={
                                        "grid grid-flow-col grid-rows-4 border rounded border-black px-4 py-2 gap-y-3" +
                                        (seedPhrase.length === 128
                                            ? " grid-cols-3"
                                            : " grid-cols-6")
                                    }
                                >
                                    {seedPhrase.map((word, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-4 grid-cols-[1fr auto]"
                                        >
                                            <div className="select-none">
                                                {index + 1}.
                                            </div>
                                            <div>{word}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="">
                                No seed phrase found or incorrect password.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
