'use strict';

import mongoose from 'mongoose';

var BookSchema = new mongoose.Schema({
  title: String,
  authors: [String],
  cover: String,
  owner: String,
  description: String
});

export default mongoose.model('Book', BookSchema);
