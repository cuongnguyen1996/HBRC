declare global {
  interface Window {
    browserInstanceManagerAPI: {
      getInstances: () => Promise<any>;
      addInstance: (name: string, url: string) => Promise<any>;
      deleteInstance: (sessionId: number) => Promise<any>;
      showInstanceWindow: (sessionId: string) => Promise<any>;
    };
    applicationAPI: {
      setApplicationOptions: (options: any) => Promise<any>;
    };
  }
}
export {};
