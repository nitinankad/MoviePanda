import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { SocketIOProvider } from "use-socketio";
import Room from './views/Room';
import Homepage from './views/Homepage';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route exact path="/" component={Homepage} />
      <SocketIOProvider url="https://moviepanda.herokuapp.com/">
        <Route path="/:roomID" component={Room} />
      </SocketIOProvider>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root')
);

serviceWorker.unregister();
