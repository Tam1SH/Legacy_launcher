import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
		addListener(channel: Channels, func: (...args: unknown[]) => void): void;
		invoke(channel: Channels, ...args: unknown[]): Promise<unknown>;
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
		getSession() : any
      };
    };
  }
}

export {};
