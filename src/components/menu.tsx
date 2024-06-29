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
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
