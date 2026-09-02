import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 w-full h-[calc(100vh-4rem)]">
        <iframe
          src="https://piyushsangam.vercel.app/"
          title="About Piyush Sangam"
          className="w-full h-full border-none"
        />
      </main>
      <Footer />
    </div>
  );
}
