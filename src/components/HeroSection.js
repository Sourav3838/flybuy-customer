import React from 'react';
import '../App.css';
import { Button } from './Button';
import { Link, useHistory } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
	const history = useHistory();
	return (
		<div className="hero-container ">
			<video src="/videos/video-3.mp4" autoPlay muted loop />
			<h1>LETS DO SHOPPING !!!</h1>
			<p>What are you waiting for?</p>
			<div className="hero-btns">
				<Link to="/retailer-subscription">
					<Button className="btns" buttonStyle="btn--outline" buttonSize="btn--large">
						BECOME A RETAILER
					</Button>
				</Link>
				<Link to="/log-in">
					<Button className="btns" buttonStyle="btn--primary" buttonSize="btn--large">
						VIEW PRODUCTS <i className="far fa-play-circle" />
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default HeroSection;
