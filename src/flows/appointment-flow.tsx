import { AppointmentCalendar } from "@/components/chat/appointment-calendar";
import AppointmentForm from "@/components/chat/appointment-form";
import DepartmentSelectionModal from "@/components/chat/department-modal";
import DoctorSelection from "@/components/chat/doctor-selection";
import InputForm from "@/components/chat/input-form";
import { OTPVerification } from "@/components/core/otp-verification";
import { Button } from "@/components/ui/button";
import { Flex, Spinner, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Message } from "../lib/types";
import { useAppointmentFlow } from "./helpers/appointment-helper";

interface AppointmentFlowProps {
  addMessage: (message: Message) => void;
  sendMessageToGPT: (
    message: string
  ) => Promise<{ response: string; departments: string[] }>;
  onFlowComplete: () => void;
}

const AppointmentFlow: React.FC<AppointmentFlowProps> = ({
  addMessage,
  sendMessageToGPT,
  onFlowComplete,
}) => {
  const flowContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (flowContainerRef.current) {
      const scrollHeight = flowContainerRef.current.scrollHeight;
      const height = flowContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      flowContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: "smooth",
      });
    }
  };

  const {
    step,
    departments,
    isModalOpen,
    setIsModalOpen,
    selectedDepartmentFromModal,
    userDetails,
    setUserDetails,
    filteredDoctors,
    selectedDoctor,
    isFetching,
    otp,
    isBooking,
    handleSubmit,
    handleDepartmentSelect,
    handleOtherDepartmentSelect,
    handleUserDetailsSubmit,
    onChangeOTP,
    verifyOTP,
    handleDoctorSelect,
    handleAppointmentSelect,
    handleConfirmAppointment,
  } = useAppointmentFlow(addMessage, sendMessageToGPT, onFlowComplete);

  useEffect(() => {
    scrollToBottom();
  }, [step]);

  return (
    <Flex direction="column" gap={4} ref={flowContainerRef}>
      {step === "input" && (
        <Flex mt={2}>
          <InputForm onSubmit={handleSubmit} isFetching={isFetching} />
        </Flex>
      )}
      {step === "departments" && (
        <VStack align="stretch" spacing={2} mt={4}>
          {departments.map((dept) => (
            <Button
              className="w-full"
              key={dept}
              onClick={() => handleDepartmentSelect(dept)}
            >
              Proceed with {dept}
            </Button>
          ))}
          {selectedDepartmentFromModal ? (
            <VStack spacing={2} mt={2}>
              <Button
                className="w-full"
                onClick={() =>
                  handleDepartmentSelect(selectedDepartmentFromModal)
                }
              >
                Proceed with {selectedDepartmentFromModal}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                Choose another department
              </Button>
            </VStack>
          ) : (
            <Button className="w-full" onClick={() => setIsModalOpen(true)}>
              Proceed with any other department
            </Button>
          )}
        </VStack>
      )}
      {step === "userDetails" && (
        <AppointmentForm
          userDetails={userDetails}
          handleUserDetailsChange={(e) =>
            setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
          }
          handleUserDetailsSubmit={() => handleUserDetailsSubmit(userDetails)}
          isFetching={isFetching}
        />
      )}
      {step === "otpverification" && (
        <OTPVerification
          onChangeOTP={onChangeOTP}
          otp={otp}
          onVerifyOTP={verifyOTP}
          isFetching={isFetching}
        />
      )}
      {step === "doctorSelection" && (
        <DoctorSelection
          doctors={filteredDoctors}
          onDoctorSelect={handleDoctorSelect}
          previouslySelectedDoctor={null}
        />
      )}
      {step === "calendar" && selectedDoctor && (
        <AppointmentCalendar
          doctorName={selectedDoctor.fullName}
          onAppointmentSelect={handleAppointmentSelect}
          onBackToDoctors={() => {
            addMessage({
              id: Date.now(),
              text: `I'd like to change my doctor`,
              sender: "user",
              timestamp: new Date().toLocaleString(),
            });
            handleDoctorSelect(selectedDoctor);
          }}
        />
      )}
      {step === "confirmation" && (
        <Flex>
          <Button onClick={handleConfirmAppointment} className="w-1/2">
            {isBooking ? <Spinner size="sm" /> : "Confirm Appointment"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              addMessage({
                id: Date.now(),
                text: `I'd like to change my appointment slot`,
                sender: "user",
                timestamp: new Date().toLocaleString(),
              });
              handleAppointmentSelect(new Date(), "");
            }}
            className="w-1/2"
          >
            Choose a different slot
          </Button>
        </Flex>
      )}

      <DepartmentSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleOtherDepartmentSelect}
      />
      <div id="recaptcha-container" style={{ display: "none" }}></div>
    </Flex>
  );
};

export default AppointmentFlow;
