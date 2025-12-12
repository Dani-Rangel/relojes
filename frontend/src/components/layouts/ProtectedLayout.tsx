import Navbar from "../../components/Navbar";
import CarritoSidebar from "../../components/CarritoSidebar";

export default function ProtectedLayout({ children }: { children: JSX.Element }) {
  return (
    <>
      <CarritoSidebar />
      <Navbar />
      <main className="p-6">{children}</main>
    </>
  );
}
