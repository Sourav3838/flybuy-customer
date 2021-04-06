/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Avatar, Row, Col, Tooltip, Tag, Carousel, message, Result, Button } from 'antd';
import { EyeOutlined, StarTwoTone, CheckCircleTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import StripePayment from '../StripePayment';
import axios from '../../../axios';

const Cart = ({ currentUser, setCurrentUser, setCartValue }) => {
	let history = useHistory();
	const [cartList, setCartList] = useState([]);
	const [totalValue, setTotalValue] = useState([]);
	const [finalClientSecret, setFinalClientSecret] = useState();
	const { Meta } = Card;
	const { userId } = useParams();
	async function getCartProducts() {
		console.log(`cart product`);
		console.log(`userId`, userId);
		const response = await axios.get(`/user/${userId}/cart`);
		if (response) {
			setCartList(response?.data);
		}
	}
	console.log(`totalValue`, totalValue);
	console.log(`cartList`, cartList);

	async function emptyCart() {
		console.log(`to empty`);
		const response = await axios.get(`/cart/${userId}/empty`);
		if (response) {
			message.success('Order created successfully');
			history.replace(`/order/user/${userId}`);
		} else {
			console.log(`no response`);
		}
	}
	useEffect(() => {
		if (userId) getCartProducts();
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

	useEffect(() => {
		if (finalClientSecret) console.log(`finalClientSecret`, finalClientSecret);
		const data = {
			userId: JSON.parse(localStorage.getItem('user'))?._id,
			paymentId: finalClientSecret,
			productsList: cartList,
			amount: totalValue,
			status: 'PENDING',
			admin_staus_comment: 'PENDING',
			is_delivered: 'N',
		};
		console.log(`data to add order`, data);
		createOrder(data);
	}, [finalClientSecret]);

	useEffect(() => {
		const totalPrice = cartList.reduce(function (total, array) {
			return total + parseInt(array?.product?.product_price);
		}, 0);
		setTotalValue(totalPrice);
	}, [cartList]);
	return (
		<div className="bg-white shadow rounded-lg p-6">
			{cartList?.length > 0 ? (
				<Row gutter={[24, 24]}>
					<Col xl={8} lg={8} md={8} sm={12} xs={12} style={{ maxHeight: '530px', overflow: 'auto' }}>
						{cartList?.map((item) => (
							<div className="m-4">
								<Card
									style={{ width: 300 }}
									cover={
										<Carousel autoplay>
											{item?.product?.ImageURLOne?.url && (
												<div>
													<img alt="example" src={item?.product?.ImageURLOne?.url} />
												</div>
											)}

											{item?.product?.ImageURLTwo?.url && (
												<div>
													<img alt="example" src={item?.product?.ImageURLTwo?.url} />
												</div>
											)}

											{item?.product?.ImageURLThree?.url && (
												<div>
													<img alt="example" src={item?.product?.ImageURLThree?.url} />
												</div>
											)}

											{item?.product?.ImageURLFour?.url && (
												<div>
													<img alt="example" src={item?.product?.ImageURLFour?.url} />
												</div>
											)}

											{item?.product?.ImageURLFive?.url && (
												<div>
													<img alt="example" src={item?.product?.ImageURLFive?.url} />
												</div>
											)}
										</Carousel>
									}
									actions={[
										<Tooltip title={item?.product?.product_rating}>
											<StarTwoTone key="rating" twoToneColor="yellow" />
										</Tooltip>,
										<CheckCircleTwoTone twoToneColor="#52c41a" />,
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
												<span className="capitalize">$ {item?.product?.product_price}</span>
											</Avatar>
										}
										title={
											<div className="w-full flex justify-between">
												<div>{item?.product?.product_name}</div>{' '}
												<div>
													{item?.product?.product_category?.map((category) => {
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
										description={
											<div className="truncate">{item?.product?.product_description}</div>
										}
									/>
								</Card>
							</div>
						))}
					</Col>
					<Col xl={14} lg={14} md={14} sm={12} xs={12}>
						<StripePayment total={totalValue} setFinalClientSecret={setFinalClientSecret} />
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
	);
};
export default Cart;
