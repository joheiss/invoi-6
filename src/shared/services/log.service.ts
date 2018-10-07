import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 9
}

@Injectable()
export class LogService {

  private level: LogLevel = environment.logLevel;

  debug(msg: string, ...optionalParams: any[]): void {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]): void {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]): void {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]): void {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]): void {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]): void {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]): void {
    if (this.shouldLog(level)) {
      let value: string;
      // build log string
      value = `${new Date().toTimeString().substr(0, 8)} - Type: ${LogLevel[level]} - Message: \n${msg}`;
      if (params.length) {
        value += `\nExtra Info: ${this.formatParams(params)}`;
      }
      console.log(value);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return (level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.All;
  }

  private formatParams(params: any[]): string {
    let result = params.join(',');
    // is there at least one object in the array then explode objects
    if (params.some(param => typeof param === 'object')) {
      result = '';
      for (const item of params) {
        result += JSON.stringify(item) + ',';
      }
    }
    return result;
  }
}
