import http from "http";
import fs, { existsSync } from "fs";
import axios from "axios";
import express, { response } from "express";
import readline from "readline";
import path from "path";
import coingecko from "coingecko-api";
import fetch from "node-fetch";
import chalk from "chalk";
import chalkanimation from "chalk-animation";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rb = chalkanimation.neon("Hello and Welcome \n");
  await sleep();
  rb.stop();
  console.log(
    ` 
 ${chalk.bgCyan("That is 6th homework and consist two step ")}

    ${chalk.bgCyan(" 1.Looking coins list  and see about  ")}

    ${chalk.bgCyan("2. Serve and look this coins ")}
       

       
`
  );
}
await welcome();
async function getCoins() {
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
  const data = await response.json();

  fs.writeFileSync("cache/coins.json", JSON.stringify(data));
}
getCoins();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(" What is yor name?:", function (name) {
  console.log("Hi " + name);
  console.log(`
  
    Please select 1 or 2


  1.coins list
  2.server

  `);
  rl.question(":", (num) => {
    if (num == 1) {
      fs.readFile("cache/coins.json", function (err, datas) {
        if (err) {
          throw err;
        }
        const tst = JSON.parse(datas.toString());

        for (let i = 0; i < 30; i++) {
          console.log(i + 1 + ": " + tst[i].id);
          tst[i] = tst[i].id;
        }

        rl.question(
          "select what you want, you must to write id name:",
          function (id) {
            console.log(id);
            async function getPostid(ids) {
              const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${ids}/market_chart?vs_currency=usd&days=max `
              );
              const data = await response.json();
              console.log(data);

              let date = new Date().toISOString().replaceAll(":", "-");

              if (!fs.existsSync(`./cache/market-charts/${id}/${date}.json`)) {
                fs.mkdirSync(`./cache/market-charts/${id}`);
                fs.writeFileSync(
                  `./cache/market-charts/${id}/${date}.json`,
                  JSON.stringify(data)
                );
              }
            }
            getPostid(id);
          }
        );
      });
    } else if (num == 2) {
      rl.question("Do you want serv [y/n]", function (want) {
        console.log(`

            1.all coins 
            2.choose what you want
            
            `);

        rl.question(":" + want, (sel) => {
          if (sel == 1) {
            const givdata = fs.readFileSync("./cache/coins.json");
            http
              .createServer(function (request, response) {
                response.writeHead(200, { "Content-Type": "application/json" });
                if (request.url == "/coins/all") {
                  response.write(givdata);
                } else {
                  console.log("salam");
                }
                response.end("hello");
              })
              .listen(8080);
          } else if (sel == 2) {
            fs.readFile("cache/coins.json", function (err, datam) {
              if (err) {
                throw err;
              }
              const tvt = JSON.parse(datam.toString());

              for (let j = 0; j < 30; j++) {
                console.log(j + 1 + ": " + tvt[j].id);
                tvt[j] = tvt[j].id;
              }

              rl.question(
                "Select what you want, you must to write id name:",
                function (id) {
                  console.log(id);
                  async function getids(ids) {
                    const response = await fetch(
                      `https://api.coingecko.com/api/v3/coins/${ids}/market_chart?vs_currency=usd&days=max `
                    );
                    const datass = await response.json();
                    const datams = JSON.stringify(datass);
                    const app = express();
                    //------------------------------     READ ME     ---------------------------------------
                    //   BURADA market-charts/${id} SONLUGU ILE BITEN CAGIRISLARDA ƏGƏR DATANİN YAZİLDİGİ FİLE VARSA ONU CİXARMAQ LAZİM İDİ AMMA DATANİN YAZİLDİGİ FİLE Nİ TAPSAMDA İCERİSİNİ OXUYA BİLMEDİM  BELE BİR ERROR VERİRı
                    // ENOENT: no such file or directory, open '2022-07-30T17-06-30.049Z.json'  HALBUKI FAYLI TAPMISAM
                    // if (fs.existsSync(`./cache/market-charts/${id}`)) {
                    //   fs.readdir(`./cache/market-charts/${id}`, (err, files) => {
                    //     if (err) console.log(err);
                    //     else {
                    //       console.log("Filenames with the .txt extension:");
                    //       files.forEach((file) => {
                    //         if (path.extname(file) == ".json") {
                    //           console.log(file);
                    //           // fs.readFileSync(file, function (datafil) {
                    //           //   const txt = JSON.parse(datafil.toString());
                    //           //   console.log(txt);
                    //           // });
                    //           const givdatas = fs.readFileSync(file);
                    //           console.log(givdatas);
                    //         } else {
                    //           console.log("error");
                    //         }
                    //       });
                    //     }
                    //   });

                    // const givsdata = fs.readFileSync(
                    //   `./cache/market-charts/${id}/${date}.json`
                    // );
                    // http
                    //   .createServer(function (request, response) {
                    //     response.writeHead(200, {
                    //       "Content-Type": "application/json",
                    //     });
                    //     if (request.url == `/market-chart/${id}`) {
                    //       response.write(givsdata);
                    //     } else {
                    //       console.log("olmadi");
                    //     }
                    //     response.end("Hola");
                    //   })
                    //   .listen(8080);
                    // } else {
                    // console.log(datams);
                    app.get(`/market-chart/${id}`, (req, res) => {
                      res.write(datams);
                      console.log("ok");
                    });
                    app.listen(8080, () => {
                      console.log(
                        `Pleaase check localhost:8080/market-chart/${id}`
                      );
                    });

                    let dates = new Date().toISOString().replaceAll(":", "-");
                    fs.mkdirSync(`./cache/market-charts/${id}`);
                    fs.writeFileSync(
                      `./cache/market-charts/${id}/${dates}.json`,
                      JSON.stringify(datams)
                    );
                    // }
                  }
                  getids(id);
                }
              );
            });
          }
        });
      });
    } else {
      console.log("WTF give correct input pls");
    }
  });
});
