// HarvardExampleTemplate.js
import React from "react";
import { Paper, Typography } from "@mui/material";

const paperStyle = {
  padding: "2rem",
  margin: "10px auto",
  borderRadius: "1rem",
  boxShadow: "10px 10px 10px",
  minHeight: "800px",
};

const HarvardExampleTemplate = () => {
  return (
    <div style={{ width: "80%", paddingLeft: "20px" }}>
      {" "}
      {/* Ejemplo de Currículum Harvard */}
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
          Ejemplo de Currículum Harvard:
        </Typography>
        <div
          style={{
            padding: "10px",
            fontSize: "0.9rem",
            lineHeight: "1.5",
          }}
        >
          <strong>Your Name</strong>
          <br />
          Home Street Address • City, State Zip • name@college.harvard.edu •
          (123) 456-7890
          <br />
          <br />
          <strong>Education</strong>
          <br />
          HARVARD UNIVERSITY, Cambridge, MA
          <br />
          B.A. in Psychology, GPA: 3.8/4.0 (May 2023)
          <br />
          Thesis: "Impact of Social Media on Mental Health"
          <br />
          <br />
          <strong>Experience</strong>
          <br />
          ORG NAME, City, State
          <br />
          Intern, Marketing Dept. (June 2022 – Aug 2022)
          <br />
          • Developed campaigns that increased engagement by 30%
          <br />
          • Conducted market research and presented findings
          <br />
          <br />
          <strong>Skills & Interests</strong>
          <br />
          Technical: MS Office, Adobe Creative Suite
          <br />
          Language: Spanish (fluent), French (conversational)
          <br />
          Interests: Hiking, photography
        </div>
      </Paper>
      {/* Fin Ejemplo de Currículum Harvard */}
    </div>
  );
};

export default HarvardExampleTemplate;
