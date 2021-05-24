import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import PrintPreview from '../PrintPreview';

const PrintMonitoringForm = () => {
	const componentRef = useRef();

	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<div className="container mx-auto">
			<div className=" flex justify-end" style={{ marginTop: '3rem', marginRight: '14.3rem' }}>
				<Button onClick={handlePrint} type="primary" size="medium">
					<PrinterOutlined /> Print
				</Button>
			</div>
			<div className="mt-2">
				<PrintPreview reff={componentRef} />
			</div>
		</div>
	);
};

export default PrintMonitoringForm;
