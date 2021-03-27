import React from 'react';
import '../App.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
	return (
		<div className="hero-container">
			<video src="/videos/video-3.mp4" autoPlay muted loop />
			<h1>LETS DO SHOPPING !!!</h1>
			<p>What are you waiting for?</p>
			<div className="hero-btns">
				<Button className="btns" buttonStyle="btn--outline" buttonSize="btn--large">
					BECOME A RETAILER
				</Button>
				<Link to="/log-in">
					<Button
						className="btns"
						buttonStyle="btn--primary"
						buttonSize="btn--large"
						onClick={console.log('hey')}
					>
						VIEW PRODUCTS <i className="far fa-play-circle" />
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default HeroSection;
