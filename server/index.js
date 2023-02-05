const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "048cff5294a87be9bf76016e26e62e37f3ffa17e82864d7ff546cb22544844a8e9ed99d1013899bd3845f0015e14600a0ef1004d0c7b508ea38a4daf176e444354": 100, // A
  "045d045d42e697467d3f0a28abac1357d6284190ab138203286e345cd1d8914bf9e5dac551cad4205d12aaea8a87b086a07ef74123a7b5a150f7a329e1960b6fa9": 50, // B
  "04dc7a33b4d55ac602f502ed4d9940a6767380a91f63dd4588511f1c49b4135b9ace6999208b3aea9b69b031a5c0353731e2bfbf84f9a7b6ca67981d36462334c1": 75, // C
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // get a signature from the client-side application
  // recover the public address from the signature
  
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
