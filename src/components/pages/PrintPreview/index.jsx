import { Button, Divider, Skeleton, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import axios from '../../../axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Discount from '../../../images/discount.png';
import Product from '../../../images/product.png';
import Logo from '../../../images/ORDER.png';
import './index.css';

const PrintPreview = ({ reff }) => {
	const { userId, orderId } = useParams();
	const [orderData, setOrderData] = useState();
	useEffect(() => {
		async function getOrderData() {
			const req = await axios.get(`/order/${orderId}`);
			if (req) {
				console.log(`data of particular order`, req?.data);

				setOrderData(req?.data[0]);
			}
		}
		getOrderData();
	}, [userId, orderId]);

	return (
		<div className="">
			<div className="mx-auto" ref={reff} style={{ width: '875px' }}>
				<div className="bg-white rounded mb-4 px-8 py-4">
					<div className="flex justify-between">
						<div>
							<img src={Logo} width="70px" height="10px" alt="logo" />
						</div>
						<div className="text-md text-right items-center mt-6">
							# <span className="font-bold">{orderData?._id}</span>
						</div>
					</div>
					<div className="flex justify-between items-center">
						<div className="headingLeftBorder" />

						<div className="text-center font-bold">
							<>
								<div>INVOICE</div>
								<div>FOR ORDER</div>
							</>
						</div>

						<div className="headingRightBorder" />
					</div>
					<>
						<div className="flex justify-between mt-2">
							<div className="font-bold capitalize">
								User:{' '}
								{`
									${JSON.parse(localStorage.getItem('user'))?.first_name} ${'   '}
									${JSON.parse(localStorage.getItem('user'))?.last_name}
								`}
							</div>
							<div className="font-bold capitalize">
								Username:{' '}
								{`
									${JSON.parse(localStorage.getItem('user'))?.username} 
								`}
							</div>
						</div>
					</>

					<Divider style={{ 'background-color': 'black' }} />
					{/* price, payment method, payment id, status, admin response,productlist,sign,date of purchase */}
					<div className="font-bold capitalize">Price: {`INR	${orderData?.amount} `}</div>
					<div className="font-bold capitalize mt-2">Payment method: Online mode (By Card)</div>
					<div className="font-bold capitalize mt-2">Payment Id: {`${orderData?.paymentId} `}</div>
					<div className="font-bold capitalize mt-2">Status: {`${orderData?.category} `}</div>
					<div className="flex justify-between">
						<div className="font-bold capitalize mt-2">
							Admin response: {`${orderData?.admin_status_comment} `}
						</div>
						<div className="font-bold capitalize mt-2">
							Date/Time:{' '}
							{`${moment(orderData?.action_by_admin).format('DD MMM YYYY')} at ${moment(
								orderData?.action_by_admin
							).format('hh:mm:ss')}  `}
						</div>
					</div>
					<div className="my-12">
						{orderData?.productsList?.map((item) => (
							<div className="flex justify-between">
								<div className="flex">
									<img src={Product} alt="product" />
									<div className="font-bold">
										<div>{item?.product?.product_name}</div>
										<div className="flex">
											<div className="bg-blue-500 rounded-full px-2 mr-2">
												Quantity: {item?.quantity}
											</div>
											<div className={classNames('bg-green-500', 'rounded-full px-2')}>
												Price: INR{item?.product?.product_price}
											</div>
										</div>
									</div>
								</div>
								<div>
									<img src={Discount} alt="discount" />
								</div>
							</div>
						))}
					</div>
					<div className="flex justify-between mt-4">
						<div>
							<img
								src={
									orderData?.signature ||
									'data:image/png;base64,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'
								}
							/>
						</div>
						<div className="font-bold">
							Date/Time of purchase:{' '}
							{`${moment(orderData?.createdAt).format('DD MMM YYYY')} at ${moment(
								orderData?.createdAt
							).format('hh:mm:ss')}  `}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrintPreview;
