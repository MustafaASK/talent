import { TestBed } from '@angular/core/testing';

import { CategoryListResolverService } from './category-list-resolver.service';

describe('CategoryListResolverService', () => {
  let service: CategoryListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
