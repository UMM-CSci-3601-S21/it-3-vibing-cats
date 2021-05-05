import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { LoginServiceMock } from 'src/testing/login-service-mock';

import { LearnerCardComponent } from './learner-card.component';

describe('LearnerCardComponent', () => {
  let component: LearnerCardComponent;
  let fixture: ComponentFixture<LearnerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ LearnerCardComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockCPService() },
        { provide: LoginService, useValue: new LoginServiceMock({ email: 'biruk@gmail.com',
        password: 'BirukMengistu', uid:'123'}) }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerCardComponent);
    component = fixture.componentInstance;
    component.learner = MockCPService.learners[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the correct learner packs', () => {
    expect(component.packs).toBe(MockCPService.testCPs);
  });
});
