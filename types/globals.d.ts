// Globals shared with the vendored globe engine.
declare global {
  interface Window {
    ZL_GEO?: unknown;
    ZL_FLAGS?: Record<string, string>;
    ZLBOOT?: () => void;
    ZeroLagMap?: unknown;
    __zlBusy?: boolean;
    __fdKick?: () => void;
  }
}
export {};
