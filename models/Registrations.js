import { query } from "../db/db.js";

export const registerForEvent = async (userId, eventId) => {
  try {
    const existing = await query(
      "SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );

    if (existing.rows.length > 0) {
      throw new Error("User already registered for this event");
    }

    const result = await query(
      "INSERT INTO registrations (user_id, event_id, status) VALUES ($1, $2, 'registered') RETURNING *",
      [userId, eventId]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error registering for event:", err.message);
    throw err;
  }
};

export const getRegistrationsByUser = async (userId) => {
  try {
    const result = await query(
      `SELECT r.*, e.title,e.date,e.location FROM registrations r
        JOIN events e ON r.event_id = e.event_id
        WHERE r.user_id=$1 
        ORDER BY e.date ASC`,
      [userId]
    );

    return result.rows;
  } catch (err) {
    console.error("Error registering for event:", err.message);
    throw err;
  }
};

export const getRegistrationsByEvent = async (eventId) => {
  try {
    const result = await query(
      `SELECT r.reg_id, r.status
        u.id, u.name, u.email
        e.event_id,e.title,e.date,e.location 
        FROM registrations r
        JOIN users u ON r.user_id=u.id
        JOIN events e ON r.event_id = e.event_id
        WHERE r.event_id=$1 
        ORDER BY u.name ASC`,
      [eventId]
    );

    if (result.rows.length === 0) {
      throw new Error("No registrations found for this event");
    }

    return result.rows;
  } catch (err) {
    console.error("Error fetching registrations by event:", err.message);
    throw err;
  }
};

export const updateRegistrationStatus = async (regId, status) => {
  try {
    const result = await query(
      `UPDATE registrations SET status=$1 WHERE reg_id=$2 RETURNING *`,
      [status, regId]
    );

    if (result.rows.length === 0) {
      throw new Error("Registration not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating registration status:", err.message);
    throw err;
  }
};

export const deleteRegistration = async (userId, eventId) => {
  try {
    const result = await query(
      `DELETE FROM registrations WHERE user_id=$1 AND event_id=$2 RETURNING *`,
      [userId, eventId]
    );

    if (result.rows.length === 0) {
      throw new Error("Registration not found for this user and event");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error while deleting registrations", error.message);
    throw error;
  }
};
