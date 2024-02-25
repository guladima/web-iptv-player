import { Suspense, lazy } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import ChanelList from "@/components/ChanelList";

const Player = lazy(() => import("@/components/Player"));

function App() {
  return (
    <ThemeProvider>
      <Header />
      <div className="container xl:flex gap-4 mb-6">
        <div className="w-full xl:w-9/12">
          <Suspense fallback="Loading...">
            <Player />
          </Suspense>
        </div>
        <div className="w-full xl:w-3/12">
          <ChanelList />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
