export const getHistoryPrice = async (token: string, date: string): Promise<number> => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${token}/history?date=${date}&localization=false`
        );
        const data = await response.json();
        return data.market_data.current_price.usd || 0;
    } catch (error) {
        throw new Error("Error fetching price");
    }
};