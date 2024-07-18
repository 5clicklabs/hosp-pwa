import useOperations from "@/hooks/operations";
import { MANIPAL_DOCTORS } from "@/lib/doctors";
import { auth } from "@/lib/firebase.config";
import { downloadICSFile } from "@/lib/utils";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
} from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { AppointmentData, Doctor, Message, UserDetails } from "../../lib/types";

/**
 * Custom hook for managing the appointment flow logic
 * @param addMessage Function to add a message to the chat
 * @param sendMessageToGPT Function to send a message to GPT
 * @param onFlowComplete Function to call when the flow is complete
 */
export const useAppointmentFlow = (
  addMessage: (message: Message) => void,
  sendMessageToGPT: (
    message: string
  ) => Promise<{ response: string; departments: string[] }>,
  onFlowComplete: () => void
) => {
  const [user] = useAuthState(auth);

  // State declarations
  const [step, setStep] = useState<
    | "input"
    | "departments"
    | "userDetails"
    | "otpverification"
    | "doctorSelection"
    | "calendar"
    | "confirmation"
  >("input");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartmentFromModal, setSelectedDepartmentFromModal] =
    useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [otp, setOTP] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const { bookAppointment, isBooking } = useOperations();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const initialMessageSent = useRef(false);

  // Effect for initial message
  useEffect(() => {
    if (!initialMessageSent.current) {
      addMessage({
        id: Date.now(),
        text: "What can we help you with?",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
      setStep("input");
      initialMessageSent.current = true;
    }
  }, [addMessage]);

  // Effect for RecaptchaVerifier initialization
  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => console.log("reCAPTCHA verified"),
            "expired-callback": () => console.log("reCAPTCHA expired"),
          }
        );
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
      }
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  /**
   * Prefilling the user's phone number in the appointment-form if the user is logged in
   * @dependency user
   */
  useEffect(() => {
    if (user) {
      setUserDetails({
        ...userDetails,
        phone: user.phoneNumber?.split("+91")[1] || "",
      });
    }
  }, [user]);

  /**
   * Handles the submission of user's initial query
   * @param message User's input message
   */
  const handleSubmit = async (message: string) => {
    setIsFetching(true);
    addMessage({
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });

    try {
      const { response, departments } = await sendMessageToGPT(message);
      addMessage({
        id: Date.now(),
        text: response,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });

      if (departments.length > 0) {
        setDepartments(departments);
        setStep("departments");
      } else {
        addMessage({
          id: Date.now(),
          text: "I'm sorry, I couldn't determine a specific department based on your input. Could you please provide more details?",
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        });
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

  /**
   * Handles the selection of a department
   * @param department Selected department
   */
  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    addMessage({
      id: Date.now(),
      text: `${department}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });
    addMessage({
      id: Date.now(),
      text: "Great! Please provide your personal details for the appointment.",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("userDetails");
  };

  /**
   * Handles the selection of a department from the modal
   * @param department Selected department
   */
  const handleOtherDepartmentSelect = (department: string) => {
    setSelectedDepartmentFromModal(department);
  };

  /**
   * Handles the submission of user details
   * @param details User details
   */
  const handleUserDetailsSubmit = async (details: UserDetails) => {
    setUserDetails(details);
    addMessage({
      id: Date.now(),
      text: `Name: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}\nDate of Birth: ${details.dob}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });

    if (!auth.currentUser) {
      setIsFetching(true);
      try {
        const phoneProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneProvider.verifyPhoneNumber(
          `+91${details.phone}`,
          recaptchaVerifierRef.current!
        );
        setVerificationId(verificationId);
        addMessage({
          id: Date.now(),
          text: `Please verify your phone number to proceed.`,
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        });
        setStep("otpverification");
      } catch (error) {
        toast.error("Failed to send verification code. Please try again.");
      } finally {
        setIsFetching(false);
      }
    } else {
      proceedToDoctorSelection();
    }
  };

  /**
   * Handles OTP change
   * @param pin OTP entered by user
   */
  const onChangeOTP = (pin: string) => {
    setOTP(pin);
  };

  /**
   * Verifies the OTP entered by the user
   */
  const verifyOTP = async () => {
    if (verificationId && otp) {
      setIsFetching(true);
      try {
        const credential = PhoneAuthProvider.credential(verificationId, otp);
        await signInWithCredential(auth, credential);
        toast.success("Phone number verified successfully!");
        proceedToDoctorSelection();
      } catch (error) {
        console.error("Error during OTP verification:", error);
        toast.error("Invalid OTP. Please try again.");
      } finally {
        setIsFetching(false);
      }
    }
  };

  /**
   * Proceeds to doctor selection after successful verification
   */
  const proceedToDoctorSelection = () => {
    const departmentDoctors = MANIPAL_DOCTORS.filter(
      (doctor) => doctor.department === selectedDepartment
    );
    setFilteredDoctors(departmentDoctors);
    addMessage({
      id: Date.now(),
      text: `Select a doctor from the ${selectedDepartment} department to continue.`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("doctorSelection");
  };

  /**
   * Handles the selection of a doctor
   * @param doctor Selected doctor
   */
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    addMessage({
      id: Date.now(),
      text: `${doctor.fullName}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });
    addMessage({
      id: Date.now(),
      text: `Let's proceed to schedule your appointment.`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("calendar");
  };

  /**
   * Handles the selection of an appointment slot
   * @param date Selected date
   * @param time Selected time
   */
  const handleAppointmentSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedSlot(time);
    addMessage({
      id: Date.now(),
      text: `Selected appointment: ${date.toDateString()} at ${time}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });
    addMessage({
      id: Date.now(),
      text: `Do I confirm your appointment with ${
        selectedDoctor!.fullName
      } on ${date.toDateString()} at ${time}?`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("confirmation");
  };

  /**
   * Handles the confirmation of the appointment
   */
  const handleConfirmAppointment = async () => {
    try {
      const appointmentData: AppointmentData = {
        patientName: userDetails.name,
        patientEmail: userDetails.email,
        patientPhone: userDetails.phone,
        patientDOB: userDetails.dob,
        doctorId: selectedDoctor!.id,
        doctorName: selectedDoctor!.fullName,
        department: selectedDepartment,
        appointmentDate: selectedDate!,
        appointmentTime: selectedSlot!,
      };
      const appointmentId = await bookAppointment(appointmentData);

      toast.success(
        "Appointment booked successfully. You should receive an SMS shortly."
      );
      addMessage({
        id: Date.now(),
        text: `Your appointment has been booked successfully.`,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
      addMessage({
        id: Date.now(),
        text: "Would you like to add this appointment to your calendar? ",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
        action: {
          type: "button",
          text: "Add to Calendar",
          onClick: () => downloadICSFile(appointmentData),
        },
      });

      setTimeout(() => {
        addMessage({
          id: Date.now(),
          text: `Is there anything else I can help you with?`,
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        });
        onFlowComplete();
      }, 3000);
    } catch (error: any) {
      console.error("Failed to book appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return {
    step,
    departments,
    selectedDepartment,
    isModalOpen,
    setIsModalOpen,
    selectedDepartmentFromModal,
    userDetails,
    setUserDetails,
    filteredDoctors,
    selectedDoctor,
    selectedDate,
    selectedSlot,
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
  };
};
