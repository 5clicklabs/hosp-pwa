import { Doctor } from "@/lib/types";
import { Box, Flex, Image } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import CText from "../core/ctext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DoctorSelectionProps {
  doctors: Doctor[];
  onDoctorSelect: (doctor: Doctor) => void;
  previouslySelectedDoctor: Doctor | null;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  doctors,
  onDoctorSelect,
  previouslySelectedDoctor,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doctor) =>
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.short_description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleContinue = () => {
    if (selectedDoctor) {
      onDoctorSelect(selectedDoctor);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box>
      <Input
        placeholder="Search for a doctor..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="my-2 bg-white h-12"
      />
      <Flex overflowX="auto" pb={4}>
        {filteredDoctors.map((doctor) => (
          <Flex
            direction={"column"}
            align="center"
            justify="center"
            key={doctor.id}
            minWidth="200px"
            maxW={"200px"}
            m={2}
            p={2}
            borderWidth={1}
            borderRadius="lg"
            onClick={() => handleDoctorClick(doctor)}
            bg={selectedDoctor?.id === doctor.id ? "orange.500" : "white"}
            color={selectedDoctor?.id === doctor.id ? "white" : "black"}
            cursor="pointer"
          >
            {previouslySelectedDoctor &&
              previouslySelectedDoctor.id === doctor.id && (
                <CText fontSize="xs" color="gray.500" mb={2}>
                  You previously picked
                </CText>
              )}
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
        {!filteredDoctors.length && (
          <CText width="100%" textAlign="center">
            No doctors found
          </CText>
        )}
      </Flex>
      {selectedDoctor && (
        <Button onClick={handleContinue} className="w-full">
          <CText>Continue with {selectedDoctor.fullName}</CText>
        </Button>
      )}
    </Box>
  );
};

export default DoctorSelection;
