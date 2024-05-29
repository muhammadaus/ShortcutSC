const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('DAO', () => {

  const NAME = 'DAONFT'
  const SYMBOL = 'DNFT'
  const COST = ether(10)
  const MAX_SUPPLY = 25
  //DAPP Punks for reference
  const BASE_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  const ALLOW_MINTING_ON = (Date.now()).toString().slice(0, 10) 
  
  let token, dao
  let nft,
      deployer,
      minter,
      voter1,
      voter2,
      voter3,
      voter4,
      voter5,
      recipient,
      user

  beforeEach(async () => {

    // Set up accounts
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    minter = accounts[1]
    voter1 = accounts[2]
    voter2 = accounts[3]
    voter3 = accounts[4]
    voter4 = accounts[5]
    voter5 = accounts[6]
    recipient = accounts[7]
    user = accounts[8]

    console.log(minter.address)

    // Deploy Token
    const Token = await ethers.getContractFactory('Token')
    token = await Token.deploy('Dao Token', 'DTOKEN', '1000000')

    console.log(token.address)

    // Send tokens to voters - each one gets 20%
    transaction = await token.connect(deployer).transfer(voter1.address, tokens(200000))
    await transaction.wait()

    transaction = await token.connect(deployer).transfer(voter2.address, tokens(200000))
    await transaction.wait()

    transaction = await token.connect(deployer).transfer(voter3.address, tokens(200000))
    await transaction.wait()

    transaction = await token.connect(deployer).transfer(voter4.address, tokens(200000))
    await transaction.wait()

    transaction = await token.connect(deployer).transfer(voter5.address, tokens(200000))
    await transaction.wait()

    // Deploy and Mint NFT
    const NFT = await ethers.getContractFactory('NFT')
    nft = await NFT.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, ALLOW_MINTING_ON, BASE_URI)
 
    console.log(nft.address)

    // Deploy DAO
    // Set Quorum to > 50% of token total supply.
    // 500k tokens + 1 wei, i.e., 500000000000000000000001

    const DAO = await ethers.getContractFactory('DAO')
    console.log(token.address, nft.address, '500000000000000000000001')

    // DAO.deploy got mistaken with an ENS address

    dao = await DAO.deploy(token.address, nft.address, '500000000000000000000001')

    console.log(dao.address)

    // Cannot mint more than 1 NFT

    console.log(`Minting NFT amount: ${25}`);
    await nft.mint((25), { value: ether(250) });

    console.log(`Checking owner of NFT ${25}`);
    console.log(await nft.ownerOf(25));

    // Funder sends 25 nft to DAO treasury for Governance
    // Cannot use safeTransferFrom or transferFrom

    console.log(`Transferring NFT`);

    for (var i = 0; i < 25; i++) {
      await nft.transferFrom(deployer.address, dao.address, (i + 1));
    }
    console.log(`NFT sent to: ${await nft.ownerOf(25)}`);
  })


  describe('Deployment', () => {

    it('sends nft to the DAO treasury', async () => {
      expect(await nft.ownerOf(25)).to.equal(dao.address)
    })

    it('returns token address', async () => {
      expect(await dao.token()).to.equal(token.address)
    })

    it('returns quorum', async () => {
      expect(await dao.quorum()).to.equal('500000000000000000000001')
    })

  })

  describe('Proposal creation', () => {
    let transaction, result

    describe('Success', () => {

      beforeEach(async () => {
        transaction = await dao.connect(voter1).createProposal('Proposal 1', recipient.address)
        result = await transaction.wait()
      })

      it('updates proposal count', async () => {
        expect(await dao.proposalCount()).to.equal(1)
      })

      it('updates proposal mapping', async () => {
        const proposal = await dao.proposals(1)

        expect(proposal.id).to.equal(1)
        expect(proposal.recipient).to.equal(recipient.address)
      })

      it('emits a propose event', async () => {
        await expect(transaction).to.emit(dao, 'Propose')
          .withArgs(1, 1, recipient.address, voter1.address)
      })

    })

    describe('Failure', () => {
      it('reject non-voter', async () => {
        await expect(dao.connect(user).createProposal('Proposal 1', recipient.address)).to.be.reverted
      })
    })
  })

  describe('Voting', () => {
    let transaction, result

    beforeEach(async () => {
      transaction = await dao.connect(voter1).createProposal('Proposal 1', recipient.address)
      result = await transaction.wait()
    })

    describe('Success', () => {

      beforeEach(async () => {
        transaction = await dao.connect(voter1).vote(1)
        result = await transaction.wait()
      })

      it('updates vote count', async () => {
        const proposal = await dao.proposals(1)
        expect(proposal.votes).to.equal(tokens(200000))
      })

      it('emits vote event', async () => {
        await expect(transaction).to.emit(dao, "Vote")
          .withArgs(1, voter1.address)
      })

    })

    describe('Failure', () => {

      it('reject non-voter', async () => {
        await expect(dao.connect(user).vote(1)).to.be.reverted
      })


      it('rejects double voting', async () => {
        transaction = await dao.connect(voter1).vote(1)
        await transaction.wait()

        await expect(dao.connect(voter1).vote(1)).to.be.reverted
      })
    })
  })


  describe('Governance', () => {
    let transaction, result

    describe('Success', () => {

      beforeEach(async () => {
        // Create proposal
        transaction = await dao.connect(voter1).createProposal('Proposal 1', recipient.address)
        result = await transaction.wait()

        // Vote
        transaction = await dao.connect(voter1).vote(1)
        result = await transaction.wait()

        transaction = await dao.connect(voter2).vote(1)
        result = await transaction.wait()

        transaction = await dao.connect(voter3).vote(1)
        result = await transaction.wait()

        // Finalize proposal
        transaction = await dao.connect(voter1).finalizeProposal(1)
        result = await transaction.wait()
      })

      it('transfers nft to recipient', async () => {
        expect(await nft.ownerOf(1)).to.equal(recipient.address)
        console.log(await nft.ownerOf(1))
      })

      it('it updates the proposal to finalized', async () => {
        const proposal = await dao.proposals(1)
        expect(proposal.finalized).to.equal(true)
      })

      it('emits a Finalize event', async () => {
        await expect(transaction).to.emit(dao, "Finalize")
          .withArgs(1)
      })

    })

    describe('Failure', () => {

      beforeEach(async () => {
        // Create proposal
        transaction = await dao.connect(voter1).createProposal('Proposal 1', recipient.address)
        result = await transaction.wait()

        // Vote
        transaction = await dao.connect(voter1).vote(1)
        result = await transaction.wait()

        transaction = await dao.connect(voter2).vote(1)
        result = await transaction.wait()
      })


      it('rejects finalization if not enough votes', async () => {
        await expect(dao.connect(voter1).finalizeProposal(1)).to.be.reverted
      })

      it('rejects finalization from a non-voter', async () => {
        // Vote 3
        transaction = await dao.connect(voter3).vote(1)
        result = await transaction.wait()

        await expect(dao.connect(user).finalizeProposal(1)).to.be.reverted
      })

      it('rejects proposal if already finalized', async () => {
        // Vote 3
        transaction = await dao.connect(voter3).vote(1)
        result = await transaction.wait()

        // Finalize
        transaction = await dao.connect(voter1).finalizeProposal(1)
        result = await transaction.wait()

        // Try to finalize again
        await expect(dao.connect(voter1).finalizeProposal(1)).to.be.reverted
      })

    })
  })
})
