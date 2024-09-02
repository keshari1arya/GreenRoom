import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetListShellComponent } from './asset-list-shell.component';

describe('AssetListShellComponent', () => {
  let component: AssetListShellComponent;
  let fixture: ComponentFixture<AssetListShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetListShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetListShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
