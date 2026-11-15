import Link from "next/link";
import Icon from "@/components/Icon";
import SearchBar from "@/components/SearchBar";

function IconButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Icon name={icon} />
    </button>
  );
}

export default function Header({ onMenu }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-4 sm:px-3">
      <IconButton icon="menu" label="Toggle navigation menu" onClick={onMenu} />

      <Link href="/" className="flex shrink-0 items-center gap-2 rounded-md pr-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-white shadow-sm">
          <Icon name="sparkle" className="h-5 w-5" />
        </span>
        <span className="hidden text-lg font-medium tracking-tight text-gray-800 lg:block">
          Motion <span className="font-normal text-gray-500">Console</span>
        </span>
      </Link>

      <button
        type="button"
        className="hidden shrink-0 items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50 md:flex"
      >
        <Icon name="layers" className="h-4 w-4 text-gray-500" />
        demo-animations
        <Icon name="dropdown" className="h-4 w-4 text-gray-500" />
      </button>

      <div className="flex min-w-0 flex-1 justify-center">
        <SearchBar />
      </div>

      <div className="hidden items-center sm:flex">
        <IconButton icon="help" label="Help" />
        <IconButton icon="bell" label="Notifications" />
        <IconButton icon="settings" label="Settings" />
      </div>
      <span
        className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-medium text-white"
        aria-label="Account"
      >
        A
      </span>
    </header>
  );
}
