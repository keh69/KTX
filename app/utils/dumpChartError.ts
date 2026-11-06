// [임시 · 보여주기용] 차트 화면 덤프 에러로그 생성기. 뜰 때마다 코드/종류/메시지/스택/데이터를 전부 무작위 조합한다.
// 요청 시 이 파일, [symbol].vue의 덤프오류 블록, AdminErrorConsole의 forced 처리를 지우면 원래대로 돌아간다.

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))
const rp = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!
const hex = (n: number) => Array.from({ length: n }, () => '0123456789abcdef'[ri(0, 15)]).join('')
const shuffle = <T>(arr: readonly T[]) => [...arr].sort(() => Math.random() - 0.5)
const pickSome = <T>(arr: readonly T[], min: number, max: number) => shuffle(arr).slice(0, ri(min, Math.min(max, arr.length)))

const AREAS = ['Chart', 'Kline', 'Candle', 'Series', 'Pane', 'PriceScale', 'TimeScale', 'Indicator', 'Overlay', 'Crosshair', 'Depth', 'Tick', 'Feed', 'Render', 'Canvas', 'Layout', 'Viewport', 'Cursor', 'Legend', 'Volume']
const KINDS = ['Error', 'Exception', 'Fault', 'Failure', 'Violation', 'Overflow', 'Timeout', 'Mismatch', 'Corruption', 'Desync']
const CODE_PREFIX = ['CHT', 'KLN', 'RND', 'SRS', 'FED', 'IDX', 'CVS', 'TSC', 'PSC', 'WSK', 'GFX', 'BUF']
const TFS = ['1s', '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1w']
const SERIES = ['candles', 'volume', 'ma5', 'ma7', 'ma20', 'ma25', 'ma60', 'ma99', 'ema12', 'ema26', 'boll.upper', 'boll.lower', 'macd.hist', 'rsi14', 'kdj.k', 'vwap', 'obv', 'sar', 'atr14']
const TARGETS = ['price scale', 'time scale', 'crosshair', 'grid layer', 'watermark', 'legend', 'last price line', 'order lines', 'position marker', 'liquidation line', 'volume pane', 'indicator pane', 'drawing tools layer', 'tooltip']
const VERBS = ['update rejected', 'render aborted', 'apply failed', 'merge failed', 'flush stalled', 'decode failed', 'resize failed', 'commit rolled back', 'snapshot rejected', 'frame dropped', 'sync lost', 'allocation failed', 'validation failed', 'handshake timed out']
const REASONS = [
  () => `time order violation (t=${Math.floor(Date.now() / 1000) - ri(1, 9999)})`,
  () => `checksum mismatch: expected 0x${hex(8)}, got 0x${hex(8)}`,
  () => `sequence gap ${ri(2, 9999)} (last=${ri(100000, 999999)})`,
  () => `NaN in OHLC field "${rp(['open', 'high', 'low', 'close', 'volume'])}"`,
  () => `buffer overflow at index ${ri(1000, 65535)} (cap ${rp([4096, 8192, 16384, 32768, 65536])})`,
  () => `context lost (${rp(['WebGL', 'WebGL2', 'Canvas2D', 'OffscreenCanvas'])})`,
  () => `worker #${ri(1, 16)} exited with code ${rp([1, 2, 134, 137, 139, 255])}`,
  () => `price out of range: ${(Math.random() * 100000).toFixed(ri(0, 8))} not in [${ri(0, 999)}, ${ri(1000, 99999)}]`,
  () => `bar spacing ${(Math.random() * 0.01).toFixed(6)} below minimum`,
  () => `deadlock detected after ${ri(500, 30000)}ms`,
  () => `heap limit ${ri(256, 4096)}MB reached`,
  () => `invalid state transition ${rp(['IDLE', 'LOADING', 'READY', 'STALE', 'SYNCING'])} -> ${rp(['IDLE', 'LOADING', 'READY', 'STALE', 'SYNCING', 'DISPOSED'])}`,
  () => `socket closed (code ${rp([1001, 1006, 1011, 1012, 1013, 4000 + ri(0, 999)])})`,
  () => `unexpected token 0x${hex(2)} at offset ${ri(0, 99999)}`
]
const MODULES = ['chart-core.mjs', 'chart-render.mjs', 'chart-scale.mjs', 'chart-loop.mjs', 'kline-feed.ts', 'bar-merger.ts', 'indicator-worker.ts', 'market-stream.ts', 'series-store.ts', 'pane-layout.ts', 'gfx-backend.mjs', 'tick-decoder.ts', 'snapshot-cache.ts', 'overlay-manager.ts']
const CLASSES = ['CandlestickSeries', 'SeriesApi', 'PaneRenderer', 'PriceScale', 'TimeScale', 'KlineFeed', 'BarMerger', 'IndicatorWorker', 'SnapshotCache', 'TickDecoder', 'OverlayManager', 'ChartModel', 'FrameScheduler', 'GfxContext', 'MarketStream', 'LayoutEngine']
const METHODS = ['update', 'applyBar', 'draw', 'recalculate', 'flush', 'onTick', 'merge', 'commit', 'resize', 'decode', 'invalidate', 'render', 'sync', 'dispatch', 'postMessage', 'setData', 'computeRange', 'paint']
const DATA_FIELDS: Array<[string, () => unknown]> = [
  ['series', () => rp(SERIES)],
  ['lastBarTime', () => Math.floor(Date.now() / 1000) - ri(1, 90) * 60],
  ['incomingBarTime', () => Math.floor(Date.now() / 1000) - ri(91, 600) * 60],
  ['seq', () => ri(100000, 9999999)],
  ['traceId', () => `${hex(8)}-${hex(4)}-${hex(4)}-${hex(4)}-${hex(12)}`],
  ['retry', () => ri(0, 9)],
  ['bars', () => ri(100, 20000)],
  ['renderer', () => rp(['canvas2d', 'webgl', 'webgl2', 'offscreen'])],
  ['heapUsedMB', () => ri(60, 2048)],
  ['fps', () => ri(1, 60)],
  ['latencyMs', () => ri(20, 9000)],
  ['worker', () => `w${ri(1, 16)}`],
  ['frame', () => ri(1000, 999999)],
  ['paneId', () => ri(0, 5)],
  ['checksum', () => `0x${hex(8)}`],
  ['bufferSize', () => rp([4096, 8192, 16384, 32768, 65536])],
  ['droppedPoints', () => ri(1, 5000)],
  ['state', () => rp(['IDLE', 'LOADING', 'READY', 'STALE', 'SYNCING', 'DISPOSED'])],
  ['gpu', () => rp(['ANGLE (Intel)', 'ANGLE (NVIDIA)', 'Apple GPU', 'Adreno 650', 'Mali-G78', 'SwiftShader'])],
  ['socket', () => rp(['OPEN', 'CLOSING', 'CLOSED', 'RECONNECTING'])]
]

export function makeDumpChartError(symbol: string) {
  const sym = String(symbol || '').toUpperCase()
  const tf = rp(TFS)
  const cls = `${rp(AREAS)}${rp(KINDS)}`
  const code = `${rp(CODE_PREFIX)}-${ri(1000, 9999)}`
  const message = `${cls} [${code}]: ${rp(['', `${rp(SERIES)} `, `${rp(TARGETS)} `])}${rp(VERBS)} — ${rp(REASONS)()} (${sym}${rp(['', ` ${tf}`, `@${tf}`])})`
  const frames = Array.from({ length: ri(4, 12) }, () => `    at ${rp(CLASSES)}.${rp(METHODS)} (${rp(MODULES)}:${ri(10, 9999)}:${ri(1, 80)})`)
  const data: Record<string, unknown> = { code, symbol: sym, interval: tf }
  for (const [k, gen] of pickSome(DATA_FIELDS, 4, 12)) data[k] = gen()
  data.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return {
    at: new Date().toISOString(),
    type: rp(['window', 'promise', 'vue', 'fetch-network'] as const),
    url: typeof window !== 'undefined' ? window.location.href : '',
    message,
    stack: [`${cls}: ${message}`, ...frames].join('\n'),
    data,
    forced: true
  }
}
