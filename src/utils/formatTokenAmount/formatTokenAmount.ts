export function formatTokenAmount(weiAmount: number, decimals: number): string {
    const formattedAmount = weiAmount / Math.pow(10, decimals);
    return formattedAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}