window.onpopstate = function() {
    const sessionCookie = localStorage.getItem("session");
    if (!sessionCookie) {
      window.location.href = "/login";
    }
  };