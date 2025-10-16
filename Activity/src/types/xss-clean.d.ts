declare module 'xss-clean' {
  function xssClean(): (req: any, res: any, next: (err?: any) => void) => void;
  export = xssClean;
}
