import assert from "assert";
import { 
  TestHelpers,
  Api3ServerV1_UpdatedBeaconSetWithBeacons
} from "generated";
const { MockDb, Api3ServerV1 } = TestHelpers;

describe("Api3ServerV1 contract UpdatedBeaconSetWithBeacons event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Api3ServerV1 contract UpdatedBeaconSetWithBeacons event
  const event = Api3ServerV1.UpdatedBeaconSetWithBeacons.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Api3ServerV1_UpdatedBeaconSetWithBeacons is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Api3ServerV1.UpdatedBeaconSetWithBeacons.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualApi3ServerV1UpdatedBeaconSetWithBeacons = mockDbUpdated.entities.Api3ServerV1_UpdatedBeaconSetWithBeacons.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedApi3ServerV1UpdatedBeaconSetWithBeacons: Api3ServerV1_UpdatedBeaconSetWithBeacons = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      beaconSetId: event.params.beaconSetId,
      value: event.params.value,
      timestamp: event.params.timestamp,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualApi3ServerV1UpdatedBeaconSetWithBeacons, expectedApi3ServerV1UpdatedBeaconSetWithBeacons, "Actual Api3ServerV1UpdatedBeaconSetWithBeacons should be the same as the expectedApi3ServerV1UpdatedBeaconSetWithBeacons");
  });
});
