import { use, useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QRCode from "../../components/QRCode";

import apiServices from "../../services/api.services";

import icons from "../../assets/img";

export default function Homepage() {
    const [seedPhrase, setSeedPhrase] = useState([]);

    const [mnemonicSize, setMnemonicSize] = useState();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [walletPasswordHint, setWalletPasswordHint] = useState("");

    const [walletTime, setWalletTime] = useState("");
    const [walletName, setWalletName] = useState("My Web3 Wallet");

    const [showPassword, setShowPassword] = useState(false);

    const [walletData, setWalletData] = useState();

    const handleUpdateMnemonicSize = (size) => {
        if (size === mnemonicSize) {
            return;
        }

        if (size === 128 || size === 256) {
            setMnemonicSize(size);
            localStorage.setItem("mnemonicSize", size);
            newSeedPhrase(size);
            return;
        }

        console.error(
            "Invalid mnemonic size. Use 128 or 256. Defaulting to 256."
        );

        setMnemonicSize(256);
        newSeedPhrase(256);
    };

    const newSeedPhrase = (size) => {
        const newSeedPhrase = apiServices.getSeedPhrase(size).split(" ");
        setSeedPhrase(newSeedPhrase);
    };

    const generateEncryptedWalletData = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const currentTime = new Date();
        const unixTime = currentTime.getTime();

        const encryptedWalletData = apiServices.encryptSeedPhrase(
            password,
            seedPhrase,
            unixTime,
            walletName,
            walletPasswordHint
        );

        setWalletData(encryptedWalletData);
        setWalletTime(currentTime.toLocaleString());
    };

    useEffect(() => {
        if (seedPhrase.length === 0) {
            return;
        }

        generateEncryptedWalletData();
    }, [seedPhrase]);

    useEffect(() => {
        const stringLocalMnemonicSize = localStorage.getItem("mnemonicSize");
        const localMnemonicSize = parseInt(stringLocalMnemonicSize, 10);

        if (localMnemonicSize !== 128 && localMnemonicSize !== 256) {
            handleUpdateMnemonicSize(256);
            return;
        }

        handleUpdateMnemonicSize(localMnemonicSize);
        newSeedPhrase(localMnemonicSize);
    }, []);

    // User input handlers

    const handleWalletNameChange = (name) => {
        if (name.length > 32) {
            return;
        }
        setWalletName(name);
    };

    const handleWalletPasswordHintChange = (hint) => {
        if (hint.length > 32) {
            return;
        }
        setWalletPasswordHint(hint);
    };

    const handlePasswordChange = (pass) => {
        setPassword(pass);
    };

    const handleConfirmPasswordChange = (pass) => {
        setConfirmPassword(pass);
    };

    // const copyToClipboard = async () => {
    //     try {
    //         const permissions = await navigator.permissions.query({
    //             name: "clipboard-write",
    //         });
    //         if (
    //             permissions.state === "granted" ||
    //             permissions.state === "prompt"
    //         ) {
    //             await navigator.clipboard.writeText(
    //                 `${password}`
    //             );
    //         } else {
    //             throw new Error(
    //                 "Can't access the clipboard. Check your browser permissions."
    //             );
    //         }
    //     } catch (error) {}
    // };

    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 flex px-8 gap-8 my-3 min-h-fit">
                    <div className="w-1/3 flex flex-col gap-4">
                        <div className="text-2xl ml-1">Wallet Generator</div>
                        <div className="flex-1 flex flex-col items-center">
                            <QRCode
                                walletName={walletName}
                                walletData={walletData}
                                walletTime={walletTime}
                                walletPasswordHint={walletPasswordHint}
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded w-2/3 px-10 py-5 flex flex-col text-black">
                        <div className="flex flex-col justify-between min-h-full">
                            <div>
                                <div>
                                    <div className="mb-2">
                                        BIP39 Mnemonic Seed Phrase
                                    </div>
                                    <div
                                        className={
                                            "grid grid-flow-col grid-rows-4 border rounded border-black px-4 py-2 gap-y-3" +
                                            (mnemonicSize === 128
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
                                <div className="flex flex-col gap-4 mt-5 w-fit">
                                    <div className="w-full">
                                        <div>Seed Phrase Size</div>
                                        <div className="flex gap-10 text-black">
                                            <div className="flex items-center justify-center gap-6">
                                                <div className="flex items-center justify-center gap-2 rounded bg-slate-100 relative">
                                                    <div
                                                        className={
                                                            "cursor-pointer select-none px-4 py-2 duration-200 z-50" +
                                                            (mnemonicSize ===
                                                                128 &&
                                                                " text-white font-medium")
                                                        }
                                                        onClick={() =>
                                                            handleUpdateMnemonicSize(
                                                                128
                                                            )
                                                        }
                                                    >
                                                        12
                                                    </div>
                                                    <div
                                                        className={
                                                            "cursor-pointer select-none px-4 py-2 duration-200 z-50" +
                                                            (mnemonicSize ===
                                                                256 &&
                                                                " text-white font-medium")
                                                        }
                                                        onClick={() =>
                                                            handleUpdateMnemonicSize(
                                                                256
                                                            )
                                                        }
                                                    >
                                                        24
                                                    </div>
                                                    <div
                                                        className={
                                                            "cursor-pointer select-none bg-blue-300 absolute top-0 left-0 w-1/2 h-[100%] rounded duration-200 z-40" +
                                                            (mnemonicSize ===
                                                            128
                                                                ? " ml-0"
                                                                : " ml-[50%]")
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    className="w-5 h-5 cursor-pointer"
                                                    onClick={() =>
                                                        newSeedPhrase(
                                                            mnemonicSize
                                                        )
                                                    }
                                                >
                                                    <icons.rotateRight />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div>Wallet Name (Optional)</div>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 focus:border-slate-500 outline-none rounded px-2 py-1"
                                            value={walletName}
                                            onChange={(e) =>
                                                handleWalletNameChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div>
                                            Wallet Password Hint (Optional)
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 focus:border-slate-500 outline-none rounded px-2 py-1"
                                            value={walletPasswordHint}
                                            onChange={(e) =>
                                                handleWalletPasswordHintChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div>
                                            Password (Optional, but highly
                                            recommended)
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
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
                                                        e.target.value
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
                                    </div>
                                    <div className="w-full">
                                        <div>Confirm Password</div>
                                        <div className="flex justify-center items-center gap-2">
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
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    handleConfirmPasswordChange(
                                                        e.target.value
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
                                    </div>
                                </div>
                            </div>
                            <div className="flex mt-5">
                                <div
                                    className="bg-green-400 hover:bg-green-500 select-none cursor-pointer text-white rounded px-4 py-2 font-medium"
                                    onClick={() => {
                                        generateEncryptedWalletData();
                                    }}
                                >
                                    Create Wallet
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
