import { query } from "../db/db.js";

export const addEvent = async (
  eventId,
  { title, description, location, date }
) => {
  try {
    const result = await query(
      "INSERT INTO events (event_id,title,description,location,date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [eventId, title, description, location, date]
    );

    if (result.rows.length === 0) {
      throw new Error("Event not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating event:", err.message);
    throw err;
  }
};

export const updateEvent = async (
  eventId,
  { title, description, location, date }
) => {
  try {
    const result = await query(
      "UPDATE events SET title=$1, description=$2, location=$3, date=$4 WHERE event_id=$5 RETURNING *",
      [title, description, location, date, eventId]
    );

    if (result.rows.length === 0) {
      throw new Error("Event not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating event:", err.message);
    throw err;
  }
};

export const getAllEvents = async () => {
  try {
    const result = await query("SELECT * FROM events ORDER BY date ASC");

    if (result.rows.length === 0) {
      throw new Error("Event not found");
    }

    return result.rows;
  } catch (err) {
    console.error("Error fetching event:", err.message);
    throw err;
  }
};

export const getEventById = async (eventId) => {
  try {
    const result = await query("SELECT * FROM events WHERE event_id=$1", [
      eventId,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Event not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching event:", err.message);
    throw err;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await query("DELETE FROM events WHERE event_id=$1 RETURNING *", [eventId]);

    if (result.rows.length === 0) {
      throw new Error("Event not found");
    }

    return {
      message: "Event deleted successfully",
      deletedEvent: result.rows[0],
    };
  } catch (err) {
    console.error("Error deleting event:", err.message);
    throw err;
  }
};
