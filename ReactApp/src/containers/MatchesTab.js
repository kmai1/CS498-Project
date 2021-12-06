import React from "react";
import Matches from "../components/Matches"

export default function findMatches() {
  return (
    <div className="match_tab text-center">
      <h3>Do you know this?</h3>
      <Matches></Matches>
    </div>
  );
}
