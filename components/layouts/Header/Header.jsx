
import Menus from './components/Menus';
import ThemeToggle from '@/components/Theme/ThemeToggle';

export default async function Header() {
    return (
        <header className='top-0 z-50 w-full px-4 sm:px-6'>
            <div className="mx-auto flex max-w-7xl items-center gap-3 py-4 sm:gap-5">
                <Menus />
                <ThemeToggle />
            </div>
        </header>
    );
}
