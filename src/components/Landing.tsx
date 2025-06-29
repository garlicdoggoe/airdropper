import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Particles } from "@/components/magicui/particles";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import airdrop from "../../public/airdrop.svg";
import { Dock, DockIcon } from "@/components/magicui/dock";
import anvil from "../../public/anvil.png";
import arbitrum from "../../public/arbitrum.svg";
import base from "../../public/base.svg";
import ethereum from "../../public/ethereum.svg";
import optimism from "../../public/optimism.svg";
import zk from "../../public/zk.svg";

function Landing() {
    return (
        <section className="relative flex flex-col items-center justify-center h-screen">
            <Particles className="absolute inset-0" color="#FF6B35" quantity={700}/>
            <AnimatedGradientText className="text-center my-3 text-5xl font-bold" colorFrom="#FF6B35" colorTo="#FFFFFF">
                Effortless ERC20 Token Airdrops
            </AnimatedGradientText>
            <p className="text-center my-3 text-lg opacity-80">
                Distribute your tokens to multiple recipients in a single transaction save time and gas fees.
            </p>
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                        <div
                            {...(!ready && {
                                'aria-hidden': true,
                                style: {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <button 
                                            onClick={openConnectModal} 
                                            className="my-4 bg-white text-black px-3.5 py-3 text-sm rounded-md flex items-center gap-2 cursor-pointer"
                                        >
                                            <img src={airdrop.src} alt="airdrop" className="w-5 h-5" /> 
                                            <p>CONNECT WALLET TO AIRDROP TOKENS NOW</p>
                                        </button>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <button
                                            onClick={openChainModal}
                                            type="button"
                                            className="my-4 bg-red-600 text-white px-6.5 py-3 text-sm rounded-md flex items-center gap-2 cursor-pointer"
                                        >
                                            <p>Wrong network</p>
                                        </button>
                                    );
                                }

                                return (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={openChainModal}
                                            type="button"
                                            className="flex items-center bg-gray-800/80 p-2 rounded-md hover:bg-gray-700/80 transition"
                                        >
                                            {chain.hasIcon && (
                                                <div
                                                    style={{
                                                        background: chain.iconBackground,
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 999,
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {chain.iconUrl && (
                                                        <img
                                                            alt={chain.name ?? 'Chain icon'}
                                                            src={chain.iconUrl}
                                                            style={{ width: 24, height: 24 }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </button>

                                        <button
                                            onClick={openAccountModal}
                                            type="button"
                                            className="my-4 bg-white text-black px-6.5 py-3 text-sm rounded-md flex items-center gap-2 cursor-pointer"
                                        >
                                            <p>{account.displayName}
                                            {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''}</p>
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
            <div className="flex flex-col items-center mt-10">
                <span className="text-sm text-gray-500">Supported Chains</span>
                <Dock iconSize={72}>
                    <DockIcon>
                        <img className="w-12 h-12" src={ethereum.src} alt="Ethereum"/>
                    </DockIcon>
                    <DockIcon>
                        <img src={arbitrum.src} alt="Arbitrum"/>
                    </DockIcon>
                    <DockIcon>
                        <img src={optimism.src} alt="Optimism"/>
                    </DockIcon>
                    <DockIcon>
                        <img src={base.src} alt="Base"/>
                    </DockIcon>
                    <DockIcon>
                        <img src={zk.src} alt="zkSync"/>
                    </DockIcon>
                    <DockIcon>
                        <img src={anvil.src} alt="Anvil"/>
                    </DockIcon>
                </Dock>
            </div>
        </section>
    )
}

export default Landing;