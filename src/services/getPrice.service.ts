export const getPrice = async (token: string): Promise<number> => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
        );
        const data = await response.json();
        return data[token].usd || 0;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching price");
    }
};