import { useCallback, useEffect, useState } from "react";
import { bookingsApi, type Booking, type BookingStatus, type CreateBookingInput } from "@/lib/api";

/** Lightweight hook around the mock bookings API. Will work unchanged once a real backend lands. */
export function useBookings(filter?: { status?: BookingStatus; customerId?: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await bookingsApi.list(filter);
      setBookings(list);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filter?.status, filter?.customerId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (input: CreateBookingInput) => {
    const result = await bookingsApi.create(input);
    if (result.ok) await refresh();
    return result;
  }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: BookingStatus) => {
    const result = await bookingsApi.updateStatus(id, status);
    if (result.ok) await refresh();
    return result;
  }, [refresh]);

  return { bookings, loading, error, refresh, create, updateStatus };
}
