import { SetupBusinessCard } from "@/app-components/setupBusinessCard";

const SetupBusinessPage = () => {
    return (
        <div className="h-full flex items-center justify-center flex-col">
            {/* <h1 className="text-center text-4xl font-extrabold tracking-tight text-balance text-white m-24 mt-0">
                Point of Sale
            </h1> */}
            <SetupBusinessCard />
        </div>
    )
}

export default SetupBusinessPage;
