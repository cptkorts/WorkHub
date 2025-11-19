import { useState, useEffect } from "react";

export interface Appointment {
  _id: string;
  clientId: string;
  date: string;
  time: string;
  service: string;
  price: number;
  status: "upcoming" | "completed" | "canceled";
  notes?: string;
}

export interface Client {
  _id: string;
  fullName: string;
}

export function useAppointments(session: unknown) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchAppointments();
      fetchClients();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        const clientsMap: { [key: string]: Client } = {};
        data.forEach((client: Client) => {
          clientsMap[client._id] = client;
        });
        setClients(clientsMap);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    });
  };

  const getAppointmentsForWeek = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= weekStart && aptDate <= weekEnd;
    });
  };

  const getDaysOfWeek = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  return {
    appointments,
    clients,
    loading,
    fetchAppointments,
    getAppointmentsForDate,
    getAppointmentsForWeek,
    getDaysOfWeek,
  };
}
