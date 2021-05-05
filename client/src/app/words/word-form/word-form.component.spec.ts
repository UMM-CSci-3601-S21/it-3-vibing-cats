import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordFormComponent } from './word-form.component';

describe('WordFormComponent', () => {
  let component: WordFormComponent;
  let fixture: ComponentFixture<WordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not accept empty types', () => {
    expect(component.form).toBeTruthy();
  });
  it('adding works for valid values', () => {
    component.wordForm = 'something';
    component.add();
    expect(component.added).toBe(true);
  });
  it('adding doesnt work for valid values', () => {
    component.wordForm = '';
    component.add();
    expect(component.added).toBe(false);
  });
  it('should detect changes and clear component', () => {
    component.cleared = true;
    component.ngOnChanges({
      cleared: new SimpleChange(false, component.cleared, false)
    });
    fixture.detectChanges();
    expect(component.wordForm).toBe('');
    expect(component.added).toBe(false);
  });
  it('removeForm shoud work', () => {
    spyOn(component.removeForm, 'emit');
    component.remove();
    expect(component.removeForm.emit).toHaveBeenCalled();
  });
});
