import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1 className="about-heading">About NepalEcom</h1>

      <p className="about-text">
        Welcome to <b>NepalEcom</b>, your one-stop online shopping destination in Nepal. 
        We aim to bring a wide range of products right to your doorstep, providing convenience, 
        quality, and affordability for every shopper.
      </p>

      <p className="about-text">
        Our mission is to make online shopping in Nepal easy and enjoyable. From electronics and 
        fashion to home essentials and local crafts, we connect you to trusted sellers across the country.
      </p>

      <p className="about-text">
        <b>Why Choose NepalEcom?</b>
      </p>
      <ul className="about-list">
        <li>Wide variety of products across multiple categories.</li>
        <li>Secure and easy payment options.</li>
        <li>Fast delivery across Nepal.</li>
        <li>User-friendly interface for a smooth shopping experience.</li>
        <li>Customer support always ready to help.</li>
      </ul>

      <p className="about-text">
        We are committed to bringing the best online shopping experience to Nepal and continuously 
        improving our services based on your feedback.
      </p>
    </div>
  );
}

export default About;
