import { UserDetails } from "@/lib/types";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import CText from "../core/ctext";
import { Button } from "../ui/button";

interface AppointmentFormProps {
  userDetails: UserDetails;
  handleUserDetailsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserDetailsSubmit: () => void;
}

export default function AppointmentForm({
  handleUserDetailsChange,
  userDetails,
  handleUserDetailsSubmit,
}: AppointmentFormProps) {
  const [errors, setErrors] = React.useState({ phone: "" });

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrors({ ...errors, phone: "Phone number must be 10 digits long" });
    } else {
      setErrors({ ...errors, phone: "" });
    }
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    handleUserDetailsChange(e);

    if (name === "phone") {
      validatePhoneNumber(value);
    }
  }

  return (
    <>
      <Box bg="white" p={4} borderRadius="md" shadow="md" mt={4}>
        <VStack spacing={3}>
          <Flex width="100%" direction="column">
            <label htmlFor="name" className="text-sm text-gray-500">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={handleUserDetailsChange}
              required
            />
          </Flex>

          <Flex width="100%" direction="column">
            <label htmlFor="email" className="text-sm text-gray-500">
              Email
            </label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              value={userDetails.email}
              onChange={handleUserDetailsChange}
              required
            />
          </Flex>

          <Flex width="100%" direction="column">
            <label htmlFor="phone" className="text-sm text-gray-500">
              Phone Number
            </label>
            <InputGroup>
              <InputLeftAddon>+91</InputLeftAddon>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone Number"
                type="tel"
                value={userDetails.phone}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
            {errors.phone && (
              <CText color="red.500" fontSize="sm">
                {errors.phone}
              </CText>
            )}
          </Flex>

          <Flex width="100%" direction="column">
            <label htmlFor="dob" className="text-sm text-gray-500">
              Date of Birth (DD/MM/YYYY)
            </label>
            <Input
              id="dob"
              name="dob"
              placeholder="Date of Birth (DD/MM/YYYY)"
              type="date"
              value={userDetails.dob}
              onChange={handleUserDetailsChange}
            />
          </Flex>
          <Button
            disabled={!!errors.phone}
            onClick={handleUserDetailsSubmit}
            className="w-full"
          >
            <CText>Submit Details</CText>
          </Button>
        </VStack>
      </Box>
    </>
  );
}
