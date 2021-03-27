/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Row, Col, Tooltip, Tag, Carousel } from 'antd';
import { EyeOutlined, StarTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import StripePayment from '../StripePayment';
import axios from '../../../axios';

const Cart = ({ currentUser, setCurrentUser, setCartValue }) => {
	const [cartList, setCartList] = useState([]);
	const [totalValue, setTotalValue] = useState([]);
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
	useEffect(() => {
		if (userId) getCartProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	useEffect(() => {
		const totalPrice = cartList.reduce(function (total, array) {
			return total + parseInt(array?.product?.product_price);
		}, 0);
		setTotalValue(totalPrice);
	}, [cartList]);
	return (
		<div className="bg-white shadow rounded-lg p-6">
			{cartList?.length > 0 && (
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
						<StripePayment total={totalValue} />
					</Col>
				</Row>
			)}
		</div>
	);
};
export default Cart;
