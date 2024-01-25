const { ethers } = require('hardhat');
const { expect } = require('chai');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
    let token

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Stevcoin', 'STEV', 1000000)
    })

    describe('Deployment', () => {
        const name = 'Stevcoin'
        const symbol = 'STEV'
        const decimals = 18
        const totalSupply = tokens('1000000')

        it('has correct name', async () => {
            // fetch Token from blockchain
            // read token name
            // check that name is correct
            expect(await token.name()).to.equal(name)
        })
        it('has correct symbol', async () => {
            // fetch Token from blockchain
            // read token symbol
            // check that symbol is correct
            expect(await token.symbol()).to.equal(symbol)
        })
        it('has correct decimals', async () => {
            // fetch Token from blockchain
            // read token decimals
            // check that decimals is correct
            expect(await token.decimals()).to.equal(decimals)
        })
        it('has correct total supply', async () => {
            // fetch Token from blockchain
            // read token total supply
            // check that total supply is correct
            expect(await token.totalSupply()).to.equal(totalSupply)
        })
    })
})
