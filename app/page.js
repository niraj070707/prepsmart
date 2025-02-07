import { Button } from "../components/ui/button";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to my websit</h1>
      <Button>Click Me</Button>
    </div> 
  );
}
