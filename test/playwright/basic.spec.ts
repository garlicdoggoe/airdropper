import basicSetup from '../wallet-setup/basic.setup'
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import { anvil1Address, anvil2Address, mockTokenAddress, oneAmount } from '../test-constants'

// Set up the test environment with Synpress and MetaMask fixtures, using the basic setup configuration
const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should show mock token in token box', async ({ context, page, metamaskPage, extensionId }) => {
  // Create a new MetaMask instance with the provided context, page, password, and extension ID
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

  // Navigate to the root page
  await page.goto('/')

  // Click the connect button to initiate the wallet connection
  await page.getByTestId('rk-connect-button').click()
  await page.getByTestId('rk-wallet-option-metaMask').waitFor({
    state: 'visible',
    timeout: 30000
  });
  await page.getByTestId('rk-wallet-option-metaMask').click();
  await metamask.connectToDapp();

  // const customNetwork = {
  //   name: "Anvil",
  //   rpcUrl: "http://127.0.0.1:8545",
  //   chainId: 31337,
  //   symbol: "ETH"
  // }

  // await metamask.addNetwork(customNetwork);

  await expect(page.getByText("ERC20 Address")).toBeVisible();
 
})