import './App.css';
import { useRef } from 'react';
import { useEffect } from 'react';
import { fromEvent, interval, map, scan, startWith, switchMap, switchMapTo, takeUntil } from 'rxjs';
//针对这个公众号的文章进行学习
//https://mp.weixin.qq.com/s/5sXPioGOZ73narerYZF9Wg

function App() {
  const startBtnRef = useRef(null);
  const stopBtnRef = useRef(null);
  useEffect(() => {
    const stopBtnClick$ = fromEvent(stopBtnRef.current, 'click');
    const startBtnClick$ = fromEvent(startBtnRef.current, 'click');
    const perSecond$ = interval(1000);

    const intervalCanBeStopped$ = perSecond$.pipe(takeUntil(stopBtnClick$));
    const subscription = startBtnClick$
      .pipe(
        switchMap(() => intervalCanBeStopped$),
        startWith({ count: 0 }),
        scan((acc, curr) => ({ count: acc.count + 1 })),
        map((state) => state.count)
      )
      .subscribe((v) => {
        console.log(v);
      });

    return () => subscription.unsubscribe();
  });
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button ref={startBtnRef}>start button</button>
        <button ref={stopBtnRef}>stop button</button>
      </div>
    </div>
  );
}

export default App;
