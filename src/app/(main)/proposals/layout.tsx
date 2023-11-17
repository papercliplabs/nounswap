export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-start items-start w-full max-w-4xl self-center pb-8">
            <h1>My Props</h1>
            <span className="pb-10">All of your Swap Props created with NounSwap</span>
            {children}
        </div>
    );
}
