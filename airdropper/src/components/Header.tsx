import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  return (
    <header className="p-4 flex items-center justify-between border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Airdropper</h1>
        <Link href="https://github.com" target="_blank">
          <FaGithub size={28} />
        </Link>
      </div>
      <div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
