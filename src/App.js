import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Sales from './screens/Sales'
import Checkout from './screens/Checkout'
import Profile from './screens/Profile'
import Payment from './screens/Payment'
import History from './screens/History'
import Order from './screens/Order'
import Receipt from './screens/Receipt'
import NotFound from './screens/NotFound'
import Upload from './screens/Upload'
import Download from './screens/Download'

function App() {

  return (
    <BrowserRouter>

        <Switch>
          <Route exact path="/download" component={Download}/>
          <Route exact path="/upload" component={Upload}/>
          <Route exact path="/:id/checkout" component={Checkout}/>
          <Route exact path="/:id/profile" component={Profile}/>
          <Route exact path="/:id/payment" component={Payment}/>
          <Route exact path="/:id/history" component={History}/>
          <Route exact path="/:id/order" component={Order}/>
          <Route exact path="/:id/receipt" component={Receipt}/>
          <Route exact path="/:id/" component={Sales}/>
          <Route exact path="/" component={NotFound}/>
        </Switch>

    </BrowserRouter>
  );
}

export default App;
