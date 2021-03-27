import React, { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Cart from './components/pages/Cart';
import LogIn from './components/pages/Login';
import ViewProduct from './components/pages/ViewProduct';

function App() {
	const [currentUser, setCurrentUser] = useState();
	const [cartValue, setCartValue] = useState(0);

	return (
		<>
			<Router>
				<Navbar
					currentUser={currentUser}
					setCurrentUser={setCurrentUser}
					setCartValue={setCartValue}
					cartValue={cartValue}
				/>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/services" component={Services} />
					<Route
						path="/products"
						// component={Products}
						render={(props) => (
							<Products
								currentUser={currentUser}
								setCurrentUser={setCurrentUser}
								setCartValue={setCartValue}
								{...props}
							/>
						)}
					/>
					<Route
						path="/product/:productId"
						render={(props) => (
							<ViewProduct
								currentUser={currentUser}
								setCurrentUser={setCurrentUser}
								setCartValue={setCartValue}
								{...props}
							/>
						)}
					/>
					<Route path="/sign-up" component={SignUp} />
					<Route path="/log-in" component={LogIn} />
					<Route
						path={`/user/:userId/cart`}
						render={(props) => (
							<Cart currentUser={currentUser} setCurrentUser={setCurrentUser} {...props} />
						)}
					/>
				</Switch>
			</Router>
		</>
	);
}

export default App;
