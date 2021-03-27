/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Divider, Card, Tabs, Tag, message, Image } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import '../../../App.css';
import axios from '../../../axios';
import { CheckCircleFilled } from '@ant-design/icons';
import StarRatings from 'react-star-ratings';

const ViewProducts = ({ setCartValue, currentUser }) => {
	const { Meta } = Card;
	let history = useHistory();
	const [productData, setProductData] = useState();
	const [previewImage, setPreviewImage] = useState('');

	const { TabPane } = Tabs;
	const { productId } = useParams();
	console.log(`productData`, productData);
	async function getProductData() {
		const req = await axios.get(`/product/${productId}`);
		if (req) {
			console.log(`data of particular product`, req?.data);
			setPreviewImage(req?.data[0]?.ImageURLOne?.url);
			setProductData(req?.data[0]);
		}
	}

	useEffect(() => {
		getProductData();
	}, [productId]);

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
			}
			console.log(`res`, res);
		}
	}
	return (
		<>
			<div>
				<Row gutter={[24, 12]} className="px-12">
					<Col xl={24} lg={24} md={24} sm={24} xs={24}>
						{productData && (
							<>
								<div
									className=" mt-12 shadow rounded-lg p-4 flex justify-between"
									style={{
										boxShadow: '10px 14px 18px #00ff66',
									}}
								>
									<div className="font-bold text-lg">{productData?.product_name}</div>
									<div>
										<Button
											type="primary"
											onClick={() => {
												console.log(`productData`, productData);
												addToCart(productData?._id);
											}}
										>
											<CheckCircleFilled /> Add To Cart
										</Button>
									</div>
								</div>

								<div className="my-6 shadow rounded-lg">
									{productData && (
										<>
											<Row gutter={[24, 12]}>
												<Col xl={8} lg={8} md={8} sm={24} xs={24}>
													<div
														style={{
															maxHeight: '470px',
															overflow: 'auto',
															marginLeft: '5%',
														}}
														className="cardStyling"
													>
														{productData?.ImageURLOne?.secure_url && (
															<Image
																width={300}
																src={productData?.ImageURLOne?.secure_url}
															/>
														)}
														{productData?.ImageURLTwo?.secure_url && (
															<Image
																width={300}
																src={productData?.ImageURLTwo?.secure_url}
															/>
														)}
														{productData?.ImageURLThree?.secure_url && (
															<Image
																width={300}
																src={productData?.ImageURLThree?.secure_url}
															/>
														)}
														{productData?.ImageURLFour?.secure_url && (
															<Image
																width={300}
																src={productData?.ImageURLFour?.secure_url}
															/>
														)}
														{productData?.ImageURLFive?.secure_url && (
															<Image
																width={300}
																src={productData?.ImageURLFive?.secure_url}
															/>
														)}
													</div>
												</Col>
												<Divider type="vertical" />
												<Col xl={12} lg={12} md={12} sm={24} xs={24}>
													<div className="mb-12">
														<h3>Description</h3>
														<div className="font-semibold">
															{productData && productData?.product_description}
														</div>
													</div>
													<div className="mb-12">
														<h3>Price</h3>
														<div className="font-semibold">
															{productData && productData?.product_price}
														</div>
													</div>
													<div className="mb-12">
														<h3>Rating</h3>
														<div className="font-semibold">
															<StarRatings
																rating={parseInt(productData?.product_rating)}
																starRatedColor="yellow"
																numberOfStars={5}
																name="rating"
															/>
														</div>
													</div>
													<h3>Category</h3>
													<div className="font-semibold">
														{productData &&
															productData?.product_category?.map((item) => {
																let color = item.length === 5 ? 'geekblue' : 'green';
																if (item === 'Children') {
																	color = 'volcano';
																}
																if (item === 'Home Accessories') {
																	color = 'Yellow';
																}
																return (
																	<Tag color={color} key={item}>
																		{item.toUpperCase()}
																	</Tag>
																);
															})}
													</div>
												</Col>
											</Row>
										</>
									)}
								</div>
							</>
						)}
					</Col>
				</Row>
			</div>
		</>
	);
};

export default ViewProducts;
