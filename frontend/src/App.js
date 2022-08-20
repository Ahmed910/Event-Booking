import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/navigation/Main";
import AuthContext from "./context/auth-context";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({ token: null, userId: null });
  const login = (token, userId, tokenExpiration) => {
    setUserData({ token: token, userId: userId });
  };
  const logout = () => {
    setUserData({ token: null, userId: null });
  };
  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: userData.token,
            userId: userData.userId,
            login,
            logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {userData.token && <Redirect from="/" to="/events" exact />}
              {userData.token && <Redirect from="/auth" to="/events" exact />}
              {!userData.token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} exact />
              {userData.token && (
                <Route path="/bookings" component={BookingsPage} exact />
              )}

              {!userData.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
