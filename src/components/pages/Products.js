import React, { useEffect, useState } from 'react';
import { Card, Avatar, Row, Col, Tooltip, Tag, message, Carousel, Button, Result, Space, Table } from 'antd';
import { Link, useParams, useHistory } from 'react-router-dom';
import { EyeOutlined, StarTwoTone, ShoppingTwoTone, PlusCircleOutlined, EyeTwoTone } from '@ant-design/icons';
import axios from '../../axios';
import '../../App.css';

const Products = ({ currentUser, setCurrentUser, setCartValue }) => {
	const [productList, setProductList] = useState([]);
	const [productRetailerList, setProductRetailerList] = useState([]);
	const { userId, retailerId } = useParams();
	const { Meta } = Card;
	const history = useHistory();
	console.log(`productRetailerList`, productRetailerList);
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

	async function getProducts() {
		console.log(`here`);
		const req = await axios.get('/product/all/customer');
		if (req) {
			setProductList(req?.data);
		}
	}
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
			} else {
				message.error('Simillar product already exist in your cart');
			}
			console.log(`res while adding product to cart`, res);
		}
	}

	async function getRetailerProducts() {
		const req = await axios.get(`/product/all/retailer/${userId}`);
		if (req) {
			console.log(`req retailer data`, req);
			setProductRetailerList(req?.data);
		}
	}

	useEffect(() => {
		if (currentUser?.role !== 'retailer') getProducts();
		else getRetailerProducts();
	}, [currentUser]);
	console.log(`currentUser`, currentUser);
	const columns = [
		{
			title: 'Product Name',
			dataIndex: 'product_name',
			render: (text, record) => <div className="underline text-blue-400">{text}</div>,
		},
		{
			title: 'Price',
			dataIndex: 'product_price',
			render: (text) => <div>$ {text}</div>,
		},
		{
			title: 'Rating',
			dataIndex: 'product_rating',
			render: (text) => <div> {text}</div>,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (text) => <div> {text}</div>,
		},
		{
			title: 'Category',
			dataIndex: 'product_category',
			render: (category) => (
				<div className="w-full flex">
					{category.map((item) => {
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
			),
		},
		{
			key: 'action',
			align: 'right',
			render: (text, record) => (
				<Space size="middle">
					<div
						className="text-blue-400 cursor-pointer"
						onClick={() => history.replace(`/product/${record._id}`)}
					>
						<EyeTwoTone /> View
					</div>
				</Space>
			),
		},
	];

	return (
		<div className="bg-white shadow rounded-lg p-6">
			{currentUser?.role !== 'retailer' && productList?.length > 0 ? (
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
			) : (
				<>
					{productRetailerList?.length < 1 ? (
						<Result
							status="404"
							title="404"
							subTitle="Sorry, there are no products to display."
							extra={
								<Link to={`/products/add/${userId}`}>
									<Button type="primary">
										Add Products <PlusCircleOutlined />
									</Button>
								</Link>
							}
						/>
					) : (
						<div className=" mt-12 shadow rounded-lg p-4">
							<Table
								onRow={(record, rowIndex) => {
									return {
										onClick: () => {
											console.log('record', record);
										}, // click row
									};
								}}
								scroll={{ x: 400, y: 300 }}
								columns={columns}
								dataSource={productRetailerList}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};
export default Products;
