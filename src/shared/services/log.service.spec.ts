import {TestBed} from '@angular/core/testing';
import {LogService} from './log.service';

describe('LogService', () => {

  let logger: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        LogService
      ]
    });
    logger = TestBed.get(LogService);

    // Mock implementation of console.log to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('should create the logger', () => {
    expect(logger).toBeDefined();
  });

  it('should print a line to the console', () => {
    const spy = jest.spyOn(console, 'log');
    logger.log(`Test a log message with parameters ...`, ['One', 'Two', { name: 'Test', status: 'Fine' }]);
    expect(spy).toHaveBeenCalled();
  });
});
