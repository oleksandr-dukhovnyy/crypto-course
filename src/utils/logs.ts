const logs: App.Log[] = [];

type Logger = (log: App.Log) => void;

export const log = (log: App.Log) => {
  logs.push(log);

  if (logs.length > 50) {
    logs.splice(0, 3);
  }
};

export const getLogs = (): Readonly<App.Log[]> => logs;

export const initModuleLogger = (staticTrace: string | string[]): Logger => {
  const trace: string[] = typeof staticTrace === 'string' ? [staticTrace] : staticTrace;

  return _log =>
    log({
      ..._log,
      trace: [
        ...trace,
        ...((typeof _log.trace === 'string' ? [_log.trace] : _log.trace) || []),
      ],
    });
};
