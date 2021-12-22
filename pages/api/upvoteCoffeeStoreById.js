import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + 1;

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            return res.json(minifiedRecords);
          }
        } else {
          return res
            .status(400)
            .json({ message: "Coffee store id doesn't exist", id });
        }
      } else {
        return res.status(400).json({ message: "Id is missing" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error upvoting coffee store", error });
  }
};

export default upvoteCoffeeStoreById;
