import useFrequentlyAskedOperations from "@/hooks/frequent-ops";
import { Box, Flex, Input, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Message, UserDetails } from "../lib/types";
import InputForm from "./chat/input-form";
import MessageList from "./chat/message-list";
import WelcomeOptions from "./chat/welcome-options";
import CText from "./core/ctext";
import { Button } from "./ui/button";
import AppointmentForm from "./chat/appointment-form";

const Chat: React.FC = () => {
  const { sendMessageToGPT, messages, setMessages } =
    useFrequentlyAskedOperations();
  const [showOptions, setShowOptions] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 1,
      text: "Welcome to Manipal Hospital. How may I help you?",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages([welcomeMessage]);
    setShowOptions(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: `${option}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowOptions(false);

    if (option === "Book an appointment") {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: "What can we help you with?",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setShowInputForm(true);
    }

    // Handle other options here
  };

  const handleSubmit = async (message: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowInputForm(false);
    setIsFetching(true);

    const aiMessageId = Date.now() + 1;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: aiMessageId,
        text: "",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      },
    ]);

    try {
      const extractedDepartments = await sendMessageToGPT(message, (chunk) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });

      if (extractedDepartments.length > 0) {
        setDepartments(extractedDepartments);
      } else {
        const clarificationMessage: Message = {
          id: Date.now(),
          text: "I'm sorry, I couldn't determine a specific department based on your input. Could you please provide more details about your symptoms or the type of medical assistance you need?",
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        };
        setMessages((prev) => [...prev, clarificationMessage]);
        setShowInputForm(true);
      }
    } catch (error) {
      console.error("Error getting GPT response:", error);
      toast.error(
        "Sorry, there was an error processing your request. Please try again."
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleDepartmentSelect = (department: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: `${department}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setSelectedDepartment(department);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setDepartments([]);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: "Great! Please provide your personal details for the appointment.",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setShowUserDetailsForm(true);
  };

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleUserDetailsSubmit = () => {
    if (
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.dob
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: `Name: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}\nDate of Birth: ${userDetails.dob}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowUserDetailsForm(false);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: "Thank you for providing your details. Let me find available doctors for you.",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    // Add logic to fetch and display doctors
  };

  return (
    <Flex
      className="rounded-2xl items-end"
      bg="#F5F5F5"
      height={{ base: "85%", "2xl": "95%" }}
      justify="flex-end"
      direction="column"
      p={2}
    >
      <Flex
        height="95%"
        width="100%"
        direction="column"
        overflowY="auto"
        p={2}
        mb={2}
      >
        <MessageList messages={messages} />
        {showOptions && <WelcomeOptions onOptionSelect={handleOptionSelect} />}
        {departments.length > 0 && (
          <VStack align="stretch" spacing={2} mt={4}>
            {departments.map((dept) => (
              <Button key={dept} onClick={() => handleDepartmentSelect(dept)}>
                <CText>Proceed with {dept}</CText>
              </Button>
            ))}
          </VStack>
        )}
        {showUserDetailsForm && (
          <AppointmentForm
            handleUserDetailsChange={handleUserDetailsChange}
            handleUserDetailsSubmit={handleUserDetailsSubmit}
            userDetails={userDetails}
          />
        )}
        <div ref={messagesEndRef} />
      </Flex>
      {showInputForm && (
        <InputForm onSubmit={handleSubmit} isFetching={isFetching} />
      )}
    </Flex>
  );
};

export default Chat;
