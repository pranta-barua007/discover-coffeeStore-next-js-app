const { findRecordByFilter } = require("../../lib/airtable");

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        return res.json(records);
      }else {
          return res.status(400).json({ message: `id couldn't be found ${fsq_id}` })
      }
    } else {
      return res.status(400).json({ err: "id is missing" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "something went wrong", err });
  }
};

export default getCoffeeStoreById;
