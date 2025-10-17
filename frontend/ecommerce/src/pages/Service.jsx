import React from "react";
import "./Service.css";

function Service() {
  const services = [
    { title: "Fast Delivery", description: "Get your products delivered quickly across Nepal with reliable shipping partners.", icon: "🚚" },
    { title: "Secure Payment", description: "We provide multiple secure payment options including eSewa, Khalti, bank transfer, and cash on delivery.", icon: "💳" },
    { title: "24/7 Customer Support", description: "Our friendly customer support team is available around the clock to assist you.", icon: "📞" },
    { title: "Quality Products", description: "We ensure all products are authentic, high-quality, and from trusted sellers.", icon: "✔️" },
    { title: "Easy Returns", description: "Hassle-free return policy to ensure a worry-free shopping experience.", icon: "🔄" },
    { title: "Exclusive Deals", description: "Enjoy special discounts and offers regularly for our valued customers.", icon: "🎁" },
  ];

  return (
    <div className="service-container">
      <h1 className="service-heading">Our Services</h1>
      <div className="service-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
