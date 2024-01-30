const config = require('../src/config.json')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
    const millisecond = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, millisecond))
}

async function main() {
    const accounts = await ethers.getSigners()

    const { chainId } = await ethers.provider.getNetwork()
    console.log(`Using chainId: ${chainId}`)

    const Stek = await ethers.getContractAt('Token', config[chainId].STEK.address)
    console.log(`Stek Token fetched: ${Stek.address}`)

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}`)

    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
    console.log(`mDAI Token fetched: ${mDAI.address}`)

    // Fetch the deployed exchange
    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
    console.log(`Exchange fetched: ${exchange.address}`)

    // Give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    // user1 transfers 10,000 mETH
    let transaction, result
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    result = await transaction.wait()
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address} \n`)

    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)

    // user1 approves 10,000 STEK
    transaction = await Stek.connect(user1).approve(exchange.address, amount)
    result = await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}`)

    // user1 deposits 10,000 STEK
    transaction = await exchange.connect(user1).depositToken(Stek.address, amount)
    result = await transaction.wait()
    console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

    // user2 approves mETH
    transaction = await mETH.connect(user2).approve(exchange.address, amount)
    result = await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}`)

    // user2 deposits mETH
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    result = await transaction.wait()
    console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

    // user1 makes order to get tokens
    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Stek.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}`)

    // User 1 cancels order
    transaction = await exchange.connect(user1).cancelOrder(1)
    result = await transaction.wait()
    console.log(`Cancelled order from ${user1.address}\n`)

    await wait(1)

    // user 1 makes order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Stek.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}\n`)

    // user 2 fills order
    transaction = await exchange.connect(user2).fillOrder(2)
    result = await transaction.wait()
    console.log(`Filled order from ${user2.address}\n`)

    await wait(1)

    // user 1 makes another order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), Stek.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}\n`)

    // user 2 fills another order
    transaction = await exchange.connect(user2).fillOrder(3)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    // user 1 makes final order
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), Stek.address, tokens(20))
    result = await transaction.wait()
    console.log(`Made order from ${user1.address}\n`)

    // user 2 fills final order
    transaction = await exchange.connect(user2).fillOrder(4)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    // user 1 makes 10 orders
    for(let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), Stek.address, tokens(10))
        result = await transaction.wait()
        console.log(`Made order from ${user1.address}\n`)
        await wait(1)
    }

    // user 2 makes 10 orders
    for(let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user2).makeOrder(Stek.address, tokens(10), mETH.address, tokens(10 * i))
        result = await transaction.wait()
        console.log(`Made order from ${user2.address}\n`)
        await wait(1)
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
