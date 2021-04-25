/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Tag, Space, Button } from 'antd';
import { useHistory, useParams, Link } from 'react-router-dom';
import '../../../App.css';
import axios from '../../../axios';
import { EyeTwoTone } from '@ant-design/icons';

const AllOrders = () => {
	const [orderList, setOrderList] = useState([]);
	const { userId } = useParams();
	console.log(`orderList`, orderList);
	async function getOrders() {
		const req = await axios.get(`/orders/all?user=${userId}`);
		if (req) {
			setOrderList(req?.data);
		}
	}
	useEffect(() => {
		getOrders();
	}, []);
	let history = useHistory();
	const columns = [
		{
			title: 'Order Id',
			dataIndex: '_id',
			render: (text) => <div className="w-full"># {text}</div>,
		},
		{
			title: 'Price',
			dataIndex: 'amount',
			render: (text) => <div>INR {text}</div>,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (text) => <div> {text || '-'}</div>,
		},
		{
			title: 'Category',
			dataIndex: 'category',
			render: (category) => (
				<div className="w-full flex">
					<Tag color="volcano" key={category}>
						{category || 'NONE'}
					</Tag>
				</div>
			),
		},
		{
			title: 'Items',
			dataIndex: 'productsList',
			render: (data) => <div className="w-full flex">{data?.length}</div>,
		},
		{
			key: 'action',
			align: 'right',
			render: (text, record) => (
				<Space size="middle">
					<Link to={`/order/${record?._id}/user/${record?.userId}`}>
						<Button type="primary">
							<EyeTwoTone /> View
						</Button>
					</Link>
				</Space>
			),
		},
	];

	return (
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
				dataSource={orderList}
			/>
		</div>
	);
};

export default AllOrders;
