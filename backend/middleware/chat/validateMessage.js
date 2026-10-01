

const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'Invalid message format' });
  }

  next();
};

module.exports = validateMessage;