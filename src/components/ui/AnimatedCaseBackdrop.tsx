type AnimatedCaseBackdropProps = {
  variant: "light" | "dark";
};

/**
 * A quiet CSS particle field for case-study hero sections.
 * All motion is carried by small drifting points; the colour atmosphere remains still.
 */
export default function AnimatedCaseBackdrop({
  variant,
}: AnimatedCaseBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={`case-atmosphere case-atmosphere--${variant}`}
    >
      <span className="case-atmosphere__wash" />
      <span className="case-atmosphere__orb case-atmosphere__orb--one" />
      <span className="case-atmosphere__orb case-atmosphere__orb--two" />
      <span className="case-atmosphere__rings" />
      <span className="case-atmosphere__grid" />

      <span className="case-atmosphere__particle case-atmosphere__particle--one" />
      <span className="case-atmosphere__particle case-atmosphere__particle--two" />
      <span className="case-atmosphere__particle case-atmosphere__particle--three" />
      <span className="case-atmosphere__particle case-atmosphere__particle--four" />
      <span className="case-atmosphere__particle case-atmosphere__particle--five" />
      <span className="case-atmosphere__particle case-atmosphere__particle--six" />
      <span className="case-atmosphere__particle case-atmosphere__particle--seven" />
      <span className="case-atmosphere__particle case-atmosphere__particle--eight" />
      <span className="case-atmosphere__particle case-atmosphere__particle--nine" />
      <span className="case-atmosphere__particle case-atmosphere__particle--ten" />
      <span className="case-atmosphere__particle case-atmosphere__particle--eleven" />
      <span className="case-atmosphere__particle case-atmosphere__particle--twelve" />
      <span className="case-atmosphere__particle case-atmosphere__particle--thirteen" />
      <span className="case-atmosphere__particle case-atmosphere__particle--fourteen" />
      <span className="case-atmosphere__particle case-atmosphere__particle--fifteen" />
      <span className="case-atmosphere__particle case-atmosphere__particle--sixteen" />
      <span className="case-atmosphere__particle case-atmosphere__particle--seventeen" />
      <span className="case-atmosphere__particle case-atmosphere__particle--eighteen" />
    </div>
  );
}
