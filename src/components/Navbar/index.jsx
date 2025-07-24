import { useState } from "react";
import { useLocation } from "react-router";

import icons from "../../assets/img";

export default function Navbar() {
    const location = useLocation().pathname;
    const [walletAddress, setWalletAddress] = useState(false);

    const handlePageClick = (path) => {
        if (location !== path) {
            window.location.pathname = path;
            return;
        }
    };

    return (
        <div className="flex flex-row justify-between px-5 py-3 select-none">
            <div className="w-1/3 flex items-center gap-2">
                <div className="text-white h-6 w-6">
                    <icons.wallet />
                </div>
                <div className="font-medium tracking-wider text-xl">
                    Web3 Wallet
                </div>
            </div>
            <div className="w-1/3 items-center flex justify-center gap-8">
                <div
                    className={
                        "px-2 border-b cursor-pointer duration-200 hover:border-white " +
                        (location === "/"
                            ? "border-white"
                            : "border-transparent")
                    }
                    onClick={() => handlePageClick("/")}
                >
                    Home (Create)
                </div>
                <div
                    className={
                        "px-2 border-b cursor-pointer duration-200 hover:border-white " +
                        (location === "/recover"
                            ? "border-white"
                            : "border-transparent")
                    }
                    onClick={() => handlePageClick("/recover")}
                >
                    Recover
                </div>
            </div>
            {/* <div className="w-1/3 items-center flex justify-end">
                <div
                    className="bg-white/20 text-white px-4 py-2 rounded cursor-pointer duration-200 hover:bg-white/30"
                    onClick={() => setWalletAddress(!walletAddress)}
                >
                    {walletAddress ? "0x123...6789" : "Connect Wallet"}
                </div>
            </div> */}
        </div>
    );
}
