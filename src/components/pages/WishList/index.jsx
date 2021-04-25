import React, { useEffect, useState } from 'react';
import {
	Card,
	Avatar,
	Row,
	Col,
	Tooltip,
	Tag,
	message,
	Carousel,
	Button,
	Popover,
	Result,
	Space,
	Table,
	Input,
	Radio,
	Badge,
} from 'antd';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
	EyeOutlined,
	StarTwoTone,
	ShoppingTwoTone,
	PlusCircleOutlined,
	EyeTwoTone,
	UserOutlined,
	FilterTwoTone,
	HeartTwoTone,
} from '@ant-design/icons';
import axios from '../../../axios';
import '../../../App.css';

const Products = ({ currentUser, setCurrentUser, setCartValue, setWishlistValue }) => {
	const [productList, setProductList] = useState([]);

	const { userId } = useParams();
	const { Meta } = Card;
	const history = useHistory();
	console.log(`productList`, productList);
	useEffect(() => {
		async function checkExistingUser() {
			const res = await axios.get(`/user/current/${userId}`);
			console.log(`res`, res);
			if (res?.status === 201) {
				localStorage.setItem('user', JSON.stringify(res?.data[0]));
				setCurrentUser(JSON.parse(localStorage.getItem('user')));
			}
		}
		checkExistingUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function getWishlistProducts() {
		console.log(`called`);
		console.log(`wishlist product`);

		const response = await axios.get(`/user/${JSON.parse(localStorage.getItem('user'))?._id}/wishlist`);
		if (response) {
			console.log(`wishlist`, response?.data);
			setWishlistValue(response?.data?.length);
			setProductList(response?.data);
		}
	}

	useEffect(() => {
		getWishlistProducts();
	}, [currentUser]);
	console.log(`currentUser`, currentUser);

	async function getCartProducts() {
		console.log(`called`);
		console.log(`cart product`);
		console.log(`currentUser[0]?._id`, currentUser[0]?._id);
		const response = await axios.get(`/user/${JSON.parse(localStorage.getItem('user'))?._id}/cart`);
		if (response) {
			console.log(`setting cart value`);
			setCartValue(response?.data?.length);
		}
	}

	async function addToCart(id) {
		console.log(`get cart`);
		const res = await axios.post(`/product/${id}/add/cart`, JSON.parse(localStorage.getItem('user')));
		if (res) {
			if (res?.data?._id) {
				message.success('Product added to cart successfully');
				getCartProducts();
				console.log(`res while adding product to cart`, res);
				return true;
			} else {
				message.error('Simillar product already exist in your cart');
			}
		}
	}

	async function moveToCart(id, userId) {
		console.log(`move to  cart`);
		if (addToCart(id)) {
			const res = await axios.delete(`/product/${id}/remove/${userId}/wishlist`);
			if (res) {
				if (res?.data) {
					message.success('Product removed from wishlist successfully');
					getWishlistProducts();
				}
				console.log(`res while adding product to cart`, res);
			}
		}
	}
	return (
		<div className="bg-white shadow rounded-lg p-6">
			{currentUser?.role !== 'retailer' && productList?.length > 0 ? (
				<>
					<Row gutter={[24, 24]}>
						{productList?.map((item) => (
							<Col xl={8} lg={10} md={12} sm={24} xs={24}>
								<div className="mx-8 ">
									<Badge.Ribbon
										className="cursor-pointer"
										text={
											<span
												onClick={() => {
													console.log(`1`, 1);
													moveToCart(item?.productId, item?.user);
												}}
											>
												Move to cart
											</span>
										}
									>
										<Card
											style={{
												width: 300,
												height: 300,
												margin: '10%',
												boxShadow: '10px 14px 18px #00ff66',
											}}
											cover={
												<Carousel autoplay>
													{item?.product?.ImageURLOne?.url && (
														<div>
															<img
																style={{ width: 300, height: 300 }}
																alt="example"
																src={item?.product?.ImageURLOne?.url}
															/>
														</div>
													)}

													{item?.product?.ImageURLTwo?.url && (
														<div>
															<img
																style={{ width: 300, height: 300 }}
																alt="example"
																src={item?.product?.ImageURLTwo?.url}
															/>
														</div>
													)}

													{item?.product?.ImageURLThree?.url && (
														<div>
															<img
																style={{ width: 300, height: 300 }}
																alt="example"
																src={item?.product?.ImageURLThree?.url}
															/>
														</div>
													)}

													{item?.product?.ImageURLFour?.url && (
														<div>
															<img
																style={{ width: 300, height: 300 }}
																alt="example"
																src={item?.product?.ImageURLFour?.url}
															/>
														</div>
													)}

													{item?.product?.ImageURLFive?.url && (
														<div>
															<img
																style={{ width: 300, height: 300 }}
																alt="example"
																src={item?.product?.ImageURLFive?.url}
															/>
														</div>
													)}
												</Carousel>
											}
											actions={[
												<Tooltip title={item?.product?.product_rating}>
													<StarTwoTone key="rating" twoToneColor="yellow" />
												</Tooltip>,

												<ShoppingTwoTone
													onClick={() => {
														console.log(`1`, 1);
														moveToCart(item?.productId, item?.user);
													}}
													key="add"
												/>,
												<Link to={`/product/${item?.productId}`}>
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
														<span className="capitalize">
															INR {item?.product?.product_price}
														</span>
													</Avatar>
												}
												title={
													<div className="w-full flex justify-between">
														<div>{item?.product?.product_name}</div>{' '}
														<div>
															{item?.product?.product_category?.map((category) => {
																let color =
																	category.length === 5 ? 'geekblue' : 'green';
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
												description={
													<div className="truncate">{item?.product?.product_description}</div>
												}
											/>
										</Card>
									</Badge.Ribbon>
								</div>
							</Col>
						))}
					</Row>
				</>
			) : (
				<>no product found</>
			)}
		</div>
	);
};
export default Products;
