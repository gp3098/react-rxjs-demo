import './App.css';
import { useRef } from 'react';
import { useEffect } from 'react';
import { asyncScheduler, buffer, filter, fromEvent, map, throttleTime } from 'rxjs';
//针对这个公众号的文章进行学习
//https://mp.weixin.qq.com/s/5sXPioGOZ73narerYZF9Wg

function App() {
  const btnRef = useRef(null);
  useEffect(() => {
    const btnClick$ = fromEvent(btnRef.current, 'click');

    const throttled$ = btnClick$.pipe(throttleTime(250, asyncScheduler, { leading: false, trailing: true }));

    const btnDblClick$ = btnClick$.pipe(
      buffer(throttled$),
      map((arr) => arr.length),
      filter((len) => len === 2)
    );

    const subscription = btnDblClick$.subscribe((e) => {
      console.log('双击啦');
      console.log(e);
    });
    return () => subscription.unsubscribe();
  });
  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button ref={btnRef}>Click me</button>
      </div>
    </div>
  );
}

export default App;
