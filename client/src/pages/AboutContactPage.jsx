import { useState } from "react";

export default function AboutContactPage() {
  const techStack = [
    { name: "MongoDB", role: "Database" },
    { name: "Express", role: "Backend framework" },
    { name: "React", role: "Frontend library" },
    { name: "Node.js", role: "Runtime" },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
  {
    q: "Who can publish on BlogSphere?",
    a: "Anyone with a registered account can write and publish articles.",
  },
  {
    q: "Can I save a draft before publishing?",
    a: "Yes. Save your article as a draft and publish it whenever you are ready.",
  },
  {
    q: "Does BlogSphere support Markdown?",
    a: "Yes. You can write your articles in Markdown and preview them before publishing.",
  },
];

  const validate = () => {
  const newErrors = {};
  if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
  if (!form.email.includes("@") || !form.email.includes(".")) newErrors.email = "Enter a valid email address";
  if (form.subject.trim() === "") newErrors.subject = "Subject is required";
  if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
  return newErrors;
};

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: "" });
  setSubmitted(false);
};

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validate();
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;
  console.log(form);
  setSubmitted(true);
  setForm({ name: "", email: "", subject: "", message: "" });
};

  return (
    <>
      <section className="container section">
        <h1>About and Contact</h1>
        <p>
          BlogSphere is a place where developers read, write and share what they
          learn. It is a full-stack MERN capstone project built from scratch.
        </p>
        <p>Built by Shadaf Siddiqui as a solo capstone project</p>
      </section>
      <section className="container section about-section">
        <h2>Built with the MERN stack</h2>
        <div className="tech-grid">
          {techStack.map((tech) => (
            <div className="tech-card" key={tech.name}>
              <strong>{tech.name}</strong>
              <span>{tech.role}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="container contact-section">
        <h2>Send us a message</h2>
        <p  className="text-muted"> Questions, ideas or feedback about BlogSphere are always welcome.</p>
        {submitted && (
  <p className="form-success" role="status">
    Thanks! Your message has been sent.
  </p>
)}
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className={errors.name ? "has-error" : ""}>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <small className="form-error">{errors.name}</small>}
          </label>

          <label className={errors.name ? "has-error" : ""}>
            <span>email</span>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <small className="form-error">{errors.email}</small>}
          </label>

          <label className={errors.name ? "has-error" : ""}>
            <span>subject</span>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />
            {errors.subject && <small className="form-error">{errors.subject}</small>}
          </label>

          <label className={errors.name ? "has-error" : ""}>
            <span>message</span>
            <input
              type="text"
              name="message"
              value={form.message}
              onChange={handleChange}
            />
            {errors.message && <small className="form-error">{errors.message}</small>}
          </label>
          <button type="submit">Submit</button>
        </form>
      </section>
       <section className="container section faq-section">
        <h2>Frequently asked questions</h2>
        {faqs.map((faq, i) => (
          <div className="faq-item" key={faq.q}>
            <button
              className="faq-question"
              aria-expanded={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {faq.q}
              <span>{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && <p className="faq-answer">{faq.a}</p>}
          </div>
        ))}
      </section>
    </>
  );
}
