import { firestore } from "@/lib/firebase.config";
import { AppointmentData } from "@/lib/types";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";

export default function useOperations() {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  async function bookAppointment(appointmentData: AppointmentData) {
    setIsBooking(true);
    setBookingError(null);

    try {
      const appointmentsRef = collection(firestore, "appointments");

      const docRef = await addDoc(appointmentsRef, {
        patientName: appointmentData.patientName,
        patientEmail: appointmentData.patientEmail,
        patientPhone: appointmentData.patientPhone,
        patientDOB: appointmentData.patientDOB,
        doctorId: appointmentData.doctorId,
        doctorName: appointmentData.doctorName,
        department: appointmentData.department,
        appointmentDate: Timestamp.fromDate(appointmentData.appointmentDate),
        appointmentTime: appointmentData.appointmentTime,
        createdAt: Timestamp.now(),
        status: "scheduled",
      });

      console.log("Appointment booked with ID: ", docRef.id);

      return docRef.id;
    } catch (error) {
      console.error("Error booking appointment: ", error);
      setBookingError("Failed to book appointment. Please try again.");

      throw error;
    } finally {
      setIsBooking(false);
    }
  }

  return {
    bookAppointment,
    isBooking,
    bookingError,
  };
}
