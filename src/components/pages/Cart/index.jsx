/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Avatar, Row, Col, Tooltip, Tag, Carousel, message, Result, Button, Badge, Skeleton } from 'antd';
import {
	EyeOutlined,
	StarTwoTone,
	CheckCircleTwoTone,
	PlusCircleOutlined,
	PlusCircleTwoTone,
	MinusCircleTwoTone,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import StripePayment from '../StripePayment';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import axios from '../../../axios';
import classNames from 'classnames';

const Cart = ({ currentUser, setCurrentUser, setCartValue }) => {
	let history = useHistory();
	const { width, height } = useWindowSize();
	const [cartList, setCartList] = useState([]);
	const [totalValue, setTotalValue] = useState([]);
	const [loading, setLoading] = useState({});
	const [offersLength, setOffersLength] = useState(0);

	const [finalClientSecret, setFinalClientSecret] = useState();
	const { Meta } = Card;
	const { userId } = useParams();
	async function getCartProducts(id) {
		console.log(`cart product`);
		console.log(`userId`, userId);
		const response = await axios.get(`/user/${userId}/cart`);
		if (response) {
			setCartList(response?.data);
			if (id) setLoading({ [id]: false });
		}
	}
	console.log(`totalValue`, totalValue);
	console.log(`cartList`, cartList);

	async function emptyCart() {
		console.log(`to empty`);
		const response = await axios.get(`/cart/${userId}/empty`);
		if (response) {
			setCartValue(0);
			message.success('Order created successfully');
			history.replace(`/order/user/${userId}`);
		} else {
			console.log(`no response`);
		}
	}
	async function getOrders() {
		const req = await axios.get(`/orders/all?user=${userId}`);
		if (req) {
			setOffersLength(req?.data?.length);
		}
	}
	useEffect(() => {
		if (userId) {
			getCartProducts();
			getOrders();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	async function createOrder(data) {
		console.log(`create a new order`);
		await axios.post('/order/create', data).then((res) => {
			if (res?.data?.message) {
				console.log(`here`);
				emptyCart();
			}
		});
	}
	console.log(`cartList`, cartList);

	async function increaseQuantity(id) {
		setLoading({ [id]: true });
		await axios.put(`/product/${id}/user/${userId}/quantity/cart?action=inc`).then((res) => {
			if (res) {
				console.log(`here`, res?.data);

				getCartProducts(id);
			}
		});
	}

	async function decreaseQuantity(id) {
		setLoading({ [id]: true });
		await axios.put(`/product/${id}/user/${userId}/quantity/cart?action=desc`).then((res) => {
			if (res) {
				console.log(`here`, res?.data);

				getCartProducts(id);
			}
		});
	}

	async function removeFromCart(id) {
		setLoading({ [id]: true });
		await axios.delete(`/product/${id}/user/${userId}/remove/cart`).then((res) => {
			if (res) {
				console.log(`here`, res?.data);
				message.success('Product removed from the cart successfully');
				getCartProducts(id);
			}
		});
	}
	useEffect(() => {
		if (finalClientSecret) {
			console.log(`finalClientSecret`, finalClientSecret);
			const data = {
				userId: JSON.parse(localStorage.getItem('user'))?._id,
				paymentId: finalClientSecret,
				productsList: cartList,
				amount: offersLength > 0 ? totalValue : totalValue * 0.75,
				status: 'PENDING',
				admin_staus_comment: 'PENDING',
				is_delivered: 'N',
			};
			console.log(`data to add order`, data);
			createOrder(data);
		}
	}, [finalClientSecret]);

	useEffect(() => {
		const totalPrice = cartList.reduce(function (total, array) {
			return total + parseInt(array?.product?.product_price) * parseInt(array?.quantity);
		}, 0);
		setTotalValue(totalPrice);
	}, [cartList]);
	return (
		<>
			{offersLength === 0 && (
				<Confetti recycle={false} width={width} height={height} numberOfPieces={1000} initialVelocityX={3} />
			)}
			<div className="bg-white shadow rounded-lg p-6">
				{cartList?.length > 0 ? (
					<Row gutter={[24, 24]}>
						<Col xl={8} lg={8} md={8} sm={12} xs={12} style={{ maxHeight: '530px', overflow: 'auto' }}>
							{cartList?.map((item) => (
								<div className="m-4">
									<Badge.Ribbon
										className="cursor-pointer"
										text={
											<span
												onClick={() => {
													console.log(`1`, 1);
													removeFromCart(item?.product?._id);
												}}
											>
												Remove
											</span>
										}
									>
										<Card
											style={{
												width: 300,

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

												<PlusCircleTwoTone
													twoToneColor="limegreen"
													onClick={() => {
														increaseQuantity(item?.product?._id);
													}}
												/>,
												<MinusCircleTwoTone
													twoToneColor="red"
													onClick={() => {
														decreaseQuantity(item?.product?._id);
													}}
												/>,
												<Link to={`/product/${item?._id}`}>
													<EyeOutlined key="ellipsis" />
												</Link>,
											]}
										>
											<Meta
												avatar={
													<Skeleton loading={loading[item?.product?._id]}>
														<Badge count={item?.quantity}>
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
														</Badge>
													</Skeleton>
												}
												title={
													<Skeleton loading={loading[item?.product?._id]}>
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
													</Skeleton>
												}
												description={
													<div className="truncate">{item?.product?.product_description}</div>
												}
											/>
										</Card>
									</Badge.Ribbon>
								</div>
							))}
						</Col>
						<Col xl={14} lg={14} md={14} sm={12} xs={12}>
							{offersLength === 0 && (
								<Result
									status="success"
									title="Thank you for your trust in us"
									subTitle="On your first order we would like a give you a discount of 15%, enjoy!!."
								/>
							)}
							<div className={classNames(offersLength > 0 && 'mt-28')}>
								<StripePayment
									total={totalValue}
									setFinalClientSecret={setFinalClientSecret}
									offersLength={offersLength}
								/>
							</div>
						</Col>
					</Row>
				) : (
					<Result
						status="404"
						title="404"
						subTitle="Sorry, there are no products on your cart."
						extra={
							<Link to={`/products/${userId}`}>
								<Button type="primary">
									Add Products <PlusCircleOutlined />
								</Button>
							</Link>
						}
					/>
				)}
			</div>
		</>
	);
};
export default Cart;
