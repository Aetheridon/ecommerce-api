const express = require("express")();

const PORT = (process.env.PORT || 8000);

express.get("/products", (req, res) => {
    try {
        res.send("Working!");
    } catch (error) {
        res.status(500).end(`got error: $error}`);
    }
});

express.listen(PORT, () => {
    console.log(`Serving at http://localhost:${PORT}/products`);
})