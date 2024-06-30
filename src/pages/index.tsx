import Chat from "@/components/chat-section";
import Hero from "@/components/hero";
import { Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      direction="column"
      className="h-[calc(100vh-100px)]"
      // overflow={"hidden"}
    >
      <Hero />
      <Chat />
    </Flex>
  );
}
