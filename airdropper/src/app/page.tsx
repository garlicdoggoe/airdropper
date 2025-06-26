import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <h1>Hello World</h1>
      </main>
    </div>
  );
}
