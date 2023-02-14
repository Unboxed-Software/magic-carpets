import fs from "fs"

const baseImageUrl =
  "https://bafybeiekvmtgfmd3yg4ybsl4whuzhp564d5jm7znnlni2lm5fsmubseayu.ipfs.nftstorage.link/"

for (let i = 0; i < 16; i++) {
  const data = {
    name: `Magic Carpet ${i}`,
    image: baseImageUrl + i + ".png",
    tokenId: i,
  }
  fs.writeFileSync(`nft-metadata/metadata/${i}.json`, JSON.stringify(data))
}
