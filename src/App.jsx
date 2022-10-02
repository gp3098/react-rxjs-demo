import './App.css';
import { useRef } from 'react';
import { useEffect } from 'react';
import { fromEvent, interval, map, mapTo, merge, scan, startWith, switchMap, switchMapTo, takeUntil } from 'rxjs';
//针对这个公众号的文章进行学习
//https://mp.weixin.qq.com/s/5sXPioGOZ73narerYZF9Wg

function App() {
  const startBtnRef = useRef(null);
  const pauseBtnRef = useRef(null);
  const resetBtnRef = useRef(null);
  useEffect(() => {
    const pauseBtnClick$ = fromEvent(pauseBtnRef.current, 'click');
    const startBtnClick$ = fromEvent(startBtnRef.current, 'click');
    const resetBtnClick$ = fromEvent(resetBtnRef.current, 'click');
    const perSecond$ = interval(1000);

    const addOne = (acc) => ({ count: acc.count + 1 });

    const reset = () => ({ count: 0 });

    const intervalCanBeStopped$ = perSecond$.pipe(takeUntil(pauseBtnClick$));

    const addOneOrReset$ = merge(intervalCanBeStopped$.pipe(map(() => addOne)), resetBtnClick$.pipe(map(() => reset)));

    const subscription = startBtnClick$
      .pipe(
        switchMap(() => addOneOrReset$),
        startWith({ count: 0 }),
        scan((acc, curr) => curr(acc)),
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
        <button ref={pauseBtnRef}>pause button</button>
        <button ref={resetBtnRef}>reset button</button>
      </div>
    </div>
  );
}

export default App;
