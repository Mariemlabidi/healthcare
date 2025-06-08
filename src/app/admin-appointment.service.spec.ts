import { TestBed } from '@angular/core/testing';

import { AdminAppointmentService } from './admin-appointment.service';

describe('AdminAppointmentService', () => {
  let service: AdminAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
