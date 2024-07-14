import { Doctor } from "@/lib/types";
import { Box, Flex, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import CText from "../core/ctext";
import { Button } from "../ui/button";

interface DoctorSelectionProps {
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  doctors,
  onDoctorSelect,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleContinue = () => {
    if (selectedDoctor) {
      onDoctorSelect(selectedDoctor);
    }
  };

  return (
    <Box>
      <Flex overflowX="auto" pb={4}>
        {doctors.map((doctor) => (
          <Flex
            direction={"column"}
            align="center"
            justify="center"
            key={doctor.id}
            minWidth="200px"
            m={2}
            p={2}
            borderWidth={1}
            borderRadius="lg"
            onClick={() => handleDoctorClick(doctor)}
            bg={selectedDoctor?.id === doctor.id ? "orange.500" : "white"}
            color={selectedDoctor?.id === doctor.id ? "white" : "black"}
            cursor="pointer"
          >
            <Image
              src={doctor.profile_picture}
              alt={doctor.fullName}
              borderRadius="full"
              mb={2}
            />
            <CText fontWeight="bold">{doctor.fullName}</CText>
            <CText fontSize="sm">{doctor.specialty}</CText>
            <CText textAlign="center" fontSize="xs" mt={1}>
              {doctor.short_description}
            </CText>
          </Flex>
        ))}
      </Flex>
      {selectedDoctor && (
        <Button onClick={handleContinue} className="w-full">
          <CText>Continue with Dr. {selectedDoctor.fullName}</CText>
        </Button>
      )}
    </Box>
  );
};

export default DoctorSelection;
