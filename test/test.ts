import { ethers } from "hardhat"
import { MagicCarpets } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"

describe("MagicCarpets", function () {
  async function baseFixture(): Promise<{
    contract: MagicCarpets
    owner: SignerWithAddress
    otherAddresses: SignerWithAddress[]
  }> {
    const ContractFactory = await ethers.getContractFactory("MagicCarpets")

    const contract = await ContractFactory.deploy()
    await contract.deployed()

    const [owner, ...otherAddresses] = await ethers.getSigners()

    return { contract, owner, otherAddresses }
  }

  it("Can mint", async function () {
    const { contract, otherAddresses } = await loadFixture(baseFixture)
    const minter = otherAddresses[0]
    await contract.safeMint(minter.address)

    expect(await contract.balanceOf(minter.address)).to.equal(1)
    expect(await contract.ownerOf(0)).to.equal(minter.address)
    expect(await contract.totalSupply()).to.equal(1)
  })

  it("Tokens reuse metadata", async function () {
    const { contract, otherAddresses } = await loadFixture(baseFixture)
    const minter = otherAddresses[0]

    for (let i = 0; i < 17; i++) {
      await contract.safeMint(minter.address)
    }

    const secondToLastTokenUri = await contract.tokenURI(15)
    const lastTokenUri = await contract.tokenURI(16)

    expect(secondToLastTokenUri.slice(-7)).to.equal("15.json")
    expect(lastTokenUri.slice(-7)).to.equal("/0.json")
  })
})
