const Book = require("../models/Book");

exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};