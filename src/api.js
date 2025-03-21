const express = require("express")();
const bodyParser = require("body-parser"); 
const fs = require('fs');
const path = require('path');


const products = require("./db/products.json");

const PORT = (process.env.PORT || 8000);

express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: true}));

express.get("/products", (req, res) => {
    try {
        res.send(products);
    } catch (error) {
        res.status(500).end(`got error: $error}`);
    }
});

express.get("/products/:id", (req, res) => {
    const productID = parseInt(req.params.id)

    if (isNaN(productID)) {
        return res.status(400).send("please provide a valid product ID!");
    }

    const product = products.find((p) => {
        return p.id === productID;
    });

    if (product) {
        res.json(product);
    } else {
        res.status(404).send(`Couldn't find an entry with id ${productID}!`);
    }

});

express.post("/products/add_item", async (req, res) => {
    const { name, description, price, category, stock, rating, vendor } = req.body;
    const requiredFields = [ name, description, price, category, stock, rating, vendor]; // not best if Schema changes, look into better methods for checking null fields.

    const missingFields = requiredFields.some(field => !field);

    if (missingFields) {
        res.status(400).send(`Missing data! please fill in the required fields`);
    } else {

        try {
            const newProduct = {
                id: products.length + 1,
                ...req.body
            };

            products.push(newProduct);

            const filePath = path.join(__dirname, "db", "products.json");
            
            fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
                if (err) {
                    console.log(`Error writing to file: ${err}`);
                    res.status(500).send(`Got error trying to write to product to file: ${err}`);
                }
            });

            res.status(200).send(`successfully writed product to file!`);

        } catch (error) {
            console.log(`got error: ${error}`);
            res.status(400).send(`failed trying to write product to file: ${error}`);
        }
    }

});

express.post("/update/:id", (req, res) => {
    try {
        const idToUpdate = parseInt(req.params.id) - 1; // to account for indexing at 0.

        if (!products[idToUpdate]) {
            return res.status(404).send("Product not found");
        }

        product = products[idToUpdate];

        for (let key in req.body) {

            if (!(key in product)) {
                return res.status(400).send(`Invalid key: ${key} does not exist in product`);
            }

            if (key === "price" || key === "rating") {
                product[key] = parseFloat(req.body[key]);
            } else if (key === "stock") {
                product[key] = parseInt(req.body[key]);
            } else {
                product[key] = req.body[key];
            }
        }

        const filePath = path.join(__dirname, "db", "products.json");

        fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.log(`Error writing to file: ${err}`);
                res.status(500).send(`Got error trying to write to product to file: ${err}`);
            } else {
                res.status(200).send("updated db successfully!");
            }
        });

    } catch (error) {
        console.log(`got error: ${error}`);
        res.status(400).send(`failed trying to write product to file: ${error}`);
    }

});

express.listen(PORT, () => {
    console.log(`Serving at http://localhost:${PORT}/products`);
})