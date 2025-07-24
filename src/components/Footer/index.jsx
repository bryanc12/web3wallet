import icons from "../../assets/img";

export default function Footer() {
    return (
        <div className="flex gap-1 justify-center items-center select-none py-2">
            <div className="flex gap-1">
                A Web3 Wallet Tool created by
                <div className="flex gap-1 items-center justify-center">
                    <a
                        className="font-medium"
                        href="https://github.com/bryanc12"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Bryan
                    </a>
                    with{" "}
                    {/* <i className="fi fi-sr-heart pt-[2px] text-red-500" />{" "} */}
                    <div className="w-4 h-4 text-red-500">
                        <icons.heart />
                    </div>
                    love.
                </div>
            </div>
            <div className="flex gap-1">
                <a
                    className="font-medium"
                    href="https://github.com/bryanc12/web3wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Source Code
                </a>
                <div className="flex gap-1 items-center justify-center">
                    available on
                    {/* <i className="fi fi-brands-github pt-[2px]" /> */}
                    <div className="w-4 h-4">
                        <icons.github />
                    </div>
                    Github.
                </div>
            </div>
        </div>
    );
}
