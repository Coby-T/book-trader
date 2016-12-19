'use strict';

import mongoose from 'mongoose';

var RequestSchema = new mongoose.Schema({
  proposer: String,
  proposerBook: String,
  receiver: String,
  receiverBook: String,
  accepted: {
    type: Boolean,
    default: false
  },
  active: Boolean
});

export default mongoose.model('Request', RequestSchema);
