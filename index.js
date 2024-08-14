import { ValueNoise } from 'value-noise-js';
import path from 'node:path';
import express from 'express';
import ngrok from '@ngrok/ngrok';
import bodyParser from "body-parser"; 
const __dirname = path.resolve();
const perlin = new ValueNoise();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "html"));
app.use(express.static(__dirname + "/html"));
app.listen(8080, () => {
  console.log("Server is up!");
});
const width = 1000;
const height = 700;
async function getNoise2D(w, h) {
  const output = [];
  let num = 0
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      output[num] = perlin.evalXY(x,y)
      num++
    }
  }
  return output
}
async function getNoise1D(w) {
  const output = [];
  let num = 0
  for (let x = 0; x < w; x++) {
    output[num] = perlin.evalX(x)
    num++
  }
  return output
}
async function getNoise3D(w, h, z) {
  const output = [];
  let num = 0
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
        output[num] = perlin.evalXYZ(x,y,z)
        num++
    }
  }
  return output
}
app.get("/",async (req, res) => {
  res.render("html", { canvasWidth: width, canvasHeight: height })
})
app.post("/noise", async (req, res) => {
  const d = req.body.d
  const x = req.body.x
  const y = req.body.y
  const z = req.body.z
  let noise;
  if (d==1) {
    noise = await Promise.resolve(getNoise1D(x)).then((value) => {
        return value
      })
  } else if (d==2) {
    noise = await Promise.resolve(getNoise2D(x, y)).then((value) => {
      return value
    })
  } else if (d==3) {
    noise = await Promise.resolve(getNoise3D(x, y, z)).then((value) => {
      return value
    })
  } else {
    return res.send("ERROR")
  }
  return res.send(noise)
})