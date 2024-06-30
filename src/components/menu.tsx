import menuAtom from "@/atoms/menuAtom";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import AddToHomeScreenPrompt from "./add-to-homescreen-prompt";

export default function HamburgerMenu() {
  const [menuIsOpen, setMenuIsOpen] = useRecoilState(menuAtom);

  const onClose = () => {
    setMenuIsOpen({ isOpen: false });
  };

  return (
    <>
      <Drawer isOpen={menuIsOpen.isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody></DrawerBody>

          <DrawerFooter className="w-full">
            <AddToHomeScreenPrompt />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
