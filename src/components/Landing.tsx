import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { Particles } from "@/components/magicui/particles";
import airdrop from "../../public/airdrop.svg";

function Landing() {
    return (
        <section className="relative flex flex-col items-center justify-center h-screen">
            <Particles className="absolute inset-0" color="#FF6B35" quantity={700}/>
            <AnimatedGradientText className="text-center my-3 text-5xl font-bold" colorFrom="#FF6B35" colorTo="#FFFFFF">
                Effortless ERC20 Token Airdrops
            </AnimatedGradientText>
            <p className="text-center my-3 text-lg">
                Distribute your tokens to multiple recipients on any EVM chain <br /> in a single transaction save time and gas fees.
            </p>
            <button className="my-4 bg-white text-black px-6.5 py-3 text-sm rounded-md flex items-center gap-2 cursor-pointer">
                <img src={airdrop.src} alt="airdrop" className="w-5 h-5" /> 
                <p>AIRDROP TOKENS NOW</p>
            </button>
        </section>
    )
}

export default Landing;