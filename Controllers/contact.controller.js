export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    res.status(200).json({ message: 'Thanks for reaching out! We will get back to you soon.' });
  } catch (e) {
    res.status(500).json({ message: 'Error submitting contact form', error: e.message });
  }
};

export default { submitContact };