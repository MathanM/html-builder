import { TestBed } from '@angular/core/testing';

import { FontFamilyService } from './font-family.service';

describe('FontFamilyService', () => {
  let service: FontFamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontFamilyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
