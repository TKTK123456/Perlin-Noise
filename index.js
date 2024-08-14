import perlin from './js.js';
import path from 'node:path';
import express from 'express';
import ngrok from '@ngrok/ngrok';
import bodyParser from "body-parser"; 
const __dirname = path.resolve();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "html"));
app.use(express.static(__dirname + "/html"));
app.listen(8080, () => {
  console.log("Server is up!");
});
const width = 480;
const height = 480;
async function getNoise2D(w, h) {
  const output = [];
  let num = 0
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      output[num] = perlin.get(x,y)
      num++
    }
  }
  return output
}
app.get("/",async (req, res) => {
  res.render("html", { canvasWidth: width, canvasHeight: height })
})