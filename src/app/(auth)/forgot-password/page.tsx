import { ForgotPasswordCard } from "@/app-components/ForgotPasswordCard";

const ForgotPasswordPage = () => {
    return (
        <div className="h-full flex items-center justify-center flex-col dark:bg-gray-900">
            {/* <h1 className="text-center text-4xl text-black font-extrabold tracking-tight text-balance dark:text-white m-24 mt-0">
                Point of Sale
            </h1> */}
            <ForgotPasswordCard />
        </div>
    );
};

export default ForgotPasswordPage;
