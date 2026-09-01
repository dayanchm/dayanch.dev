"use client"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen   text-center px-4">
            <div className="max-w-lg">
                <h1 className="text-7xl font-extrabold mb-6 animate-pulse text-[var(--foreground)]">404</h1>
                <p className="text-2xl font-semibold mb-4 text-[var(--foreground)]">Oops! Lost in Space</p>
                <p className="text-[var(--foreground-muted)] mb-8">
                    The page you are looking for has drifted into a black hole.
                </p>
               
            </div>

            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translatey(0px);
                    }
                    50% {
                        transform: translatey(-10px);
                    }
                    100% {
                        transform: translatey(0px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
