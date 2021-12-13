import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import MatchesTab from "./containers/MatchesTab"


export default function Routes() {
  return (
    <Switch>
      <Route exact path="/"><Home /></Route>
      <Route exact path="/matches"><MatchesTab /></Route>
      <Route><NotFound /> </Route>
    </Switch>
  );
}
