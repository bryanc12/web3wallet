import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function Recover() {
    return (
        <div className="flex flex-col min-h-screen min-w-screen">
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="flex-1 flex px-8 gap-8 my-3 min-h-fit">
                    <div className="bg-white rounded w-1/3">Left</div>
                    <div className="bg-white rounded w-2/3">Right</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
