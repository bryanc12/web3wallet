import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";

import icons from "../../assets/img";

export default function WalletQRCode({
    walletData,
    walletName,
    walletTime,
    walletPasswordHint,
}) {
    const [qrCodeLink, setQrCodeLink] = useState("");

    const handleDownload = (format) => {
        if (!qrCodeLink) {
            console.error("QR Code link is not available.");
            return;
        }
        const element = document.getElementById("qrCodeContainer");

        if (format === "png") {
            console.log("Downloading QR Code in format:", format);
            toPng(element)
                .then((dataUrl) => {
                    const link = document.createElement("a");
                    link.download = `${walletName || "wallet"}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error) => {
                    console.error("Error downloading PNG:", error);
                });
        }
    };

    useEffect(() => {
        if (!walletData) return;

        const stringWalletData = JSON.stringify(walletData);
        try {
            QRCode.toDataURL(stringWalletData, {
                errorCorrectionLevel: "H",
                margin: 1,
            }).then((url) => {
                setQrCodeLink(url);
            });
        } catch (error) {
            console.error("Error generating QR Code:", error);
        }
    }, [walletData]);

    return (
        <div className="flex-1 flex flex-col justify-center items-center text-black pb-5">
            <div
                className="flex flex-col items-center justify-center bg-white p-5 rounded"
                id="qrCodeContainer"
            >
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6">
                        <icons.wallet />
                    </div>
                    <div className="font-medium tracking-wider text-xl">
                        Web3 Wallet
                    </div>
                </div>
                <div className="w-4/5 flex justify-center items-center p-2 mt-6">
                    <img
                        src={qrCodeLink}
                        alt="Wallet Data QR Code"
                        className="w-full"
                    />
                </div>
                <div>{window.location.href}</div>

                {walletName && (
                    <div className="text-lg font-medium mt-2">{walletName}</div>
                )}

                {walletTime && (
                    <div className="text-sm text-gray-500">{walletTime}</div>
                )}

                {walletPasswordHint && (
                    <div className="break-all text-center">
                        Password Hint: {walletPasswordHint}
                    </div>
                )}
            </div>

            <div className="flex gap-6 mt-5">
                <div
                    className="flex items-center justify-center gap-2 rounded bg-blue-400 px-4 py-2 text-white cursor-pointer select-none duration-200 hover:bg-blue-500"
                    onClick={() => handleDownload("png")}
                >
                    <div className="h-6 w-6">
                        <icons.images />
                    </div>
                    <div>Download PNG</div>
                </div>
                {/* <div
                    className="flex items-center justify-center gap-2 rounded bg-red-400 px-4 py-2 text-white cursor-pointer select-none duration-200 hover:bg-red-500"
                    onClick={() => handleDownload("pdf")}
                >
                    <div className="h-6 w-6">
                        <icons.filepdf />
                    </div>
                    <div>Download PDF</div>
                </div> */}
            </div>
        </div>
    );
}
