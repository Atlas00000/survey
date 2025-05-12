// This script initializes the MongoDB database with the required collections
db = db.getSiblingDB('survey');

// Create the submissions collection if it doesn't exist
if (!db.getCollectionNames().includes('submissions')) {
  db.createCollection('submissions');
  print('Created submissions collection');
}

// Create indexes for better query performance
db.submissions.createIndex({ "referenceNumber": 1 }, { unique: true });
db.submissions.createIndex({ "createdAt": 1 });
db.submissions.createIndex({ "email": 1 });

print('MongoDB initialization completed successfully');
