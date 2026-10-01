
import Menus from './components/Menus';
import ThemeToggle from '@/components/Theme/ThemeToggle';

export default async function Header() {
    return (
        <header className='sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-xl sm:px-6'>
            <div className="mx-auto flex max-w-5xl items-center gap-3 py-4 sm:gap-5">
                <Menus />
                <ThemeToggle />
            </div>
        </header>
    );
}
