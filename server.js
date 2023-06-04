const express = require('express');
const { MongoClient} = require('mongodb');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dbURI = 'mongodb://localhost:32000';
const mongoClient = new MongoClient(dbURI);

async function mongo() {
  try {
    await mongoClient.connect();
    console.log('Connected');

    const collection = mongoClient.db('mydatabase').collection('mycollection');
    const documents = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Alice' }
    ];
    await collection.insertMany(documents);
    console.log('Documents added to database');
  } catch (error) {
    console.error('Failed to connect', error);
  }
}
mongo();

app.get('/documents', async (req, res) => 
{
  try {
    const collection = mongoClient.db('mydatabase').collection('mycollection');
    const documents = await collection.find().toArray();
    res.json(documents);
  } catch (error) {
    console.error('Failed to fetch documents', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/documents/:id', async (req, res) => {
  try {
    const collection = mongoClient.db('mydatabase').collection('mycollection');
    const documentId = new ObjectId(req.params.id);
    const document = await collection.findOne({ _id: documentId });

    if (document) {
      res.send(document);
    } else {
      res.status(404).send(`Document with ID ${req.params.id} not found`);
    }
  } catch (error) {
    console.error('Failed to fetch document', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/documents', async (req, res) => {
  try {
    const collection = mongoClient.db('mydatabase').collection('mycollection');
    const newDocument = req.body;
    const result = await collection.insertOne(newDocument);
    res.status(200).json(newDocument);
  } catch (error) {
    console.error('Failed to add document', error);
    res.status(500).send('Server Error');
  }
});

app.put('/documents/:id', async (req, res) => {
  try {
    const collection = mongoClient.db('mydatabase').collection('mycollection');
    const documentId = new ObjectId(req.params.id);
    const updatedDocument = req.body;
    const result = await collection.updateOne({ _id: documentId }, { $set: updatedDocument });
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error('Failed to update document', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/documents/:id', async (req, res) => {
  try {
    const collection = mongoClient.db('mydatabase').collection('mycollection');
    const documentId = new ObjectId(req.params.id);
    const result = await collection.deleteOne({ _id: documentId });
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete document', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {console.log('listening TO 3000'); });
//end