import React, { useEffect, useState } from 'react';
import { Card, Avatar, Row, Col, Tooltip, Tag, message, Carousel } from 'antd';
import { Link } from 'react-router-dom';
import { EyeOutlined, StarTwoTone, ShoppingTwoTone } from '@ant-design/icons';
import axios from '../../axios';
import '../../App.css';

const Products = ({ currentUser, setCurrentUser, setCartValue }) => {
	const [productList, setProductList] = useState([]);
	const { Meta } = Card;
	useEffect(() => {
		async function checkExistingUser() {
			const res = await axios.get('/user/current');
			if (res?.statusText === 'OK') {
				setCurrentUser(res?.data);
			}
		}
		checkExistingUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function getProducts() {
		console.log(`here`);
		const req = await axios.get('/product/all/customer');
		if (req) {
			setProductList(req?.data);
		}
	}
	async function getCartProducts() {
		console.log(`cart product`);
		console.log(`currentUser[0]?._id`, currentUser[0]?._id);
		const response = await axios.get(`/user/${currentUser[0]?._id}/cart`);
		if (response) {
			setCartValue(response?.data?.length);
		}
	}
	async function addToCart(id) {
		console.log(`get cart`);
		const res = await axios.post(`/product/${id}/add/cart`, currentUser[0]);
		if (res) {
			if (res?.data?._id) {
				message.success('Product added to cart successfully');
				getCartProducts();
			} else {
				message.error('Simillar product already exist in your cart');
			}
			console.log(`res while adding product to cart`, res);
		}
	}
	useEffect(() => {
		if (currentUser) getProducts();
	}, [currentUser]);
	console.log(`currentUser`, currentUser);
	return (
		<div className="bg-white shadow rounded-lg p-6">
			{productList?.length > 0 && (
				<Row gutter={[24, 24]}>
					{productList?.map((item) => (
						<Col xl={8} lg={10} md={12} sm={24} xs={24}>
							<div className="mx-8 ">
								<Card
									style={{
										width: 300,
										height: 300,
										margin: '10%',
										boxShadow: '10px 14px 18px #00ff66',
									}}
									cover={
										<Carousel autoplay>
											{item?.ImageURLOne?.url && (
												<div>
													<img
														style={{ width: 300, height: 300 }}
														alt="example"
														src={item?.ImageURLOne?.url}
													/>
												</div>
											)}

											{item?.ImageURLTwo?.url && (
												<div>
													<img
														style={{ width: 300, height: 300 }}
														alt="example"
														src={item?.ImageURLTwo?.url}
													/>
												</div>
											)}

											{item?.ImageURLThree?.url && (
												<div>
													<img
														style={{ width: 300, height: 300 }}
														alt="example"
														src={item?.ImageURLThree?.url}
													/>
												</div>
											)}

											{item?.ImageURLFour?.url && (
												<div>
													<img
														style={{ width: 300, height: 300 }}
														alt="example"
														src={item?.ImageURLFour?.url}
													/>
												</div>
											)}

											{item?.ImageURLFive?.url && (
												<div>
													<img
														style={{ width: 300, height: 300 }}
														alt="example"
														src={item?.ImageURLFive?.url}
													/>
												</div>
											)}
										</Carousel>
									}
									actions={[
										<Tooltip title={item?.product_rating}>
											<StarTwoTone key="rating" twoToneColor="yellow" />
										</Tooltip>,
										<ShoppingTwoTone
											onClick={() => {
												addToCart(item?._id);
											}}
											key="add"
										/>,
										<Link to={`/product/${item?._id}`}>
											<EyeOutlined key="ellipsis" />
										</Link>,
									]}
								>
									<Meta
										avatar={
											<Avatar
												style={{
													color: 'black',
													backgroundColor: '#00ff66',
												}}
											>
												<span className="capitalize">$ {item?.product_price}</span>
											</Avatar>
										}
										title={
											<div className="w-full flex justify-between">
												<div>{item?.product_name}</div>{' '}
												<div>
													{item?.product_category?.map((category) => {
														let color = category.length === 5 ? 'geekblue' : 'green';
														if (category === 'Children') {
															color = 'volcano';
														}
														if (category === 'Home Accessories') {
															color = 'Yellow';
														}
														return (
															<Tag color={color} key={category}>
																{category.toUpperCase()}
															</Tag>
														);
													})}
												</div>
											</div>
										}
										description={<div className="truncate">{item?.product_description}</div>}
									/>
								</Card>
							</div>
						</Col>
					))}
				</Row>
			)}
		</div>
	);
};
export default Products;
