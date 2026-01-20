import Image from "next/image";
import Homepage from "./Pages/Homepage/page";
import Navbar from "./Components/Navbar/Navbar";

export default function Home() {
  return (
   <div className="">
      <Navbar/>
      <Homepage/>
   </div>
  );
}
