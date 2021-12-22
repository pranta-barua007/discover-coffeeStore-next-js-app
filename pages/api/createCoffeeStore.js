const { table, getMinifiedRecords, findRecordByFilter } = require("../../lib/airtable");

const createCoffeeStore = async (req, res) => {
    try{
        const { fsq_id, name, address, neighborhood, voting, imgUrl } = req.body;
        if(req.method === 'POST') {
            if(fsq_id) {       
                const records = await findRecordByFilter(fsq_id);
        
                if(records.length !== 0) {
                    return res.json(records);
                }else {
                    if(name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    fsq_id,
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