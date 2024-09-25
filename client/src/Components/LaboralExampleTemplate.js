import React from "react";
import { Paper, Typography } from "@mui/material";

const paperStyle = {
  padding: "2rem",
  margin: "10px auto",
  boxShadow: "10px 10px 10px",
  minHeight: "800px",
};

const twoColumnStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px", // Gap between the columns
};

const columnStyle = {
  flex: 1, // Each column takes equal space
  padding: "10px",
};

const leftColumnStyle = {
  ...columnStyle,
  backgroundColor: "#007BFF", // Light blue background for the left column
  color: "white", // White text
  padding: "20px",
  borderRadius: "0", // Makes the borders sharp
};

const rightColumnStyle = {
  ...columnStyle,
  backgroundColor: "#f5f5f5", // Light background for the right column
  padding: "20px",
  borderRadius: "0", // Makes the borders sharp
};

const LaboralExampleTemplate = () => {
  return (
    <div style={{ width: "80%", paddingLeft: "20px" }}>
      <Paper
        style={{
          ...paperStyle,
          minHeight: "430px",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <Typography
          component="h4"
          variant="h4"
          style={{ fontWeight: "600", marginBottom: "1rem" }}
        >
          Ejemplo de Currículum Laboral:
        </Typography>
        {/* Flex container for two columns */}
        <div style={twoColumnStyle}>
          {/* Left Column */}
          <div style={leftColumnStyle}>
            <strong>Skills</strong>
            <br />
            Technical: Microsoft Office, Google Analytics, Programming Languages
            <br />
            Soft Skills: Leadership, Communication, Problem-Solving
            <br />
            <br />
            <strong>Certifications & Awards</strong> (Optional)
            <br />
            • "Certified Project Manager"
            <br />
            <br />
            <strong>About me</strong>
            <br />
            Traveling, Reading, Volunteering
          </div>

          {/* Right Column */}
          <div style={rightColumnStyle}>
            <Typography component="h5" variant="h5" style={{ marginBottom: "1rem" }}>
              <strong>Your Name</strong>
            </Typography>
            Home Street Address • City, State Zip • email@example.com • (123) 456-7890
            <br />
            <br />
            <strong>Education</strong>
            <br />
            Instituto Tecnologico de Costa Rica, San Jose
            <br />
            B.A. in Software, (June, 2024)
            <br />
            Thesis/Project: "Research on..."
            <br />
            <br />
            <strong>Experience</strong>
            <br />
            COMPANY NAME, City, State
            <br />
            Job Title (Month Year – Month Year)
            <br />
            • Achieved: "increased sales by 20%"
            <br />
            <br />
            COMPANY NAME, City, State
            <br />
            Job Title (Month Year – Month Year)
            <br />
            • Managed "specific project or task"
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default LaboralExampleTemplate;