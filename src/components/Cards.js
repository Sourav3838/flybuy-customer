import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
	return (
		<div className="cards">
			<h1>Check out our best selling products!</h1>
			<div className="cards__container">
				<div className="cards__wrapper">
					<ul className="cards__items">
						<CardItem
							src="images/shirt.jpg"
							text="Here are some exotic shirts"
							label="Men"
							path="/log-in"
						/>
						<CardItem
							src="images/kurta.jpg"
							text="Classy clothes are the new jewellery"
							label="Women"
							path="/log-in"
						/>
					</ul>
					<ul className="cards__items">
						<CardItem
							src="images/shoe.jpg"
							text="Shoes that take everybody down!!"
							label="Men"
							path="/log-in"
						/>
						<CardItem src="images/toy.jpg" text="Best toys awaiting" label="Children" path="/log-in" />
						<CardItem
							src="images/kit.jpg"
							text="Ride through the new collection of make up kits"
							label="Women"
							path="/log-in"
						/>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Cards;
