export interface DSAssignPayload {
  [deviceId: string]: Station;
}

export interface Station {
  team: string;
  station: string;
}
