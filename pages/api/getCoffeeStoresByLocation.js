import { fetchCoffeeShopsData } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
    try {
        const { latLong, limit } = req.query;
        const response = await fetchCoffeeShopsData(latLong, limit);
        return res.status(200).json(response);
    }catch(err) {
        console.error(err);
        return res.status(500).json({message: "Failed to fetch data", err});
    }
}

export default getCoffeeStoresByLocation;