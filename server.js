const { MongoClient, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 27017;

require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@cluster0.1cven.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//ajdcom
//ABDULJABBARdeveloper

async function run() {
    try {
        await client.connect();
        const database = client.db('d-com');
        const productCollection = database.collection('products');
        const cartCollection = database.collection('cart');
        const reviewCollection = database.collection('userreview');
        //products collection
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result)
        });
        app.get('/products', async (req, res) => {
            const { items } = req.query
            let result;
            if (items) {
                result = await productCollection.find().sort({ "postDate": -1 }).limit(parseInt(items)).toArray();
            } else {
                result = await productCollection.find({}).toArray();
            }
            res.json(result)
        });
        app.get('/products/:id', async (req, res) => {
            const { id } = req.params
            const quary = { _id: ObjectId(id) }
            const result = await productCollection.findOne(quary)
            res.send(result)
        });
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const quare = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(quare)
            res.json(result)
        })
        //cart collection
        app.get('/cart', async (req, res) => {
            const email = req.query.email;
            let result;
            if (email) {

                const query = cartCollection.find({ email: email }, { _id: 0 })
                result = await query.toArray()
            } else {
                result = await cartCollection.find({}).toArray()
            }
            res.json(result)
        });
        app.post('/cart', async (req, res) => {
            const data = req.body

            const result = await cartCollection.insertOne(data)
            res.send(result)
        });
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const quare = { _id: ObjectId(id) }
            const result = await cartCollection.deleteOne(quare)
            res.json(result)
        })
        app.put('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            user['orderState'] = 'procced'
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: { user: user.orderState } };
            const result = await cartCollection.updateOne(filter, updateDoc);
            if (result) {
                res.json(result);
            }
        })
        //Review collection
        app.post('/userreview', async (req, res) => {
            const data = req.body
            const result = await reviewCollection.insertOne(data)
            res.send(result)
        });
        app.get('/userreview', async (req, res) => {
            const result = await reviewCollection.find({}).toArray()
            res.send(result)
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello D-com')
})

app.listen(port, () => {
    console.log(`${port} Port is running`)
})