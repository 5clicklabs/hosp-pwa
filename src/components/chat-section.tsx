import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";

export default function Chat() {
  return (
    <>
      <Flex
        className="rounded-2xl"
        bg="#F5F5F5"
        flexGrow={1}
        overflow="auto"
        justify="flex-end"
        direction="column"
        p={2}
      >
        <InputGroup size="md">
          <Input
            placeholder="Ask me a question..."
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            height="56px"
            borderRadius={99}
            bg="white"
          />

          <InputRightElement width={{ base: "15%", lg: "10%" }} height="100%">
            <Button bg="#D0D4DD" p={2} borderRadius={999}>
              <ArrowUp className="w-5 h-5 text-gray-600" />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </>
  );
}
