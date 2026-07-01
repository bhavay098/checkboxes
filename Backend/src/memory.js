import { redis } from "./redis-connection.js";

// Single Redis key that stores the full checkbox array as JSON.
const CHECKBOX_STATE_KEY = "checkbox-state";
// Default number of checkboxes the app should create on a fresh Redis database.
const CHECKBOX_COUNT = 1000;

export async function initializeCheckboxState() {
  // Only seed Redis when the key does not already exist.
  // This preserves checkbox state across server restarts.
  const existingState = await redis.get(CHECKBOX_STATE_KEY);

  if (!existingState) {
    const initialState = new Array(CHECKBOX_COUNT).fill(false);
    await redis.set(CHECKBOX_STATE_KEY, JSON.stringify(initialState));
    return;
  }

  const currentState = JSON.parse(existingState);

  if (currentState.length !== CHECKBOX_COUNT) {
    const updatedState = new Array(CHECKBOX_COUNT).fill(false);

    for (let i = 0; i < Math.min(currentState.length, CHECKBOX_COUNT); i++) {
      updatedState[i] = currentState[i];
    }

    await redis.set(CHECKBOX_STATE_KEY, JSON.stringify(updatedState));
  }
}

export async function getCheckboxState() {
  // Read the stored JSON array from Redis.
  const existingState = await redis.get(CHECKBOX_STATE_KEY);

  if (!existingState) {
    // If Redis is empty, create the default array and return it.
    const initialState = new Array(CHECKBOX_COUNT).fill(false);
    await redis.set(CHECKBOX_STATE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  // Parse the stored JSON back into a real boolean array for the UI.
  return JSON.parse(existingState);
}

export async function updateCheckbox(index, checked) {
  // Load the current array, update one item, and write the whole array back.
  // This keeps the public API simple, but note that the read-modify-write flow
  // is still not atomic unless wrapped in a Redis transaction or Lua script.
  const checkboxes = await getCheckboxState();

  checkboxes[index] = checked;
  await redis.set(CHECKBOX_STATE_KEY, JSON.stringify(checkboxes));
  return checkboxes;
}
