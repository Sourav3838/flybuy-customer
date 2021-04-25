/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Tag, Space, Button } from 'antd';
import { useHistory, useParams, Link } from 'react-router-dom';
import './index.css';
import axios from '../../../axios';
import { EyeTwoTone } from '@ant-design/icons';

const RetailerSubscription = () => {
	return (
		<>
			<div className="promos mt-12">
				<div className="promo">
					<div className="deal">
						<span>Premium</span>
						<span>This is really a good deal!</span>
					</div>
					<span className="price">INR 1200</span>
					<ul className="features">
						<li>Some great feature</li>
						<li>Another super feature</li>
						<li>And more...</li>
					</ul>
					<Link to={`/sign-up?role=retailer&plan=premium&price=1200`}>
						<div className="mx-auto mb-6">
							<div className="flex justify-center mb-4">
								<div className=" w-24 px-6 py-2 cursor-pointer border-gray-100 rounded-full bg-blue-500 text-gray-900">
									Sign up
								</div>
							</div>
						</div>
					</Link>
				</div>
				<div className="promo scale">
					<div className="deal">
						<span>Plus</span>
						<span>This is really a good deal!</span>
					</div>
					<span className="price">INR 800</span>
					<ul className="features">
						<li>Some great feature</li>
						<li>Another super feature</li>
						<li>And more...</li>
					</ul>
					<Link to={`/sign-up?role=retailer&plan=plus&price=800`}>
						<div className="flex justify-center mb-4">
							<div className=" w-24 px-6 py-2 cursor-pointer border-gray-100 rounded-full bg-blue-500 text-gray-900">
								Sign up
							</div>
						</div>
					</Link>
				</div>
				<div className="promo">
					<div className="deal">
						<span>Basic</span>
						<span>Basic membership</span>
					</div>
					<span className="price">INR 500</span>
					<ul className="features">
						<li>Choose the one on the left</li>
						<li>We need moneyy</li>
						<li>And more...</li>
					</ul>
					<Link to={`/sign-up?role=retailer&plan=basic&price=500`}>
						<div className="flex justify-center mb-4">
							<div className=" w-24 px-6 py-2 cursor-pointer border-gray-100 rounded-full bg-blue-500 text-gray-900">
								Sign up
							</div>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
};

export default RetailerSubscription;
