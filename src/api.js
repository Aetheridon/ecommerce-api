const express = require("express")();
const PORT = (process.env.PORT || 8000);

const products = require("./db/products.json");

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

express.listen(PORT, () => {
    console.log(`Serving at http://localhost:${PORT}/products`);
})