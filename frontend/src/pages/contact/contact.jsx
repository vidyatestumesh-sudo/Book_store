import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "./contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [popup, setPopup] = useState({
    visible: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact/create-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPopup({
          visible: true,
          success: true,
          message: "Your message has been sent successfully!",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setPopup({
          visible: true,
          success: false,
          message: data.message || "Failed to send message",
        });
      }

      setTimeout(() => {
        setPopup({ visible: false, success: false, message: "" });
      }, 3000);
    } catch (error) {
      setPopup({
        visible: true,
        success: false,
        message: "Failed to send message",
      });
      console.error(error);
      setTimeout(() => {
        setPopup({ visible: false, success: false, message: "" });
      }, 3000);
    }
  };

  return (
    <section className="container contact">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contact Us
            </li>
          </ol>
        </nav>
      </div>

      <div className="container contact-section">
        <h2>Contact Us</h2>

        <div className="row align-items-center">
          {/* Left Side - Image */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="contact-image">
              <img src="anil-kumar.webp" alt="Contact" className="img-fluid" />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter the subject"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message"></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>

            {/* Info text below form */}
            <div className="contact-info-text">
              <p>
                You can send your enquiries to Langshott Leadership Foundation
                at{" "}
                <a href="mailto:enquiries@langshott.org">
                  enquiries@langshott.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup message */}
      {popup.visible && (
        <div className="popup-card">
          <div className="popup-icon">
            {popup.success ? (
              <CheckCircleIcon className="success-icon" fontSize="large" />
            ) : (
              <CancelIcon className="error-icon" fontSize="large" />
            )}
          </div>
          <div className="popup-message">{popup.message}</div>
        </div>
      )}
    </section>
  );
};

export default Contact;
