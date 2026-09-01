
import Menus from './components/Menus';




export default async function Header() {
    return (
        <header className='sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl'>
            <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
                <Menus />
            </div>
        </header>
    );
}
