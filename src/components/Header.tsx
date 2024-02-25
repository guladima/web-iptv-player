import { useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ModeToggle from "@/components/ModeToggle";
import AddPlaylistForm from "@/components/AddPlaylistForm";

function Header() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className="border-b py-4 mb-4">
      <nav className="container flex justify-between items-center">
        <a href="/">Logo</a>
        <div className="flex items-center gap-4">
          {isDesktop ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add playlist</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add playlist</DialogTitle>

                  <DialogDescription>
                    Add a new playlist to your profile here. Click add when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>

                <AddPlaylistForm onOpenChange={setOpen} />
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
              <DrawerTrigger asChild>
                <Button variant="outline">Add playlist</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle>Add playlist</DrawerTitle>
                  <DrawerDescription>
                    Add a new playlist to your profile here. Click add when
                    you&apos;re done.
                  </DrawerDescription>
                </DrawerHeader>
                <AddPlaylistForm className="px-4" onOpenChange={setOpen} />
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
