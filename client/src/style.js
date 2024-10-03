import { theme } from "./theme";

export const paperStyle = {
  padding: "2rem",
  margin: "10px auto",
  borderRadius: "1rem",
  boxShadow: "10px 10px 10px",
  minHeight: "800px",
};

export const paperStyles = {
    padding: "2rem",
    margin: "10px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
    minHeight: "auto",
  };

  export const paperStyleb = {
    padding: "2rem",
    margin: "10px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
    minHeight: "800px",
  };

  export const paperStylem = {
    padding: "2rem",
    margin: "10px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
    minHeight: "600px",
  };

  export const paperStylexb = {
    padding: "2rem",
    margin: "10px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
    minHeight: "1000px",
  };

  export const paperSX = {
    width: {
      xs: "80vw", // 0
      sm: "50vw", // 600
      md: "40vw", // 900
      lg: "30vw", // 1200
      xl: "20vw", // 1536
    },
    height: {
      lg: "60vh", // 1200px and up
    },
  };


  export const heading = { fontSize: "2.5rem", fontWeight: "600" };
  export const row = { display: "flex", marginTop: "2rem" };
  export const btnStyle = {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: theme.palette.yellow.main,
    borderRadius: "0.5rem",
  };
  export const fieldTitleStyle = { float: "left" };
  export const listStyle = {
    border: "solid 3px #999999aa",
    borderRadius: "5px",
    marginBottom: "5px",
    height: "auto",
    overflow: "hidden",
    backgroundColor: "#fff",
  };
  export const listButtonStyle = {
    border: "solid 1px #999999aa",
    height: "3rem",
    overflow: "hidden",
  };
  export const deleteButton = {
    backgroundColor: "#f55",
    border: "0px",
    borderRadius: "5px",
    float: "right",
    cursor: "pointer",
    color: "#000",
  };
  export const dense = true;

  export const twoColumnStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px", // Gap between the columns
  };

  export const columnStyle = {
    flex: 1, // Each column takes equal space
    padding: "10px",
  };
  
  export const leftColumnStyle = {
    ...columnStyle,
    backgroundColor: "#007BFF", // Light blue background for the left column
    color: "white", // White text
    padding: "20px",
    borderRadius: "0", // Makes the borders sharp
  };
  
  export const rightColumnStyle = {
    ...columnStyle,
    backgroundColor: "#f5f5f5", // Light background for the right column
    padding: "20px",
    borderRadius: "0", // Makes the borders sharp
  };

  export const label = { fontWeight: "700" };

  export const logoutbutton = {
    marginRight: "20px",
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0.3rem 1.4rem",
  };

  export const navbutton = {
    margin: "2px",
    marginRight: "2px",
    fontSize: "0.8rem",
    fontWeight: "700",
    padding: "0.1rem 0.4rem",
    width: "110px",
    minWidth: "100px",
    height: "50px",
    background: 'linear-gradient(to bottom, #C42847, #7a1436)',
    borderRadius: "0",
  };

  export const disabledNavButton = {
    ...navbutton,
    background: null,
    backgroundColor: theme.palette.darkerred.main,
    pointerEvents: 'none',  // Disable hover and clicks
    cursor: 'default'  // Change cursor to default

  };

  export const burger_button = {
    margin: "1px",
    marginRight: "1px",
    fontSize: "0.9rem",
    fontWeight: "700",
    padding: "0.1rem 0.4rem",
    width: "50px",
    height: "50px",
    background: 'linear-gradient(to bottom, #C42847, #7a1436)',
  };