/**
 * React shim: re-exports all named exports from React so that webpack's
 * static analysis can detect them (fixes "useEffectEvent is not exported
 * from react" when Sanity Studio's ESM chunks use named React imports).
 */
'use strict';

// Use a relative path so webpack does NOT apply the react alias recursively
// (relative paths bypass resolve.alias)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _r = require('../node_modules/react/index.js');

exports.__esModule = true;
exports.default = _r;

exports.Activity = _r.Activity;
exports.Children = _r.Children;
exports.Component = _r.Component;
exports.Fragment = _r.Fragment;
exports.Profiler = _r.Profiler;
exports.PureComponent = _r.PureComponent;
exports.StrictMode = _r.StrictMode;
exports.Suspense = _r.Suspense;
exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE =
  _r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
exports.__COMPILER_RUNTIME = _r.__COMPILER_RUNTIME;
exports.act = _r.act;
exports.cache = _r.cache;
exports.cacheSignal = _r.cacheSignal;
exports.captureOwnerStack = _r.captureOwnerStack;
exports.cloneElement = _r.cloneElement;
exports.createContext = _r.createContext;
exports.createElement = _r.createElement;
exports.createRef = _r.createRef;
exports.forwardRef = _r.forwardRef;
exports.isValidElement = _r.isValidElement;
exports.lazy = _r.lazy;
exports.memo = _r.memo;
exports.startTransition = _r.startTransition;
exports.unstable_useCacheRefresh = _r.unstable_useCacheRefresh;
exports.use = _r.use;
exports.useActionState = _r.useActionState;
exports.useCallback = _r.useCallback;
exports.useContext = _r.useContext;
exports.useDebugValue = _r.useDebugValue;
exports.useDeferredValue = _r.useDeferredValue;
exports.useEffect = _r.useEffect;
exports.useEffectEvent = _r.useEffectEvent;
exports.useId = _r.useId;
exports.useImperativeHandle = _r.useImperativeHandle;
exports.useInsertionEffect = _r.useInsertionEffect;
exports.useLayoutEffect = _r.useLayoutEffect;
exports.useMemo = _r.useMemo;
exports.useOptimistic = _r.useOptimistic;
exports.useReducer = _r.useReducer;
exports.useRef = _r.useRef;
exports.useState = _r.useState;
exports.useSyncExternalStore = _r.useSyncExternalStore;
exports.useTransition = _r.useTransition;
exports.version = _r.version;
