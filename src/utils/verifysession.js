const verifysession = async () => {
    let response = await fetch("https://hostelmanagementbackend-2tc9.onrender.com/api/auth/verifysession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({token: localStorage.getItem("token")})
    });

    let result = await response.json();
    if (result.success) {
      if (result.data.isAdmin) {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/student-dashboard";
      }
    }
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("student");
    }
  };

  export default verifysession;