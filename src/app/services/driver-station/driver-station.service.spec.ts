import { TestBed } from '@angular/core/testing';

import { DriverStationService } from './driver-station.service';

describe('DriverStationService', () => {
  let service: DriverStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
