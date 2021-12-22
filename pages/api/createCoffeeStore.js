const { table, getMinifiedRecords } = require("../../lib/airtable");

const createCoffeeStore = async (req, res) => {
    try{
        const { id, name, address, neighborhood, voting, imgUrl } = req.body;
        if(req.method === 'POST') {
            if(id) {       
                const findCoffeeStoreRecords = await table.select({
                    filterByFormula: `id=${id}`
                }).firstPage();
        
                if(findCoffeeStoreRecords.length !== 0) {
                    const records = getMinifiedRecords(findCoffeeStoreRecords);
                    return res.json(records)
                }else {
                    if(name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighborhood,
                                    voting,
                                    imgUrl
                                }
                            }
                        ]);
                        const records = getMinifiedRecords(createRecords);
                        return res.json({ records })
                    }else {
                        return res.status(400).json({message: 'missing required field name'});
                    }
                }
            }else {
                return res.status(400).json({message: 'missing required field id'});
            }
        }
    }catch(err) {
        console.error("error finding or creating coffeeStore", err);
        return res.status(500).json({message: "error finding or creating coffeeStore", err});
    }
};

export default createCoffeeStore;