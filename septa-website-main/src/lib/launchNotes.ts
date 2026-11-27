/**
 * Whether developer-facing launch notes may render. Always on locally, forced on a preview build
 * with VITE_SHOW_LAUNCH_NOTES, off in production — visitors get the honest "not supplied yet"
 * placeholder, the file it lives in is a note for whoever maintains the repo.
 */
export const showLaunchNotes =
  import.meta.env.DEV || (import.meta.env.VITE_SHOW_LAUNCH_NOTES as string | undefined) === "true";
